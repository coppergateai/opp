import { handleOppRequest } from "./handler.js";

async function handle(request: Request): Promise<Response> {
  try {
    return await handleOppRequest(request);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "function_crash",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const OPTIONS = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
