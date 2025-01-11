import { html, type HtmlNode, tag } from "jsr:@sander/html";
import { assertEquals } from "jsr:@std/assert/equals";

const title = "Cool Projects";

interface Project {
  title: string;
  url: string;
}

const projects: Project[] = [{
  title: "Deno",
  url: "https://deno.com/",
}, {
  title: "TypeScript",
  url: "https://www.typescriptlang.org/",
}];

const cssRules = [
  "* { --ts-blue: #3178c6; }",
  "body { font-family: sans-serif; line-height: 1.6; }",
  "li > a { color: var(--ts-blue); text-decoration: none; }",
];

function list(items: HtmlNode[]) {
  return tag("ul", {}, items.map((item) => tag("li", {}, item)));
}

function link({ title, url }: Project) {
  return tag("a", { href: url }, title);
}

const result = html(
  tag("html", { lang: "en" }, [
    tag("head", {}, [
      tag("meta", { charset: "utf-8" }),
      tag("title", {}, title),
      tag("style", {}, cssRules),
    ]),
    tag("body", {}, [
      tag("h1", {}, title),
      list(projects.map(link)),
    ]),
  ]),
  {
    doctype: "html",
  },
);

assertEquals(
  result,
  `\
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>
      Cool Projects
    </title>
    <style>
      * { --ts-blue: #3178c6; }
      body { font-family: sans-serif; line-height: 1.6; }
      li > a { color: var(--ts-blue); text-decoration: none; }
    </style>
  </head>
  <body>
    <h1>
      Cool Projects
    </h1>
    <ul>
      <li>
        <a href="https://deno.com/">
          Deno
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org/">
          TypeScript
        </a>
      </li>
    </ul>
  </body>
</html>
`,
);
