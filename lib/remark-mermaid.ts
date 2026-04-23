/**
 * remark plugin — turn fenced ```mermaid code blocks into <Diagram /> JSX
 * with the chart source encoded as a base64 string attribute.
 *
 * next-mdx-remote 6.x silently drops JSX expression attributes (e.g.
 * `chart={"..."}`) and expression children (`{`...`}`), so we can't
 * pass multi-line source through normal prop channels. A single plain
 * attribute like `source="Zm9vCg=="` survives cleanly.
 */
type MdastNode = {
  type: string;
  lang?: string | null;
  value?: string;
  name?: string;
  attributes?: Array<{
    type: string;
    name: string;
    value: unknown;
  }>;
  children?: MdastNode[];
  data?: Record<string, unknown>;
};

export function remarkMermaid() {
  return (tree: MdastNode) => {
    walk(tree);
  };
}

function walk(node: MdastNode) {
  const children = node.children;
  if (!children) return;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === "code" && child.lang === "mermaid" && child.value) {
      children[i] = toDiagramJsx(child.value);
      continue;
    }
    walk(child);
  }
}

function toDiagramJsx(source: string): MdastNode {
  // Base64 is safe in a plain HTML attribute: no quotes, no braces, no
  // whitespace, no characters that MDX's attribute parser could mishandle.
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(source, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(source)));

  return {
    type: "mdxJsxFlowElement",
    name: "Diagram",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "b64",
        value: b64,
      },
    ],
    children: [],
  };
}
