# HTML Generation Functions

Easily generate formatted HTML source code programmatically using simple and
flexible functions.

## Features

- Lightweight and easy to use.
- Generate clean, formatted HTML programmatically.
- Great for templating or dynamic HTML generation in TypeScript/JavaScript
  projects.

## Installation

To install the library, use:

```bash
deno add jsr:@sander/html
```

## Usage

Here’s a quick example to get started:

```typescript
import { html, tag } from "./html.ts";

// Generate a simple HTML structure
const page = html(
  tag("html", [
    tag("h1", "Welcome to HTML Generator"),
    tag("p", "This is an example of generated HTML."),
  ]),
  {
    doctype: "html",
  },
);

console.log(page);
// Output:
// <!doctype html>
// <html>
//   <h1>
//     Welcome to HTML Generator
//   </h1>
//   <p>
//     This is an example of generated HTML.
//   </p>
// </html>
```

For a longer example, check out [`example.ts`](./example.ts).

## Prerequisites

- Deno

## Contributing

Contributions are welcome! Please submit an issue or open a pull request for bug
fixes, new features, or documentation improvements.

## License

This project is licensed under the MIT License.
