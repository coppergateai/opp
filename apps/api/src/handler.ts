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

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, HEAD, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): Response {
  const body: ApiErrorBody = { error: code, message };
  if (details !== undefined) body.details = details;
  return jsonResponse(status, body);
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
): Response {
  return errorResponse(
    parsed.status,
    parsed.error,
    parsed.message,
    parsed.details,
  );
}

/**
 * Fetch-compatible OPP API handler (A-020 / A-030).
 * Used by Node `createApiServer` and Vercel serverless.
 */
export async function handleOppRequest(request: Request): Promise<Response> {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, HEAD, POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    const url = new URL(request.url);
    const path = normalizeApiPath(url.pathname);
    const method = request.method.toUpperCase();

    if (path === "/health" || path === "/ready") {
      if (method !== "GET" && method !== "HEAD") {
        return errorResponse(405, "method_not_allowed", "Use GET");
      }
      return jsonResponse(200, {
        ok: true,
        protocolVersion: OPP_PROTOCOL_VERSION,
        product: "opp",
      });
    }

    if (path === "/v1/openapi.json") {
      if (method !== "GET") {
        return errorResponse(405, "method_not_allowed", "Use GET");
      }
      return jsonResponse(200, loadHostedOpenApi());
    }

    if (path === "/v1/schemas") {
      if (method !== "GET") {
        return errorResponse(405, "method_not_allowed", "Use GET");
      }
      return jsonResponse(200, loadProtocolManifest());
    }

    const schemaMatch = path.match(/^\/v1\/schemas\/([a-z0-9-]+)$/);
    if (schemaMatch) {
      if (method !== "GET") {
        return errorResponse(405, "method_not_allowed", "Use GET");
      }
      const schemaId = schemaMatch[1]!;
      const schema = loadProtocolSchema(schemaId);
      if (!schema) {
        return errorResponse(
          404,
          "schema_not_found",
          `Unknown schema id: ${schemaId}`,
        );
      }
      return jsonResponse(200, schema);
    }

    if (path === "/v1/programs/parse") {
      if (method !== "POST") {
        return errorResponse(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody);
      }
      const body = parsedBody.value as {
        markdown?: string;
        programId?: string;
        limit?: number;
        offset?: number;
      };
      if (!body.markdown || typeof body.markdown !== "string") {
        return errorResponse(
          400,
          "markdown_required",
          "Body field `markdown` (string) is required",
        );
      }
      const page = parsePage({ limit: body.limit, offset: body.offset });
      if (!page.ok) {
        return errorResponse(400, page.code, page.message);
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const summary = summarizeProgram(rows);
      const sliced =
        page.limit === null
          ? rows
          : rows.slice(page.offset, page.offset + page.limit);
      return jsonResponse(200, {
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
        return errorResponse(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody);
      }
      const body = parsedBody.value as {
        markdown?: string;
        openId?: string | null;
      };
      if (!body.markdown || typeof body.markdown !== "string") {
        return errorResponse(
          400,
          "markdown_required",
          "Body field `markdown` (string) is required",
        );
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const decision = evaluateSpendLicense(rows, body.openId);
      return jsonResponse(decision.allowed ? 200 : 403, { decision });
    }

    if (path === "/v1/receipts/verify") {
      if (method !== "POST") {
        return errorResponse(405, "method_not_allowed", "Use POST");
      }
      const parsedBody = await readJsonBody(request);
      if (!parsedBody.ok) {
        return bodyError(parsedBody);
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
        return errorResponse(
          400,
          "markdown_and_receipt_required",
          "Body fields `markdown` and `receipt` are required",
        );
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const result = verifyShipReceipt(rows, body.receipt);
      return jsonResponse(result.ok ? 200 : 422, { result });
    }

    return errorResponse(404, "not_found", `No route for ${method} ${path}`);
  } catch (err) {
    return errorResponse(
      500,
      "internal_error",
      err instanceof Error ? err.message : "Unexpected server error",
    );
  }
}
