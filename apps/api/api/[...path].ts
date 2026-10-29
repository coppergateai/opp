/**
 * Vercel serverless entry (A-020) — catch-all under /api/* with root rewrites.
 */
import { handleOppRequest } from "../dist/handler.js";

export default async function handler(request: Request): Promise<Response> {
  return handleOppRequest(request);
}
