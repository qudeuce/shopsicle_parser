import { parseHTML } from "./parser.ts";
import { HTML, Item } from "./types.ts";

export function parse(html: HTML, url: URL): Item[] {
  return parseHTML(html, url);
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Investigate the module metadata in import.meta");
}
