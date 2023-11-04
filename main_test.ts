// import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { parse } from "./main.ts";

Deno.test(function parseAsosSingleProduct() {

    // get html text from test file
    const html = Deno.readTextFileSync("./test/test_files/asos_2.txt");
    const url = new URL("https://www.asos.com");
    const items = parse(html, url);

    console.log(items);
});

Deno.test(function parseAsosMixAndMatch() {
  // get html text from test file
  const html = Deno.readTextFileSync("./test/test_files/asos_3.txt");
  const url = new URL("https://www.asos.com");
  const items = parse(html, url);

  console.log(items);
});
