/**
 * Product descriptions: plain text (older ones) or the tiny formatted
 * subset the admin editor saves (<p>, <br>, <strong>, <em>,
 * <span data-size="big|small">, <ul>, <ol>, <li>). The API already cleans what is saved;
 * this is the same cleaner (a copy of the API's rich-text.util.ts), run
 * again before showing it, so nothing else can reach the page.
 */
const BLOCK = 'p';
const LISTS = new Set(['ul', 'ol']);
const ALLOWED = new Set([BLOCK, 'br', 'strong', 'em', 'span', 'ul', 'ol', 'li']);
const ALIASES: Record<string, string> = { b: 'strong', i: 'em' };
const SIZES = new Set(['big', 'small']);
/** Tags whose text is not content. */
const SKIPPED = new Set(['script', 'style', 'iframe', 'object', 'template']);

const LOOKS_FORMATTED = /<\/?(p|br|strong|em|b|i|span|ul|ol|li)\b[^>]*>/i;
const TAG = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
const ENTITY = /^&(?:amp|lt|gt|quot|nbsp|#39|#\d{1,6}|#x[0-9a-fA-F]{1,6});/;

/** True when the text uses the formatting tags (so it is shown as formatted text). */
export function isRichText(text: string): boolean {
  return LOOKS_FORMATTED.test(text);
}

function escapeText(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '<') out += '&lt;';
    else if (ch === '>') out += '&gt;';
    else if (ch === '&') out += ENTITY.test(text.slice(i)) ? '&' : '&amp;';
    else out += ch;
  }
  return out;
}

/**
 * Keeps the allowed tags (without attributes, except the size) and the
 * text; drops every other tag. Unclosed tags are closed, stray closing tags
 * ignored. Plain text is returned unchanged; text with nothing to show
 * becomes null.
 */
export function sanitizeRichText(input: string): string | null {
  const text = input.trim();
  if (text === '') return null;
  if (!isRichText(text)) return text;

  let out = '';
  /** Open tags, innermost last; `emitted` is false for tags that were dropped. */
  const open: { name: string; emitted: boolean }[] = [];
  let skipping: string | null = null;
  let last = 0;
  const close = (index: number) => {
    for (let i = open.length - 1; i >= index; i -= 1) {
      if (open[i].emitted) out += `</${open[i].name}>`;
    }
    open.length = index;
  };

  for (const match of text.matchAll(TAG)) {
    const [whole, slash, rawName, attributes] = match;
    const lower = rawName.toLowerCase();
    const name = ALIASES[lower] ?? lower;
    if (!skipping) out += escapeText(text.slice(last, match.index));
    last = match.index + whole.length;

    if (skipping) {
      if (slash && lower === skipping) skipping = null;
      continue;
    }
    if (SKIPPED.has(lower)) {
      if (!slash) skipping = lower;
      continue;
    }
    if (!ALLOWED.has(name)) continue;
    if (name === 'br') {
      out += '<br>';
      continue;
    }
    if (slash) {
      const index = open.map((tag) => tag.name).lastIndexOf(name);
      if (index >= 0) close(index);
      continue;
    }
    const names = open.map((tag) => tag.name);
    const lastList = Math.max(names.lastIndexOf('ul'), names.lastIndexOf('ol'));
    const lastParagraph = names.lastIndexOf(BLOCK);
    if (name === BLOCK || LISTS.has(name)) {
      // Paragraphs don't nest, and a list never sits inside a paragraph.
      if (lastParagraph > names.lastIndexOf('li')) close(lastParagraph);
    }
    if (name === 'li') {
      // A list item belongs straight inside a list; without one it is dropped (its words stay).
      if (lastList < 0) {
        open.push({ name, emitted: false });
        continue;
      }
      close(lastList + 1);
    }
    if (name === 'span') {
      const size = /data-size\s*=\s*["']?([a-z]+)/i.exec(attributes)?.[1];
      const known = size !== undefined && SIZES.has(size.toLowerCase());
      if (known) out += `<span data-size="${size.toLowerCase()}">`;
      open.push({ name, emitted: known });
      continue;
    }
    out += `<${name}>`;
    open.push({ name, emitted: true });
  }
  if (!skipping) out += escapeText(text.slice(last));
  close(0);

  return richTextToPlain(out) === '' ? null : out;
}

/** The words only: for search, summaries and "is there anything here?". */
export function richTextToPlain(text: string): string {
  if (!isRichText(text)) return text.trim();
  return text
    .replace(/<\/p>|<br>|<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}
