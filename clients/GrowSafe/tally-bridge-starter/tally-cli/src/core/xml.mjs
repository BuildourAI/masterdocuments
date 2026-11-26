/**
 * A small, tolerant XML reader and writer with no dependencies.
 *
 * Tally specifics handled here:
 *  - Replies contain numeric character references that are not legal XML, such as `&#4;`
 *    (Tally prefixes system names like "Primary" or "Not Applicable" with character 4).
 *    They are decoded to the raw character and re-encoded identically on write.
 *  - Element order matters (some built-in reports are flat sequences), so the tree keeps
 *    children in document order: {name, attrs, children: (node | string)[]}.
 *  - A reply that stops before its root element closes raises E_TRUNCATED, so a partial
 *    export can never look complete.
 */
import { TallyCliError } from './errors.mjs';

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** Decode entity and character references, tolerating anything Tally emits. */
export function decodeEntities(s) {
  if (s.indexOf('&') === -1) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, ref) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return m;
      try {
        return String.fromCodePoint(code);
      } catch {
        return m;
      }
    }
    if (ref in NAMED) return NAMED[ref];
    if (ref.toLowerCase() === 'tab') return '\t';
    return m; // unknown named entity: keep literally
  });
}

/** Escape text for element content or attribute values. Control characters become &#N;. */
export function escapeXml(value) {
  const s = value === null || value === undefined ? '' : String(value);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const c = s.charCodeAt(i);
    if (ch === '&') out += '&amp;';
    else if (ch === '<') out += '&lt;';
    else if (ch === '>') out += '&gt;';
    else if (ch === '"') out += '&quot;';
    else if (c < 0x20 && c !== 0x09 && c !== 0x0a && c !== 0x0d) out += `&#${c};`;
    else out += ch;
  }
  return out;
}

/**
 * Parse an XML string into a tree.
 * @param {string} input
 * @param {{allowFragment?: boolean}} [opts] allowFragment: accept several top-level elements
 * @returns {{name: string, attrs: Record<string,string>, children: any[]}}
 */
export function parseXml(input, opts = {}) {
  const src = String(input ?? '').replace(/^﻿/, '');
  const root = { name: '#document', attrs: {}, children: [] };
  const stack = [root];
  let i = 0;
  const n = src.length;

  const top = () => stack[stack.length - 1];
  const pushText = (t) => {
    if (!t) return;
    const kids = top().children;
    const last = kids[kids.length - 1];
    if (typeof last === 'string') kids[kids.length - 1] = last + t;
    else kids.push(t);
  };

  while (i < n) {
    const lt = src.indexOf('<', i);
    if (lt === -1) {
      pushText(decodeEntities(src.slice(i)));
      break;
    }
    if (lt > i) pushText(decodeEntities(src.slice(i, lt)));
    i = lt;
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) throw truncated('comment');
      i = end + 3;
      continue;
    }
    if (src.startsWith('<![CDATA[', i)) {
      const end = src.indexOf(']]>', i + 9);
      if (end === -1) throw truncated('CDATA section');
      pushText(src.slice(i + 9, end));
      i = end + 3;
      continue;
    }
    if (src.startsWith('<?', i)) {
      const end = src.indexOf('?>', i + 2);
      if (end === -1) throw truncated('processing instruction');
      i = end + 2;
      continue;
    }
    if (src.startsWith('<!', i)) {
      // DOCTYPE or similar: skip, honouring one level of [ ... ] internal subset, no entity expansion
      let depth = 0;
      let j = i + 2;
      for (; j < n; j++) {
        const c = src[j];
        if (c === '[') depth++;
        else if (c === ']') depth--;
        else if (c === '>' && depth <= 0) break;
      }
      if (j >= n) throw truncated('declaration');
      i = j + 1;
      continue;
    }
    if (src[i + 1] === '/') {
      const end = src.indexOf('>', i + 2);
      if (end === -1) throw truncated('closing tag');
      const name = src.slice(i + 2, end).trim();
      // Close the nearest matching element (case-insensitive); tolerate stray closers.
      let k = stack.length - 1;
      while (k > 0 && stack[k].name.toUpperCase() !== name.toUpperCase()) k--;
      if (k > 0) stack.length = k;
      i = end + 1;
      continue;
    }
    // Start tag
    let j = i + 1;
    while (j < n && !/[\s/>]/.test(src[j])) j++;
    const name = src.slice(i + 1, j);
    if (!name) {
      pushText('<');
      i++;
      continue;
    }
    const attrs = {};
    let selfClose = false;
    for (;;) {
      while (j < n && /\s/.test(src[j])) j++;
      if (j >= n) throw truncated(`tag <${name}>`);
      if (src[j] === '>') {
        j++;
        break;
      }
      if (src[j] === '/' && src[j + 1] === '>') {
        selfClose = true;
        j += 2;
        break;
      }
      let k = j;
      while (k < n && !/[\s=/>]/.test(src[k])) k++;
      const aname = src.slice(j, k);
      j = k;
      while (j < n && /\s/.test(src[j])) j++;
      if (src[j] === '=') {
        j++;
        while (j < n && /\s/.test(src[j])) j++;
        const q = src[j];
        if (q === '"' || q === "'") {
          const end = src.indexOf(q, j + 1);
          if (end === -1) throw truncated(`attribute ${aname}`);
          attrs[aname] = decodeEntities(src.slice(j + 1, end));
          j = end + 1;
        } else {
          let e = j;
          while (e < n && !/[\s>]/.test(src[e])) e++;
          attrs[aname] = decodeEntities(src.slice(j, e));
          j = e;
        }
      } else if (aname) {
        attrs[aname] = '';
      } else {
        j++; // garbage character inside a tag; skip it
      }
    }
    const node = { name, attrs, children: [] };
    top().children.push(node);
    if (!selfClose) stack.push(node);
    i = j;
  }

  if (stack.length > 1) {
    throw new TallyCliError('E_TRUNCATED', `Reply from Tally ended before <${stack[1].name}> was closed (truncated or incomplete).`, {
      hint: 'Tally may have stopped mid-reply. Retry with a smaller date range (--from/--to) or a longer --timeout.',
    });
  }
  const elements = root.children.filter((c) => typeof c !== 'string');
  if (elements.length === 0) {
    const text = root.children.join('').trim();
    if (!text) throw new TallyCliError('E_TRUNCATED', 'Empty reply from Tally.', { hint: 'Check that a company is open in Tally.' });
    throw new TallyCliError('E_TALLY', `Tally replied with plain text instead of XML: ${text.slice(0, 300)}`);
  }
  if (opts.allowFragment) return root;
  if (elements.length === 1) return elements[0];
  return root;
}

function truncated(what) {
  return new TallyCliError('E_TRUNCATED', `Reply from Tally ended inside a ${what} (truncated or malformed).`, {
    hint: 'Retry; if it persists, reduce the date range or increase --timeout.',
  });
}

// ---------- navigation helpers (tag names compared case-insensitively) ----------

const same = (a, b) => a.toUpperCase() === b.toUpperCase();

export const isNode = (x) => x !== null && typeof x === 'object' && 'name' in x;

/** All text inside a node, concatenated. */
export function textOf(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  let s = '';
  for (const c of node.children) s += typeof c === 'string' ? c : textOf(c);
  return s;
}

export function child(node, name) {
  if (!node) return undefined;
  for (const c of node.children) if (isNode(c) && same(c.name, name)) return c;
  return undefined;
}

export function childrenNamed(node, name) {
  if (!node) return [];
  return node.children.filter((c) => isNode(c) && same(c.name, name));
}

export function elementChildren(node) {
  return node ? node.children.filter(isNode) : [];
}

/** Text of a direct child, trimmed; '' if missing. */
export function childText(node, name) {
  const c = child(node, name);
  return c ? textOf(c).trim() : '';
}

/** Follow a path of child names ("BODY/DATA/IMPORTRESULT"). */
export function path(node, p) {
  let cur = node;
  for (const part of p.split('/').filter(Boolean)) {
    cur = child(cur, part);
    if (!cur) return undefined;
  }
  return cur;
}

/** Depth-first search for all descendant elements with this name (document order). */
export function findAll(node, name, out = []) {
  if (!node) return out;
  for (const c of node.children) {
    if (!isNode(c)) continue;
    if (same(c.name, name)) out.push(c);
    findAll(c, name, out);
  }
  return out;
}

export function findFirst(node, name) {
  if (!node) return undefined;
  for (const c of node.children) {
    if (!isNode(c)) continue;
    if (same(c.name, name)) return c;
    const f = findFirst(c, name);
    if (f) return f;
  }
  return undefined;
}

/** Visit every element in document order. */
export function walk(node, fn) {
  if (!isNode(node)) return;
  fn(node);
  for (const c of node.children) if (isNode(c)) walk(c, fn);
}

// ---------- building and writing ----------

/** Create an element. Children may be nodes, strings, numbers, arrays (flattened) or null (skipped). */
export function el(name, attrs, ...children) {
  const kids = [];
  const add = (c) => {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) c.forEach(add);
    else if (isNode(c)) kids.push(c);
    else kids.push(String(c));
  };
  children.forEach(add);
  const a = {};
  for (const [k, v] of Object.entries(attrs || {})) if (v !== undefined && v !== null) a[k] = String(v);
  return { name, attrs: a, children: kids };
}

/** Element holding a single text value; returns null when value is undefined/null (so it is skipped). */
export function tag(name, value, attrs) {
  if (value === undefined || value === null) return null;
  return el(name, attrs, String(value));
}

/** Serialise a tree. `indent` > 0 pretty-prints (only for display; Tally accepts both). */
export function serialize(node, indent = 0, level = 0) {
  if (typeof node === 'string') return escapeXml(node);
  if (node.name === '#document') return node.children.map((c) => serialize(c, indent, level)).join(indent ? '\n' : '');
  const pad = indent ? ' '.repeat(indent * level) : '';
  const attrs = Object.entries(node.attrs || {})
    .map(([k, v]) => ` ${k}="${escapeXml(v)}"`)
    .join('');
  if (node.children.length === 0) return `${pad}<${node.name}${attrs}/>`;
  const onlyText = node.children.every((c) => typeof c === 'string');
  if (onlyText || !indent) {
    const inner = node.children.map((c) => serialize(c, onlyText ? 0 : indent, level + 1)).join('');
    return `${pad}<${node.name}${attrs}>${inner}</${node.name}>`;
  }
  const inner = node.children
    .filter((c) => !(typeof c === 'string' && !c.trim()))
    .map((c) => (typeof c === 'string' ? pad + ' '.repeat(indent) + escapeXml(c.trim()) : serialize(c, indent, level + 1)))
    .join('\n');
  return `${pad}<${node.name}${attrs}>\n${inner}\n${pad}</${node.name}>`;
}

/** Pretty-print an XML string (for display and dry runs). Falls back to the input if it does not parse. */
export function prettyXml(xml) {
  try {
    return serialize(parseXml(xml, { allowFragment: true }), 2);
  } catch {
    return xml;
  }
}

/**
 * Convert a JSON value into XML children. Used for raw pass-through tags supplied by callers:
 *   { "NARRATION": "x", "UDF:MYFIELD": "y", "SOME.LIST": [{ "A": 1 }, { "A": 2 }], "TAG": { "@ATTR": "v", "#text": "t" } }
 */
export function jsonToNodes(obj) {
  const out = [];
  for (const [key, value] of Object.entries(obj || {})) {
    if (key.startsWith('@') || key === '#text') continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) out.push(jsonToNode(key, v));
  }
  return out;
}

function jsonToNode(key, v) {
  if (v === null || v === undefined) return el(key, {});
  if (typeof v !== 'object') return el(key, {}, String(v));
  const attrs = {};
  for (const [k, val] of Object.entries(v)) if (k.startsWith('@')) attrs[k.slice(1)] = val;
  const kids = jsonToNodes(v);
  if ('#text' in v) kids.unshift(String(v['#text']));
  return el(key, attrs, kids);
}

/**
 * Convert an element into plain JSON (for showing native Tally objects to callers).
 * Repeated tags become arrays; text-only elements become strings; attributes go under "@attr".
 */
export function nodeToJson(node) {
  const kids = elementChildren(node);
  const attrs = node.attrs || {};
  const hasAttrs = Object.keys(attrs).length > 0;
  if (kids.length === 0) {
    const t = cleanText(textOf(node));
    if (!hasAttrs) return t;
    const o = {};
    for (const [k, v] of Object.entries(attrs)) o['@' + k] = v;
    if (t) o['#text'] = t;
    return o;
  }
  const o = {};
  for (const [k, v] of Object.entries(attrs)) o['@' + k] = v;
  for (const c of kids) {
    const v = nodeToJson(c);
    if (c.name in o) {
      if (!Array.isArray(o[c.name]) || !o[`__arr_${c.name}`]) {
        o[c.name] = [o[c.name]];
        Object.defineProperty(o, `__arr_${c.name}`, { value: true, enumerable: false });
      }
      o[c.name].push(v);
    } else o[c.name] = v;
  }
  return o;
}

/** Strip Tally's system-name marker (character 4) and surrounding whitespace. */
export function cleanText(s) {
  return String(s ?? '').replace(/\u0004\s?/g, '').trim();
}
