/**
 * @deprecated Prefer repo-root `api/[...path].ts` for the opp-api Vercel project (A-020).
 * Kept so local apps/api deploys still resolve after build.
 */
import { handleOppRequest } from "../dist/handler.js";

export default async function handler(request: Request): Promise<Response> {
  return handleOppRequest(request);
}
