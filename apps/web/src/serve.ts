import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderLandingPage } from "./landing/page.js";

const port = Number(process.env.PORT ?? 8791);
const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);

const STATIC_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

async function tryServeStatic(
  urlPath: string,
): Promise<{ body: Buffer; type: string } | null> {
  if (!urlPath.startsWith("/") || urlPath.includes("\0") || urlPath.includes("..")) {
    return null;
  }
  const rel = decodeURIComponent(urlPath.slice(1));
  if (!rel || rel.includes("/") || rel.includes("\\")) return null;
  const filePath = path.resolve(publicDir, rel);
  if (!filePath.startsWith(publicDir + path.sep) && filePath !== publicDir) {
    return null;
  }
  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return { body, type: STATIC_TYPES[ext] ?? "application/octet-stream" };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const pathName = req.url?.split("?")[0] ?? "/";

  if (pathName === "/" || pathName === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(renderLandingPage());
    return;
  }

  const asset = await tryServeStatic(pathName);
  if (asset) {
    res.writeHead(200, {
      "content-type": asset.type,
      "cache-control": "public, max-age=86400",
    });
    res.end(asset.body);
    return;
  }

  res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
  res.end(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Not found — OPP</title></head><body><p>Not found.</p><p><a href="/">Home</a></p></body></html>`,
  );
}).listen(port, () => {
  console.log(`opp web listening on :${port}`);
});
