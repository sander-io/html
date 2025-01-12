/**
 * This script embeds the example code from `example.ts` into the `html.ts` file.
 */

const rawExample = Deno.readFileSync(
  new URL("example.ts", import.meta.url),
);
const sourceExample = new TextDecoder().decode(rawExample).trim();
const exampleReplacement = sourceExample
  .replaceAll(/^/gm, " * ")
  .replaceAll(/^ \* $/gm, " *") + "\n";

const startMarker = `\
 * filename: \`example.ts\`
 * \`\`\`ts
`;
const endMarker = " * ```\n";

const rawSource = Deno.readFileSync(new URL("html.ts", import.meta.url));
const source = new TextDecoder().decode(rawSource);
const startPos = source.indexOf(startMarker);
if (startPos === -1) {
  throw new Error("Start marker not found");
}
const endPos = source.indexOf(endMarker, startPos);
if (endPos === -1) {
  throw new Error("End marker not found");
}

const newSource = source.slice(0, startPos) +
  startMarker +
  exampleReplacement +
  source.slice(endPos);

Deno.writeTextFileSync(new URL("html.ts", import.meta.url), newSource);
