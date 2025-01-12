/**
 * This module provides a simple way to generate html source code.
 */
const voidElements =
  "area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr"
    .split(", ");
const rawTextElements = "script, style, title, textarea".split(", ");
function isHtmlNode(value) {
  return (value instanceof Tag ||
    value instanceof RawHtml ||
    Array.isArray(value) ||
    typeof value === "string" ||
    value === null ||
    value === undefined);
}
/**
 * Escape text into html source
 * @param text - the text to escape
 * @returns the escaped text
 */
export function escapeHtml(text) {
  return text.replaceAll(/[<>&"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      default:
        throw new Error("unreachable");
    }
  });
}
function attr([key, value]) {
  if (value === false || value === null || value === undefined) {
    return [];
  }
  if (value === true) {
    return [" ", key];
  }
  return [" ", key, '="', escapeHtml(`${value}`), '"'];
}
function emptyChildren(children) {
  return children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0);
}
class Tag {
  constructor(tag, attrs = {}, children = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }
}
/*
 * XML tag names are case-sensitive, while HTML tag names are case-insensitive.
 * In XML, colons (:) are allowed for namespaces, but they are rarely used in HTML.
 */
function validTagName(name) {
  return /^[a-zA-Z_:][a-zA-Z0-9:_.-]*$/i.test(name);
}
function validAttrName(name) {
  return /^[a-zA-Z_:][a-zA-Z0-9:_.-]*$/i.test(name);
}
// Only allow primitive values for attributes
// Ignore the structural type `toString` and `valueOf` interfaces
function parseAttrValue(value) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  ) {
    return value;
  }
  throw new Error(`Invalid attribute value: ${value}`);
}
function parseAttrs(attrs) {
  if (isHtmlNode(attrs)) {
    throw new Error("unreachable");
  }
  const parsed = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (!validAttrName(key)) {
      throw new Error(`Invalid attribute name: ${key}`);
    }
    parsed[key] = parseAttrValue(value);
  }
  return parsed;
}
export function tag(tag, attrs, ...children) {
  if (!validTagName(tag)) {
    throw new Error(`Invalid tag name: ${tag}`);
  }
  if (children.length > 0) {
    return new Tag(tag, parseAttrs(attrs), children);
  }
  if (isHtmlNode(attrs)) {
    const children = attrs;
    return new Tag(tag, {}, children);
  }
  return new Tag(tag, parseAttrs(attrs), []);
}
class RawHtml {
  constructor(html) {
    this.html = html;
  }
}
/**
 * Create a raw html node
 * @param html raw html to insert
 * @returns
 */
export function raw(html) {
  return new RawHtml(html);
}
// https://html.spec.whatwg.org/multipage/syntax.html#comments
function isValidComment(text) {
  return !text.startsWith(">") &&
    !text.startsWith("->") &&
    !text.includes("<!--") &&
    !text.includes("-->") &&
    !text.includes("--!>");
}
export function comment(text) {
  if (!isValidComment(text)) {
    throw new Error(`Invalid comment text: ${text}`);
  }
  return raw(`<!-- ${text} -->`);
}
/**
 * InnerHtml builds an array of strings that can be joined more efficiently
 * than direct string concatenation.
 */
function innerHtml(content, options) {
  const indentLevel = options?.indentLevel ?? 0;
  const rawText = options?.rawText ?? false;
  const indentText = options?.indentText ?? "  ";
  const insertNewLines = options?.insertNewLines ?? true;
  const nl = insertNewLines ? "\n" : "";
  const indent = indentText.repeat(indentLevel);
  if (content === undefined || content === null) {
    return [];
  }
  if (typeof content === "string") {
    if (rawText || rawTextElements.includes(content)) {
      return [indent, content, nl];
    }
    return [indent, escapeHtml(content), nl];
  }
  if (Array.isArray(content)) {
    return content.map((content) => innerHtml(content, options)).flat();
  }
  if (content instanceof RawHtml) {
    return [indent, content.html, nl];
  }
  if (content instanceof Tag) {
    const { tag, attrs, children } = content;
    const quotedAttrs = Object.entries(attrs)
      .flatMap(([key, value]) => attr([key, value]));
    const prefix = [indent, "<", tag, ...quotedAttrs];
    const endTag = ["</", tag, ">"];
    if (emptyChildren(children)) {
      if (voidElements.includes(tag)) {
        return [...prefix, ">", nl];
      }
      return [...prefix, ">", ...endTag, nl];
    }
    const childrenStr = innerHtml(children, {
      indentLevel: indentLevel + 1,
      rawText: rawTextElements.includes(tag),
      indentText,
      insertNewLines,
    });
    return [...prefix, ">", nl, ...childrenStr, indent, ...endTag, nl];
  }
  if (isToHtml(content)) {
    return innerHtml(content.toHtml(), options);
  }
  throw new Error("Cannot convert object to HTML");
}
/**
 * Convert a html tree into an html source
 *
 * Features:
 * - void elements are not closed
 * - boolean attributes are ommited if false
 * - raw text elements are not escaped
 * - empty nodes are ignored
 *
 * # Example
 *
 * filename: `example.ts`
 * ```ts
 * import { html, type HtmlNode, tag } from "@sander/html";
 * import { assertEquals } from "@std/assert";
 *
 * const title = "Cool Projects";
 *
 * interface Project {
 *   title: string;
 *   url: string;
 * }
 *
 * const projects: Project[] = [{
 *   title: "Deno",
 *   url: "https://deno.com/",
 * }, {
 *   title: "TypeScript",
 *   url: "https://www.typescriptlang.org/",
 * }];
 *
 * const cssRules = [
 *   "* { --ts-blue: #3178c6; }",
 *   "body { font-family: sans-serif; line-height: 1.6; }",
 *   "li > a { color: var(--ts-blue); text-decoration: none; }",
 * ];
 *
 * function list(items: HtmlNode[]) {
 *   return tag("ul", items.map((item) => tag("li", item)));
 * }
 *
 * function link({ title, url }: Project) {
 *   return tag("a", { href: url }, title);
 * }
 *
 * const result = html(
 *   tag("html", { lang: "en" }, [
 *     tag("head", [
 *       tag("meta", { charset: "utf-8" }),
 *       tag("title", title),
 *       tag("style", cssRules),
 *     ]),
 *     tag("body", [
 *       tag("h1", title),
 *       list(projects.map(link)),
 *     ]),
 *   ]),
 *   {
 *     doctype: "html",
 *   },
 * );
 *
 * assertEquals(
 *   result,
 *   `\
 * <!doctype html>
 * <html lang="en">
 *   <head>
 *     <meta charset="utf-8">
 *     <title>
 *       Cool Projects
 *     </title>
 *     <style>
 *       * { --ts-blue: #3178c6; }
 *       body { font-family: sans-serif; line-height: 1.6; }
 *       li > a { color: var(--ts-blue); text-decoration: none; }
 *     </style>
 *   </head>
 *   <body>
 *     <h1>
 *       Cool Projects
 *     </h1>
 *     <ul>
 *       <li>
 *         <a href="https://deno.com/">
 *           Deno
 *         </a>
 *       </li>
 *       <li>
 *         <a href="https://www.typescriptlang.org/">
 *           TypeScript
 *         </a>
 *       </li>
 *     </ul>
 *   </body>
 * </html>
 * `,
 * );
 * ```
 *
 * @param content - the html tree
 * @param options - the options for the html source
 * @returns the html source
 */
export function html(content, options) {
  const firstLine = options?.doctype ? `<!doctype ${options.doctype}>\n` : "";
  return firstLine + innerHtml(content, options).join("");
}
function isToHtml(value) {
  return value !== undefined &&
    typeof value === "object" &&
    typeof value.toHtml === "function";
}
//# sourceMappingURL=html.js.map
