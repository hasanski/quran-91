// Assembles `deploy/`, a self-contained copy of the site for the Windows host,
// which runs it with `node start.js` under IIS and has no npm or shell.
// `npm run deploy` builds first; see README → Deployment.
import { cp, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy");
const standalone = path.join(root, ".next", "standalone");
const staticDir = path.join(root, ".next", "static");

for (const required of [path.join(standalone, "server.js"), staticDir, path.join(root, "web.config")]) {
  const exists = await stat(required).catch(() => null);
  if (!exists) {
    throw new Error(`Missing ${path.relative(root, required)}. Run \`npm run build\` first.`);
  }
}

await rm(out, { recursive: true, force: true });
// dereference: turn any symlink/junction into real files so the folder can move
await cp(standalone, out, { recursive: true, dereference: true });
// The standalone server serves these two only when they sit inside it
await cp(path.join(root, "public"), path.join(out, "public"), { recursive: true });
await cp(staticDir, path.join(out, ".next", "static"), { recursive: true });
await cp(path.join(root, "web.config"), path.join(out, "web.config"));

// IIS writes this file's output to logs\node_*.log (see web.config). The first
// line records the Node version, which is the only way to see it on the host.
await writeFile(
  path.join(out, "start.js"),
  `console.log("[quran-91] Node " + process.version);
require("./server.js");
`,
);

let files = 0;
let bytes = 0;
for (const entry of await readdir(out, { recursive: true, withFileTypes: true })) {
  if (entry.isFile()) {
    files += 1;
    bytes += (await stat(path.join(entry.parentPath, entry.name))).size;
  }
}
console.log(`Ready: deploy/ (${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB). Upload its contents to the site root.`);
