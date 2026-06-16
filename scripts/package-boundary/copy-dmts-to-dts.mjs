#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const dist = path.resolve(process.argv[2] ?? "dist");
if (!existsSync(dist)) {
  console.error(`No dist directory found at ${dist}`);
  process.exit(1);
}

let copied = 0;
for (const file of await listFiles(dist)) {
  if (file.endsWith(".d.mts")) {
    const target = file.replace(/\.d\.mts$/, ".d.ts");
    const text = await readFile(file, "utf8");
    await writeFile(
      target,
      text.replace(
        /\/\/# sourceMappingURL=(.+)\.d\.mts\.map/g,
        "//# sourceMappingURL=$1.d.ts.map",
      ),
    );
    copied++;
  }

  if (file.endsWith(".d.mts.map")) {
    const target = file.replace(/\.d\.mts\.map$/, ".d.ts.map");
    const map = JSON.parse(await readFile(file, "utf8"));
    if (typeof map.file === "string") map.file = map.file.replace(/\.d\.mts$/, ".d.ts");
    await writeFile(target, `${JSON.stringify(map)}\n`);
    copied++;
  }
}

console.log(`copied ${copied} declaration files/maps from .d.mts to .d.ts`);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}
