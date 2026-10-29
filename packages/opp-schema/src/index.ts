import openProgramSchema from "../protocol/v0.1.0/open-program.schema.json" with {
  type: "json",
};
import shipReceiptSchema from "../protocol/v0.1.0/ship-receipt.schema.json" with {
  type: "json",
};
import protocolManifest from "../protocol/v0.1.0/manifest.json" with {
  type: "json",
};
import hostedOpenApi from "../openapi/opp-hosted-v1.openapi.json" with {
  type: "json",
};

/** OPP protocol version for Open Program documents and Ship Receipts. */
export const OPP_PROTOCOL_VERSION = "0.1.0" as const;

/** Parser IDs used across Coppergate factory products. */
export const OPEN_ID_PATTERN = /^(?:P|W|A|S|AG|RT|SEC)-\d{2,4}$/;

export type OpenId = string;

export type ProgramRowStatus = "open" | "done";

/** One spendable (or completed) line in an Open Program. */
export type OpenProgramRow = {
  id: OpenId;
  title: string;
  notes: string;
  status: ProgramRowStatus;
  section: string | null;
};

/** Portable Open Program document (JSON view of markdown SoT). */
export type OpenProgramDocument = {
  protocolVersion: typeof OPP_PROTOCOL_VERSION | string;
  programId: string;
  title: string;
  source?: {
    repo?: string;
    path?: string;
  };
  rows: OpenProgramRow[];
  createdAt?: string;
};

/** Public-safe Ship Receipt fields (aligns with Coppergate P-106). */
export type ShipReceiptVerifyBody = {
  kind: "ship_receipt";
  protocolVersion?: typeof OPP_PROTOCOL_VERSION | string;
  openId: OpenId | null;
  title: string;
  spendMicros: number;
  fitnessScore: number | null;
  ci: {
    acceptReady: boolean;
    blocking: boolean;
    passed: boolean;
    checkCount: number;
  };
  writeback: {
    architectureId: string | null;
    note: string;
  };
  acceptedAt: string;
};

export type ProtocolSchemaManifest = {
  protocolVersion: string;
  title: string;
  description: string;
  schemas: Array<{
    id: string;
    file: string;
    summary: string;
  }>;
};

const PROTOCOL_SCHEMAS: Record<string, Record<string, unknown>> = {
  "open-program": openProgramSchema as Record<string, unknown>,
  "ship-receipt": shipReceiptSchema as Record<string, unknown>,
};

/** Manifest of portable protocol JSON Schemas (P-010). */
export function loadProtocolManifest(): ProtocolSchemaManifest {
  return protocolManifest as ProtocolSchemaManifest;
}

/** Load a portable protocol schema by manifest id (`open-program` | `ship-receipt`). */
export function loadProtocolSchema(
  schemaId: string,
): Record<string, unknown> | null {
  return PROTOCOL_SCHEMAS[schemaId] ?? null;
}

/** Hosted HTTP API document version (URL prefix /v1). */
export const OPP_HOSTED_API_VERSION = "1.0.0" as const;

export type OpenApiDocument = {
  openapi: string;
  info: { title: string; version: string; description?: string };
  paths: Record<string, unknown>;
  components?: Record<string, unknown>;
};

/** Machine-readable OpenAPI 3.1 document for the hosted OPP service (A-010). */
export function loadHostedOpenApi(): OpenApiDocument {
  return hostedOpenApi as OpenApiDocument;
}

/**
 * Paths documented in OpenAPI that the hosted service implements (A-010).
 * Used by tests to keep docs and router aligned.
 */
export const DOCUMENTED_HOSTED_PATHS = [
  "/health",
  "/ready",
  "/v1/openapi.json",
  "/v1/schemas",
  "/v1/schemas/{schemaId}",
  "/v1/programs/parse",
  "/v1/spend/evaluate",
  "/v1/receipts/verify",
] as const;

/** @deprecated Prefer DOCUMENTED_HOSTED_PATHS — kept for P-010 call sites. */
export const DOCUMENTED_SCHEMA_PATHS = [
  "/v1/schemas",
  "/v1/schemas/{schemaId}",
] as const;

export function isOpenId(value: string): boolean {
  return OPEN_ID_PATTERN.test(value.trim().toUpperCase());
}

export function normalizeOpenId(value: string): string {
  return value.trim().toUpperCase();
}
