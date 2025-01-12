# HTML Generation Functions

Easily generate formatted HTML source code programmatically using simple and
flexible functions.

## Features

- Lightweight and easy to use.
- Generate clean, formatted HTML programmatically.
- Great for templating or dynamic HTML generation in TypeScript/JavaScript
  projects.

## API

- `html`: Generate an HTML source document from the `HtmlNode`, with options
  for: `doctype`, `indentText`, and `insertNewLines`.
- `tag`: Generate an HTML tag, can have attributes and an arbitrary number of
  children nodes as arguments.
- `raw`: Insert raw unescaped HTML.
- `comment`: Generate an HTML comment.
- `toHtml`: Convert an object value to an `HtmlNode`.

## Installation

To install the library, use:

```bash
deno add jsr:@sander/html

npx jsr add @sander/html

bunx jsr add @sander/html
```

## Usage

Here’s a quick example to get started:

```typescript
import { assertEquals } from "@std/assert";
import { html, tag } from "./html.ts";

const page = html(
  tag("html", [
    tag("h1", "Welcome to HTML Generator"),
    tag("div", { class: "banner" }, "This is an example of generated HTML."),
  ]),
  {
    doctype: "html",
  },
);

assertEquals(
  page,
  `\
<!doctype html>
<html>
  <h1>
    Welcome to HTML Generator
  </h1>
  <div class="banner">
    This is an example of generated HTML.
  </div>
</html>
`,
);
```

For a longer example, check out [`example.ts`](./example.ts).

The `ToHtml` interface with an `toHtml` method can be used implement custom
types that can be converted to HTML.

```ts
import { type HtmlNode, tag, type ToHtml } from "@sander/html";

class Custom implements ToHtml {
  constructor(public value: string) {}

  toHtml(): HtmlNode {
    return tag("div", { class: "custom" }, this.value);
  }
}
```

## Prerequisites

- Deno, Node, Bun, or another JavaScript runtime.

## Contributing

Contributions are welcome! Please submit an issue or open a pull request for bug
fixes, new features, or documentation improvements.

## License

This project is licensed under the MIT License.
