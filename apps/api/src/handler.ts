import {
  loadHostedOpenApi,
  loadProtocolManifest,
  loadProtocolSchema,
  OPP_PROTOCOL_VERSION,
  type ShipReceiptVerifyBody,
} from "@opp/schema";
import { parseOpenProgramMarkdown, summarizeProgram } from "@opp/parse";
import { evaluateSpendLicense, verifyShipReceipt } from "@opp/verify";

export type ApiErrorBody = {
  error: string;
  message: string;
  details?: unknown;
};

/** A-030 — max JSON body size for POST routes (256 KiB). */
export const MAX_BODY_BYTES = 256 * 1024;

/** A-050 — soft per-IP sliding window (in-process; best-effort on serverless). */
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 120;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

export function clientIpFromRequest(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 128);
  return "unknown";
}

export function consumeRateLimit(
  ip: string,
  now = Date.now(),
): { ok: true; remaining: number } | { ok: false; retryAfterSec: number } {
  const key = ip || "unknown";
  let bucket = rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(key, bucket);
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true, remaining: RATE_LIMIT_MAX - bucket.count };
}

/** Test helper — clear in-process rate buckets. */
export function resetRateLimitBucketsForTests(): void {
  rateBuckets.clear();
}

/** A-040 — browser origins allowed to call the Community API. */
export const CORS_ALLOWED_ORIGINS = [
  "https://opp.coppergate.ai",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
] as const;

export function resolveCorsOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  return (CORS_ALLOWED_ORIGINS as readonly string[]).includes(origin)
    ? origin
    : null;
}

function corsHeaders(request: Request): Record<string, string> {
  const allowed = resolveCorsOrigin(request);
  const headers: Record<string, string> = {
    "access-control-allow-methods": "GET, HEAD, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
  if (allowed) {
    headers["access-control-allow-origin"] = allowed;
    headers.vary = "Origin";
  }
  return headers;
}

function jsonResponse(
  status: number,
  body: unknown,
  request?: Request,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(request ? corsHeaders(request) : {}),
    },
  });
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  request?: Request,
): Response {
  const body: ApiErrorBody = { error: code, message };
  if (details !== undefined) body.details = details;
  return jsonResponse(status, body, request);
}

function jsonContentTypeOk(request: Request): boolean {
  const raw = request.headers.get("content-type") ?? "";
  const media = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  return media === "application/json";
}

function contentLengthTooLarge(request: Request): boolean {
  const len = request.headers.get("content-length");
  if (len === null || len === "") return false;
  const n = Number(len);
  return Number.isFinite(n) && n > MAX_BODY_BYTES;
}

async function readJsonBody(
  request: Request,
): Promise<
  | { ok: true; value: unknown }
  | {
      ok: false;
      status: number;
      error: string;
      message: string;
      details?: unknown;
    }
> {
  if (!jsonContentTypeOk(request)) {
    return {
      ok: false,
      status: 415,
      error: "unsupported_media_type",
      message: "POST bodies must use Content-Type: application/json",
    };
  }
  if (contentLengthTooLarge(request)) {
    return {
      ok: false,
      status: 413,
      error: "payload_too_large",
      message: `Request body exceeds ${MAX_BODY_BYTES} bytes`,
      details: { maxBytes: MAX_BODY_BYTES },
    };
  }

  const buf = new Uint8Array(await request.arrayBuffer());
  if (buf.byteLength > MAX_BODY_BYTES) {
    return {
      ok: false,
      status: 413,
      error: "payload_too_large",
      message: `Request body exceeds ${MAX_BODY_BYTES} bytes`,
      details: { maxBytes: MAX_BODY_BYTES },
    };
  }
  if (buf.byteLength === 0) return { ok: true, value: {} };
  try {
    return {
      ok: true,
      value: JSON.parse(new TextDecoder().decode(buf)) as unknown,
    };
  } catch {
    return {
      ok: false,
      status: 400,
      error: "invalid_json",
      message: "Request body must be valid JSON",
    };
  }
}

function parsePage(input: {
  limit?: unknown;
  offset?: unknown;
}):
  | { ok: true; limit: number | null; offset: number }
  | { ok: false; code: string; message: string } {
  const offsetRaw = input.offset;
  const limitRaw = input.limit;

  let offset = 0;
  if (offsetRaw !== undefined && offsetRaw !== null) {
    if (
      typeof offsetRaw !== "number" ||
      !Number.isInteger(offsetRaw) ||
      offsetRaw < 0
    ) {
      return {
        ok: false,
        code: "invalid_offset",
        message: "offset must be a non-negative integer",
      };
    }
    offset = offsetRaw;
  }

  if (limitRaw === undefined || limitRaw === null) {
    return { ok: true, limit: null, offset };
  }
  if (typeof limitRaw !== "number" || !Number.isInteger(limitRaw)) {
    return {
      ok: false,
      code: "invalid_limit",
      message: "limit must be an integer between 1 and 500",
    };
  }
  if (limitRaw < 1 || limitRaw > 500) {
    return {
      ok: false,
      code: "invalid_limit",
      message: "limit must be an integer between 1 and 500",
    };
  }
  return { ok: true, limit: limitRaw, offset };
}

/** Strip Vercel `/api` rewrite prefix when present. */
export function normalizeApiPath(pathname: string): string {
  if (pathname === "/api") return "/";
  if (pathname.startsWith("/api/")) {
    const rest = pathname.slice(4);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname;
}

function bodyError(
  parsed: {
    status: number;
    error: string;
    message: string;
    details?: unknown;
  },
  request: Request,
): Response {
  return errorResponse(
    parsed.status,
    parsed.error,
    parsed.message,
    parsed.details,
    request,
  );
}

/**
 * Fetch-compatible OPP API handler (A-020 / A-030 / A-040 / A-050).
 * Used by Node `createApiServer` and Vercel serverless.
 */
export async function handleOppRequest(request: Request): Promise<Response> {
  const ok = (status: number, body: unknown) =>
    jsonResponse(status, body, request);
  const fail = (
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) => errorResponse(status, code, message, details, request);

  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    const url = new URL(request.url);
    const path = normalizeApiPath(url.pathname);
    const method = request.method.toUpperCase();

    if (path !== "/health" && path !== "/ready") {
      const limited = consumeRateLimit(clientIpFromRequest(request));
      if (!limited.ok) {
        return new Response(
          JSON.stringify({
            error: "rate_limited",
            message: `Too many requests — retry after ${limited.retryAfterSec}s`,
            details: {
              retryAfterSec: limited.retryAfterSec,
              limit: RATE_LIMIT_MAX,
              windowMs: RATE_LIMIT_WINDOW_MS,
            },
          }),
          {
            status: 429,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "retry-after": String(limited.retryAfterSec),
              ...corsHeaders(request),
            },
          },
        );
      }
    }

    if (path === "/health" || path === "/ready") {
      if (method !== "GET" && method !== "HEAD") {
        return fail(405, "method_not_allowed", "Use GET");
      }
      return ok(200, {
        ok: true,
        protocolVersion: OPP_PROTOCOL_VERSION,
        product: "opp",
      });
    }

    if (path === "/v1/openapi.json") {
      if (method !== "GET") {
        return fail(405, "method_not_allowed", "Use GET");
      }
      return ok(200, loadHostedOpenApi());
    }

    if (path === "/v1/schemas") {
      if (method !== "GET") {
        return fail(405, "method_not_allowed", "Use GET");
      }
      return ok(200, loadProtocolManifest());
    }

    const schemaMatch = path.match(/^\/v1\/schemas\/([a-z0-9-]+)$/);
    if (schemaMatch) {
      if (method !== "GET") {
        return fail(405, "method_not_allowed", "Use GET");
      }
      const schemaId = schemaMatch[1]!;
      const schema = loadProtocolSchema(schemaId);
      if (!schema) {
        return fail(
          404,
          "schema_not_found",
          `Unknown schema id: ${schemaId}`,
        );
      }
      return ok(200, schema);
    }

    if (path === "/v1/programs/parse") {
      if (method !== "POST") {
        return fail(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody, request);
      }
      const body = parsedBody.value as {
        markdown?: string;
        programId?: string;
        limit?: number;
        offset?: number;
      };
      if (!body.markdown || typeof body.markdown !== "string") {
        return fail(
          400,
          "markdown_required",
          "Body field `markdown` (string) is required",
        );
      }
      const page = parsePage({ limit: body.limit, offset: body.offset });
      if (!page.ok) {
        return fail(400, page.code, page.message);
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const summary = summarizeProgram(rows);
      const sliced =
        page.limit === null
          ? rows
          : rows.slice(page.offset, page.offset + page.limit);
      return ok(200, {
        protocolVersion: OPP_PROTOCOL_VERSION,
        programId: body.programId ?? "inline",
        rows: sliced,
        summary,
        ...(page.limit === null
          ? {}
          : {
              page: {
                offset: page.offset,
                limit: page.limit,
                total: rows.length,
                hasMore: page.offset + page.limit < rows.length,
              },
            }),
      });
    }

    if (path === "/v1/spend/evaluate") {
      if (method !== "POST") {
        return fail(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody, request);
      }
      const body = parsedBody.value as {
        markdown?: string;
        openId?: string | null;
      };
      if (!body.markdown || typeof body.markdown !== "string") {
        return fail(
          400,
          "markdown_required",
          "Body field `markdown` (string) is required",
        );
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const decision = evaluateSpendLicense(rows, body.openId);
      return ok(decision.allowed ? 200 : 403, { decision });
    }

    if (path === "/v1/receipts/verify") {
      if (method !== "POST") {
        return fail(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody, request);
      }
      const body = parsedBody.value as {
        markdown?: string;
        receipt?: ShipReceiptVerifyBody;
      };
      if (
        !body.markdown ||
        typeof body.markdown !== "string" ||
        !body.receipt
      ) {
        return fail(
          400,
          "markdown_and_receipt_required",
          "Body fields `markdown` and `receipt` are required",
        );
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const result = verifyShipReceipt(rows, body.receipt);
      return ok(result.ok ? 200 : 422, { result });
    }

    return fail(404, "not_found", `No route for ${method} ${path}`);
  } catch (err) {
    return fail(
      500,
      "internal_error",
      err instanceof Error ? err.message : "Unexpected server error",
    );
  }
}
