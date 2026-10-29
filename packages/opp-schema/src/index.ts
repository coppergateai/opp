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

export function isOpenId(value: string): boolean {
  return OPEN_ID_PATTERN.test(value.trim().toUpperCase());
}

export function normalizeOpenId(value: string): string {
  return value.trim().toUpperCase();
}
