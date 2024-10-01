import test from "node:test";
import { importXYZ } from "../importXYZ.js";
import { readFile } from "node:fs/promises";


test("importXYZ", async () => {
  const text = await readFile(new URL("./data/test.xyz", import.meta.url), "utf8");
  importXYZ(text);


})