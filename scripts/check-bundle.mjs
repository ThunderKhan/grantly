import { readFileSync, readdirSync } from "node:fs";
import { log } from "node:console";
import { gzipSync } from "node:zlib";

const files = readdirSync("dist/assets");
const size = (name) => gzipSync(readFileSync(`dist/assets/${name}`)).length;
const entry = files.find((name) => /^index-.*\.js$/.test(name));
if (!entry)
  throw new Error("Build the application before checking bundle budgets.");
const budgets = [
  ["Entry JavaScript", size(entry), 100 * 1024],
  [
    "All JavaScript",
    files
      .filter((n) => n.endsWith(".js"))
      .reduce((total, n) => total + size(n), 0),
    // Frontend-only comparison, backup, calendar and official-source flows
    // add small route chunks; keep entry and stylesheet caps unchanged.
    120 * 1024,
  ],
  [
    "Stylesheets",
    files
      .filter((n) => n.endsWith(".css"))
      .reduce((total, n) => total + size(n), 0),
    // Workflow comparison table, decision fields and local backup controls.
    13 * 1024,
  ],
];
for (const [label, actual, maximum] of budgets) {
  log(
    `${label}: ${(actual / 1024).toFixed(1)} KiB gzip / ${maximum / 1024} KiB budget`,
  );
  if (actual > maximum)
    throw new Error(`${label} exceeded the regression budget.`);
}
