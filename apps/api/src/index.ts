import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
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

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendError(
  res: ServerResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  const body: ApiErrorBody = { error: code, message };
  if (details !== undefined) body.details = details;
  sendJson(res, status, body);
}

async function readJsonBody(
  req: IncomingMessage,
): Promise<{ ok: true; value: unknown } | { ok: false; error: string }> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  if (chunks.length === 0) return { ok: true, value: {} };
  try {
    return {
      ok: true,
      value: JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown,
    };
  } catch {
    return { ok: false, error: "invalid_json" };
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
    if (typeof offsetRaw !== "number" || !Number.isInteger(offsetRaw) || offsetRaw < 0) {
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

/**
 * OPP hosted API — parse Open Program, evaluate Spend License, verify Ship Receipt.
 * First runtime consumer: Coppergate (architecture bind + Accept receipt).
 * A-010: OpenAPI, consistent errors, optional parse pagination.
 */
export function createApiServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      const path = url.pathname;
      const method = req.method ?? "GET";

      if (path === "/health" || path === "/ready") {
        if (method !== "GET" && method !== "HEAD") {
          sendError(res, 405, "method_not_allowed", "Use GET");
          return;
        }
        sendJson(res, 200, {
          ok: true,
          protocolVersion: OPP_PROTOCOL_VERSION,
          product: "opp",
        });
        return;
      }

      if (path === "/v1/openapi.json") {
        if (method !== "GET") {
          sendError(res, 405, "method_not_allowed", "Use GET");
          return;
        }
        sendJson(res, 200, loadHostedOpenApi());
        return;
      }

      if (path === "/v1/schemas") {
        if (method !== "GET") {
          sendError(res, 405, "method_not_allowed", "Use GET");
          return;
        }
        sendJson(res, 200, loadProtocolManifest());
        return;
      }

      const schemaMatch = path.match(/^\/v1\/schemas\/([a-z0-9-]+)$/);
      if (schemaMatch) {
        if (method !== "GET") {
          sendError(res, 405, "method_not_allowed", "Use GET");
          return;
        }
        const schemaId = schemaMatch[1]!;
        const schema = loadProtocolSchema(schemaId);
        if (!schema) {
          sendError(res, 404, "schema_not_found", `Unknown schema id: ${schemaId}`);
          return;
        }
        sendJson(res, 200, schema);
        return;
      }

      if (path === "/v1/programs/parse") {
        if (method !== "POST") {
          sendError(res, 405, "method_not_allowed", "Use POST");
          return;
        }
        const parsedBody = await readJsonBody(req);
        if (!parsedBody.ok) {
          sendError(res, 400, "invalid_json", "Request body must be valid JSON");
          return;
        }
        const body = parsedBody.value as {
          markdown?: string;
          programId?: string;
          limit?: number;
          offset?: number;
        };
        if (!body.markdown || typeof body.markdown !== "string") {
          sendError(
            res,
            400,
            "markdown_required",
            "Body field `markdown` (string) is required",
          );
          return;
        }
        const page = parsePage({ limit: body.limit, offset: body.offset });
        if (!page.ok) {
          sendError(res, 400, page.code, page.message);
          return;
        }
        const rows = parseOpenProgramMarkdown(body.markdown);
        const summary = summarizeProgram(rows);
        const sliced =
          page.limit === null
            ? rows
            : rows.slice(page.offset, page.offset + page.limit);
        sendJson(res, 200, {
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
        return;
      }

      if (path === "/v1/spend/evaluate") {
        if (method !== "POST") {
          sendError(res, 405, "method_not_allowed", "Use POST");
          return;
        }
        const parsedBody = await readJsonBody(req);
        if (!parsedBody.ok) {
          sendError(res, 400, "invalid_json", "Request body must be valid JSON");
          return;
        }
        const body = parsedBody.value as {
          markdown?: string;
          openId?: string | null;
        };
        if (!body.markdown || typeof body.markdown !== "string") {
          sendError(
            res,
            400,
            "markdown_required",
            "Body field `markdown` (string) is required",
          );
          return;
        }
        const rows = parseOpenProgramMarkdown(body.markdown);
        const decision = evaluateSpendLicense(rows, body.openId);
        sendJson(res, decision.allowed ? 200 : 403, { decision });
        return;
      }

      if (path === "/v1/receipts/verify") {
        if (method !== "POST") {
          sendError(res, 405, "method_not_allowed", "Use POST");
          return;
        }
        const parsedBody = await readJsonBody(req);
        if (!parsedBody.ok) {
          sendError(res, 400, "invalid_json", "Request body must be valid JSON");
          return;
        }
        const body = parsedBody.value as {
          markdown?: string;
          receipt?: ShipReceiptVerifyBody;
        };
        if (!body.markdown || typeof body.markdown !== "string" || !body.receipt) {
          sendError(
            res,
            400,
            "markdown_and_receipt_required",
            "Body fields `markdown` and `receipt` are required",
          );
          return;
        }
        const rows = parseOpenProgramMarkdown(body.markdown);
        const result = verifyShipReceipt(rows, body.receipt);
        sendJson(res, result.ok ? 200 : 422, { result });
        return;
      }

      sendError(res, 404, "not_found", `No route for ${method} ${path}`);
    } catch (err) {
      sendError(
        res,
        500,
        "internal_error",
        err instanceof Error ? err.message : "Unexpected server error",
      );
    }
  });
}
