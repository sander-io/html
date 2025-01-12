/**
 * This module provides a simple way to generate html source code.
 */
/** Html represent a tree of html tags */
export type HtmlNode =
  | HtmlTag
  | HtmlNode[]
  | string
  | null
  | undefined
  | ToHtml
  | RawHtml;
type Attrs = {
  [attr: string]: AttrValue;
};
type AttrValue = string | number | boolean | null | undefined;
type HtmlTag = {
  tag: string;
  attrs?: Attrs;
  children: HtmlNode;
};
/**
 * Escape text into html source
 * @param text - the text to escape
 * @returns the escaped text
 */
export declare function escapeHtml(text: string): string;
/**
 * Create an html tag
 * @param tag - the tag name
 * @param children - the children
 * @returns the html tag
 */
export declare function tag(tag: string, children?: HtmlNode): HtmlTag;
/**
 * Create an html tag
 * @param tag - the tag name
 * @param attrs - the attributes
 * @param children - the children
 * @returns the html tag
 */
export declare function tag(
  tag: string,
  attrs?: Attrs,
  ...children: HtmlNode[]
): HtmlTag;
declare class RawHtml {
  html: string;
  constructor(html: string);
}
/**
 * Create a raw html node
 * @param html raw html to insert
 * @returns
 */
export declare function raw(html: string): HtmlNode;
export declare function comment(text: string): HtmlNode;
/** Options for the `html` function */
interface HtmlOptions {
  /** indentation level (defaults to 0) */
  indentLevel?: number;
  /** raw text indicator (defaults to false) */
  rawText?: boolean;
  /** text used for indent (defaults to "  ") */
  indentText?: string;
  /** insert new line at the end of each html item (defaults to true) */
  insertNewLines?: boolean;
  /** doctype declaration */
  doctype?: string;
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
export declare function html(content: HtmlNode, options?: HtmlOptions): string;
/**
 * Interface for objects that can be converted to html
 */
export interface ToHtml {
  toHtml(): HtmlNode;
}
export {};
//# sourceMappingURL=html.d.ts.map
