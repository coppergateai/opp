import { spawnSync } from "node:child_process";

const r = spawnSync("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(r.status ?? 1);
