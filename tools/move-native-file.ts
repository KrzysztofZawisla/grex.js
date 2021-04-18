import { renameSync, mkdirSync, existsSync } from "fs";
// eslint-disable-next-line unicorn/import-style
import { join } from "path";
import { exit } from "process";

try {
  const folderPath: string = join(
    __dirname,
    "..",
    "src",
    "native",
    "native",
    "node-target",
  );
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }
  renameSync(
    join(__dirname, "..", "src", "native", "native", "index.node"),
    join(folderPath, "index.node"),
  );
} catch {
  // eslint-disable-next-line no-console
  console.error("File doesn't exist");
  exit(1);
}
