import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { OPP_PROTOCOL_VERSION, type ShipReceiptVerifyBody } from "@opp/schema";
import { parseOpenProgramMarkdown, summarizeProgram } from "@opp/parse";
import { evaluateSpendLicense, verifyShipReceipt } from "@opp/verify";

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

/**
 * OPP hosted API — parse Open Program, evaluate Spend License, verify Ship Receipt.
 * First runtime consumer: Coppergate (architecture bind + Accept receipt).
 */
export function createApiServer() {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const path = url.pathname;

    if (path === "/health" || path === "/ready") {
      sendJson(res, 200, {
        ok: true,
        protocolVersion: OPP_PROTOCOL_VERSION,
        product: "opp",
      });
      return;
    }

    if (req.method === "POST" && path === "/v1/programs/parse") {
      const body = (await readJsonBody(req)) as {
        markdown?: string;
        programId?: string;
      };
      if (!body.markdown || typeof body.markdown !== "string") {
        sendJson(res, 400, { error: "markdown_required" });
        return;
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      sendJson(res, 200, {
        protocolVersion: OPP_PROTOCOL_VERSION,
        programId: body.programId ?? "inline",
        rows,
        summary: summarizeProgram(rows),
      });
      return;
    }

    if (req.method === "POST" && path === "/v1/spend/evaluate") {
      const body = (await readJsonBody(req)) as {
        markdown?: string;
        openId?: string | null;
      };
      if (!body.markdown) {
        sendJson(res, 400, { error: "markdown_required" });
        return;
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const decision = evaluateSpendLicense(rows, body.openId);
      sendJson(res, decision.allowed ? 200 : 403, { decision });
      return;
    }

    if (req.method === "POST" && path === "/v1/receipts/verify") {
      const body = (await readJsonBody(req)) as {
        markdown?: string;
        receipt?: ShipReceiptVerifyBody;
      };
      if (!body.markdown || !body.receipt) {
        sendJson(res, 400, { error: "markdown_and_receipt_required" });
        return;
      }
      const rows = parseOpenProgramMarkdown(body.markdown);
      const result = verifyShipReceipt(rows, body.receipt);
      sendJson(res, result.ok ? 200 : 422, { result });
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  });
}
