import { html, tag } from "./html.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("escapeHtml should escape html entities", () => {
  assertEquals(
    html(`<script>alert("R&D");</script>`),
    "&lt;script&gt;alert(&quot;R&amp;D&quot;);&lt;/script&gt;\n",
  );
});

Deno.test("boolean attributes should ommit attribute value", () => {
  assertEquals(
    html(tag("input", { checked: false })),
    "<input>\n",
  );
  assertEquals(
    html(tag("input", { checked: true })),
    "<input checked>\n",
  );
  assertEquals(
    html(tag("input", { checked: null })),
    "<input>\n",
  );
});

Deno.test("attributes should be properly escaped", () => {
  assertEquals(
    html(tag("input", { value: `a"b` })),
    `<input value="a&quot;b">\n`,
  );
});

Deno.test("script tag should always have closing tag", () => {
  assertEquals(
    html(tag("script")),
    "<script></script>\n",
  );
});

Deno.test("raw text elements should not be escaped", () => {
  assertEquals(
    html(
      tag("style", {}, `body { background-image: url("background.png"); }`),
      {
        indentText: "",
        insertNewLines: false,
      },
    ),
    `<style>body { background-image: url("background.png"); }</style>`,
  );
});

Deno.test("empty elements should not have closing tag", () => {
  assertEquals(
    html(tag("br")),
    "<br>\n",
  );
});

Deno.test("nesting should work properly", () => {
  assertEquals(
    html(
      [
        tag("div", {}, [
          tag("span", {}, "hello"),
        ]),
      ],
    ),
    `\
<div>
  <span>
    hello
  </span>
</div>
`,
  );
});

Deno.test("undefined children should be ignored", () => {
  assertEquals(
    html(undefined),
    "",
  );
  assertEquals(
    html(tag("div", undefined)),
    "<div></div>\n",
  );
});

Deno.test("tag interprets second argument as children", () => {
  const actual = tag("div", "hello");
  const expected = tag("div", {}, "hello");
  assertEquals(actual, expected);
});
