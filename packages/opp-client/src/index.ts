/**
 * First-party HTTP client for the OPP hosted API (P-030).
 * Default base URL matches local `@opp/api` (`http://127.0.0.1:8790`).
 * Production: set `OPP_API_URL` (A-020 → api.opp.coppergate.ai).
 */
import type {
  OpenApiDocument,
  ProtocolSchemaManifest,
  ShipReceiptVerifyBody,
} from "@opp/schema";

export type OppClientOptions = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type OppHealth = {
  ok: boolean;
  protocolVersion?: string;
  product?: string;
};

export type OppSpendDecision = {
  allowed: boolean;
  reason?: string;
  openId?: string;
};

export type OppReceiptVerifyResult = {
  ok: boolean;
  reason?: string;
  openId?: string;
};

export type OppParsePage = {
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type OppParseResult = {
  protocolVersion: string;
  programId: string;
  rows: unknown[];
  summary: {
    openCount: number;
    doneCount: number;
    openIds: string[];
  };
  page?: OppParsePage;
};

export type OppApiError = {
  error: string;
  message: string;
  details?: unknown;
  status: number;
};

export class OppClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(input: OppApiError) {
    super(input.message);
    this.name = "OppClientError";
    this.code = input.error;
    this.status = input.status;
    this.details = input.details;
  }
}

export class OppClient {
  readonly baseUrl: string;
  readonly #fetch: typeof fetch;

  constructor(options: OppClientOptions = {}) {
    this.baseUrl = (
      options.baseUrl ??
      process.env.OPP_API_URL ??
      "http://127.0.0.1:8790"
    ).replace(/\/$/, "");
    this.#fetch = options.fetch ?? fetch;
  }

  async health(): Promise<OppHealth> {
    const res = await this.#fetch(`${this.baseUrl}/health`);
    if (!res.ok) throw await this.#toError(res);
    return (await res.json()) as OppHealth;
  }

  async openApi(): Promise<OpenApiDocument> {
    const res = await this.#fetch(`${this.baseUrl}/v1/openapi.json`);
    if (!res.ok) throw await this.#toError(res);
    return (await res.json()) as OpenApiDocument;
  }

  async listSchemas(): Promise<ProtocolSchemaManifest> {
    const res = await this.#fetch(`${this.baseUrl}/v1/schemas`);
    if (!res.ok) throw await this.#toError(res);
    return (await res.json()) as ProtocolSchemaManifest;
  }

  async getSchema(schemaId: string): Promise<Record<string, unknown>> {
    const res = await this.#fetch(
      `${this.baseUrl}/v1/schemas/${encodeURIComponent(schemaId)}`,
    );
    if (!res.ok) throw await this.#toError(res);
    return (await res.json()) as Record<string, unknown>;
  }

  async parseProgram(input: {
    markdown: string;
    programId?: string;
    limit?: number;
    offset?: number;
  }): Promise<OppParseResult> {
    const res = await this.#fetch(`${this.baseUrl}/v1/programs/parse`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw await this.#toError(res);
    return (await res.json()) as OppParseResult;
  }

  async evaluateSpend(input: {
    markdown: string;
    openId?: string | null;
  }): Promise<OppSpendDecision> {
    const res = await this.#fetch(`${this.baseUrl}/v1/spend/evaluate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json()) as {
      decision?: OppSpendDecision;
      error?: string;
      message?: string;
    };
    if (!body.decision) {
      throw new OppClientError({
        error: body.error ?? `opp_spend_${res.status}`,
        message: body.message ?? `Spend evaluate failed (${res.status})`,
        status: res.status,
      });
    }
    return body.decision;
  }

  async verifyReceipt(input: {
    markdown: string;
    receipt: ShipReceiptVerifyBody | Record<string, unknown>;
  }): Promise<OppReceiptVerifyResult> {
    const res = await this.#fetch(`${this.baseUrl}/v1/receipts/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json()) as {
      result?: OppReceiptVerifyResult;
      error?: string;
      message?: string;
    };
    if (!body.result) {
      throw new OppClientError({
        error: body.error ?? `opp_verify_${res.status}`,
        message: body.message ?? `Receipt verify failed (${res.status})`,
        status: res.status,
      });
    }
    return body.result;
  }

  async #toError(res: Response): Promise<OppClientError> {
    let payload: { error?: string; message?: string; details?: unknown } = {};
    try {
      payload = (await res.json()) as typeof payload;
    } catch {
      /* ignore */
    }
    return new OppClientError({
      error: payload.error ?? `opp_http_${res.status}`,
      message: payload.message ?? `OPP request failed (${res.status})`,
      details: payload.details,
      status: res.status,
    });
  }
}
