import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { handleOppRequest } from "./handler.js";

export type { ApiErrorBody } from "./handler.js";
export {
  CORS_ALLOWED_ORIGINS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  clientIpFromRequest,
  consumeRateLimit,
  handleOppRequest,
  MAX_BODY_BYTES,
  normalizeApiPath,
  resetRateLimitBucketsForTests,
  resolveCorsOrigin,
} from "./handler.js";

async function incomingToRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? "127.0.0.1";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const method = req.method ?? "GET";
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  if (method === "GET" || method === "HEAD") {
    return new Request(url, { method, headers });
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return new Request(url, {
    method,
    headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });
}

async function writeResponse(
  res: ServerResponse,
  response: Response,
): Promise<void> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);
  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}

/**
 * OPP hosted API — Node HTTP server wrapping the Fetch handler (A-020).
 */
export function createApiServer() {
  return createServer(async (req, res) => {
    try {
      const request = await incomingToRequest(req);
      const response = await handleOppRequest(request);
      await writeResponse(res, response);
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          error: "internal_error",
          message:
            err instanceof Error ? err.message : "Unexpected server error",
        }),
      );
    }
  });
}
