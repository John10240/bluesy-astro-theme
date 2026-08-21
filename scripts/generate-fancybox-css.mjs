import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const upstreamPath = resolve(
  root,
  "node_modules/@fancyapps/ui/dist/fancybox/fancybox.css",
);
const customPath = resolve(root, "src/styles/fancybox-custom.css");
const outputPath = resolve(root, "public/assets/css/fancybox.css");

const upstream = readFileSync(upstreamPath, "utf8");
const custom = readFileSync(customPath, "utf8");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${upstream}\n\n${custom}\n`, "utf8");
console.log(`Generated ${outputPath}`);
