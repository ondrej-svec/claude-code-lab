// Tiny markdown renderer — bold, italic, inline code, links, lists, paragraphs.
// Deliberately small. If you need more, use a real library.
//
// Order of operations matters: inline transforms run after escaping HTML, in a
// specific order to avoid nesting traps (e.g. underscore-italic inside a link).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(s: string): string {
  let out = escapeHtml(s);
  // Inline code first — its content is opaque to other transforms.
  out = out.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);
  // Links: [text](url) — only http(s) and mailto allowed.
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_m, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );
  // Bold then italic (bold first because **x** must not be parsed as *(*x*)*).
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return out;
}

export function renderMarkdown(src: string): string {
  const lines = src.split(/\r?\n/);
  const blocks: string[] = [];
  let para: string[] = [];
  let list: string[] = [];

  function flushPara() {
    if (para.length) {
      blocks.push(`<p>${renderInline(para.join(" "))}</p>`);
      para = [];
    }
  }
  function flushList() {
    if (list.length) {
      const items = list.map((item) => `<li>${renderInline(item)}</li>`).join("");
      blocks.push(`<ul>${items}</ul>`);
      list = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const listMatch = /^[-*]\s+(.+)$/.exec(line);
    if (listMatch) {
      flushPara();
      list.push(listMatch[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();

  return blocks.join("");
}
