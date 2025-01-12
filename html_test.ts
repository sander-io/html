import { comment, html, raw, tag, type ToHtml } from "./html.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";

const noWhitespace = { indentText: "", insertNewLines: false };

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
      tag("style", `body { background-image: url("background.png"); }`),
      noWhitespace,
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
          tag("span", "hello"),
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
  assertEquals(
    html(tag("div", tag("br")), noWhitespace),
    "<div><br></div>",
  );
});

Deno.test("tag works with array of children", () => {
  assertEquals(
    html(tag("h1", "Header"), noWhitespace),
    "<h1>Header</h1>",
  );
  assertEquals(
    html(tag("div", [tag("br"), tag("br")]), noWhitespace),
    "<div><br><br></div>",
  );
  assertEquals(
    html(tag("div", { id: "a" }, tag("br"), tag("br")), noWhitespace),
    `<div id="a"><br><br></div>`,
  );
});

Deno.test("convert objects to html in content", () => {
  class Banner implements ToHtml {
    constructor(public title: string) {}
    toHtml() {
      return tag("div", { class: "banner" }, this.title);
    }
  }
  const banner = new Banner("Banner");
  assertEquals(
    html(banner, noWhitespace),
    `<div class="banner">Banner</div>`,
  );
});

Deno.test("arbitrary objects should throw an exception", () => {
  const obj = { foo: "bar" };
  assertThrows(
    () => {
      html(obj as any);
    },
    Error,
    "Cannot convert object to HTML",
  );
});

Deno.test("invalid tag name should throw an exception", () => {
  assertThrows(
    () => {
      html(tag("invalid tag name"));
    },
    Error,
    "Invalid tag name",
  );
});

Deno.test("invalid attribute name should throw an exception", () => {
  assertThrows(
    () => {
      html(tag("div", { "invalid attr name": "value" }));
    },
    Error,
    "Invalid attribute name",
  );
});

Deno.test("html works with raw html", () => {
  assertEquals(
    html(tag("div", raw("<b>bold</b>")), noWhitespace),
    "<div><b>bold</b></div>",
  );
});

Deno.test("works with comments", () => {
  assertEquals(
    html(comment("comment"), noWhitespace),
    `<!-- comment -->`,
  );
});

Deno.test("invalid comment should throw an exception", () => {
  assertThrows(
    () => {
      comment("comment -->");
    },
    Error,
    "Invalid comment",
  );
});

Deno.test("doctype should work", () => {
  assertEquals(
    html([], { doctype: "html" }),
    "<!doctype html>\n",
  );
});

Deno.test("attr values are parsed correctly", () => {
  // improve test coverage for parsing attribute values
  tag("custom", {
    string: "string",
    number: 1,
    boolean: true,
    null: null,
    undefined: undefined,
  });
  assertThrows(
    () => {
      tag("custom", { invalid: new Date() } as any);
    },
    Error,
    "Invalid attribute value",
  );
});
