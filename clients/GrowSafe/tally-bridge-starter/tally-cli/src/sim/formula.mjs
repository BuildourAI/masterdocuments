/**
 * Evaluator for the subset of TDL formulas this tool emits, used only by the simulator.
 * Anything outside the subset raises an explicit "unsupported in simulator" error rather than
 * guessing, so the simulator never silently disagrees with real Tally.
 *
 * Supported: literals, $Method, $Method[Last].Sub, $Method:Type:NameExpr (lookup), ..Method (parent),
 * ##Variable, @@Formula, $$Function:arg:..., if/then/else, NOT/AND/OR, comparisons, + - * /, unary minus.
 */

export class FormulaError extends Error {}

const FUNCS = {
  // name: [arity, identArgs (indexes that are bare identifiers)]
  isequal: [2],
  isempty: [1],
  isdebit: [1],
  numvalue: [1],
  stringfindandreplace: [3],
  pyrlyyyymmddformat: [2],
  number: [1],
  string: [1],
  isinwards: [1],
  sysname: [1, [0]],
  fulllist: [2, [0]],
  isaccountingvch: [1],
  isinventoryvch: [1],
  isordervch: [1],
  isledofgrp: [2],
  aspositive: [1],
  isnotapplicable: [1],
  licenseinfo: [1, [0]],
  sysinfo: [1, [0]],
  isprodtallyprime: [0],
  isprodtallyprimeel: [0],
  isprodtallyserver: [0],
  systemperiodfrom: [0],
  systemperiodto: [0],
  numstockitems: [0],
  cmpusername: [0],
  cmpuserlevel: [0],
  groupstock: [0],
  round: [2],
};

function tokenize(src) {
  const toks = [];
  let i = 0;
  const s = String(src);
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === '"') {
      const end = s.indexOf('"', i + 1);
      if (end === -1) throw new FormulaError(`Unterminated string in formula: ${s}`);
      toks.push({ t: 'str', v: s.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    const two = s.slice(i, i + 2);
    if (two === '$$' || two === '##' || two === '@@' || two === '..') {
      let j = i + 2;
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
      const name = s.slice(i + 2, j);
      toks.push({ t: { $$: 'func', '##': 'var', '@@': 'ref', '..': 'pmethod' }[two], v: name });
      i = j;
      continue;
    }
    if (c === '$') {
      let j = i + 1;
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
      let name = s.slice(i + 1, j);
      let index = null;
      let sub = null;
      if (s[j] === '[') {
        const end = s.indexOf(']', j);
        index = s.slice(j + 1, end).trim();
        j = end + 1;
        if (s[j] === '.') {
          let k = j + 1;
          while (k < s.length && /[A-Za-z0-9_]/.test(s[k])) k++;
          sub = s.slice(j + 1, k);
          j = k;
        }
      }
      toks.push({ t: 'method', v: name, index, sub });
      i = j;
      continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1]))) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      toks.push({ t: 'num', v: parseFloat(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const up = word.toUpperCase();
      if (['IF', 'THEN', 'ELSE', 'NOT', 'AND', 'OR'].includes(up)) toks.push({ t: 'kw', v: up });
      else toks.push({ t: 'ident', v: word });
      i = j;
      continue;
    }
    const ops = ['<=', '>=', '!=', '<>'];
    if (ops.includes(two)) {
      toks.push({ t: 'op', v: two === '<>' ? '!=' : two });
      i += 2;
      continue;
    }
    if ('()=<>+-*/:,'.includes(c)) {
      toks.push({ t: 'op', v: c });
      i++;
      continue;
    }
    throw new FormulaError(`Unexpected character "${c}" in formula: ${s}`);
  }
  return toks;
}

/** Parse a formula into an AST. */
export function parseFormula(src) {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;
  const isKw = (v) => peek() && peek().t === 'kw' && peek().v === v;
  const expect = (t, v) => {
    const tok = toks[p];
    if (!tok || tok.t !== t || (v !== undefined && tok.v !== v)) throw new FormulaError(`Expected ${v || t} in formula: ${src}`);
    p++;
    return tok;
  };

  function expr() {
    if (isKw('IF')) {
      p++;
      const c = expr();
      expect('kw', 'THEN');
      const a = expr();
      expect('kw', 'ELSE');
      const b = expr();
      return { k: 'if', c, a, b };
    }
    return or();
  }
  function or() {
    let l = and();
    while (isKw('OR')) {
      p++;
      l = { k: 'or', l, r: and() };
    }
    return l;
  }
  function and() {
    let l = not();
    while (isKw('AND')) {
      p++;
      l = { k: 'and', l, r: not() };
    }
    return l;
  }
  function not() {
    if (isKw('NOT')) {
      p++;
      return { k: 'not', e: not() };
    }
    return cmp();
  }
  function cmp() {
    const l = add();
    const t = peek();
    if (t && t.t === 'op' && ['=', '<', '>', '<=', '>=', '!='].includes(t.v)) {
      p++;
      return { k: 'cmp', op: t.v, l, r: add() };
    }
    return l;
  }
  function add() {
    let l = mul();
    while (isOp('+') || isOp('-')) {
      const op = toks[p++].v;
      l = { k: 'bin', op, l, r: mul() };
    }
    return l;
  }
  function mul() {
    let l = unary();
    while (isOp('*') || isOp('/')) {
      const op = toks[p++].v;
      l = { k: 'bin', op, l, r: unary() };
    }
    return l;
  }
  function unary() {
    if (isOp('-')) {
      p++;
      return { k: 'neg', e: unary() };
    }
    if (isKw('IF')) return expr();
    return primary(false);
  }
  function primary(inArg) {
    const t = peek();
    if (!t) throw new FormulaError(`Unexpected end of formula: ${src}`);
    if (t.t === 'op' && t.v === '(') {
      p++;
      const e = expr();
      expect('op', ')');
      return e;
    }
    if (t.t === 'op' && t.v === '-' && inArg) {
      p++;
      return { k: 'neg', e: primary(true) };
    }
    if (t.t === 'kw' && t.v === 'NOT' && inArg) {
      p++;
      return { k: 'not', e: primary(true) };
    }
    p++;
    switch (t.t) {
      case 'str':
        return { k: 'lit', v: t.v };
      case 'num':
        return { k: 'lit', v: t.v };
      case 'ident':
        return { k: 'lit', v: t.v };
      case 'var':
        return { k: 'var', v: t.v };
      case 'ref':
        return { k: 'ref', v: t.v };
      case 'pmethod':
        return { k: 'pmethod', v: t.v };
      case 'method': {
        // $Method:Type:Name lookup (only outside function arguments)
        if (!inArg && !t.index && isOp(':') && toks[p + 1] && toks[p + 1].t === 'ident' && toks[p + 2] && toks[p + 2].t === 'op' && toks[p + 2].v === ':') {
          const typeName = toks[p + 1].v;
          p += 3;
          return { k: 'lookup', method: t.v, typeName, name: primary(true) };
        }
        return { k: 'method', v: t.v, index: t.index, sub: t.sub };
      }
      case 'func': {
        const name = t.v.toLowerCase();
        const def = FUNCS[name];
        if (!def) throw new FormulaError(`Function $$${t.v} is not supported in the simulator.`);
        const [arity, identArgs = []] = def;
        const args = [];
        for (let a = 0; a < arity; a++) {
          expect('op', ':');
          if (identArgs.includes(a)) {
            const tok = toks[p++];
            if (!tok) throw new FormulaError(`Missing argument for $$${t.v}`);
            args.push(tok.t === 'func' ? { k: 'call', name: tok.v.toLowerCase(), args: [] } : tok.t === 'method' ? { k: 'method', v: tok.v } : { k: 'lit', v: tok.v });
          } else args.push(primary(true));
        }
        return { k: 'call', name, args };
      }
      default:
        throw new FormulaError(`Unexpected token in formula: ${src}`);
    }
  }
  const ast = expr();
  if (p < toks.length) throw new FormulaError(`Unexpected trailing tokens in formula: ${src}`);
  return ast;
}

const cache = new Map();
export function compile(src) {
  let ast = cache.get(src);
  if (!ast) {
    ast = parseFormula(src);
    cache.set(src, ast);
  }
  return ast;
}

// ---------- evaluation ----------

export const isEmptyValue = (v) => v === null || v === undefined || v === '' || v === 0 || (Array.isArray(v) && v.length === 0);

export function truthy(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s !== '' && s !== 'no' && s !== '0' && s !== 'false';
  }
  return !!v;
}

const num = (v) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = parseFloat(String(v ?? '').replace(/[,₹]/g, '').replace(/^\(-\)/, '-'));
  return Number.isFinite(n) ? n : 0;
};

function cmpValues(op, a, b) {
  let x = a;
  let y = b;
  const numeric = (typeof a === 'number' || typeof b === 'number') && !Number.isNaN(num(a)) && !Number.isNaN(num(b));
  if (numeric) {
    x = num(a);
    y = num(b);
  } else {
    x = String(a ?? '').toLowerCase();
    y = String(b ?? '').toLowerCase();
  }
  switch (op) {
    case '=':
      return x === y;
    case '!=':
      return x !== y;
    case '<':
      return x < y;
    case '>':
      return x > y;
    case '<=':
      return x <= y;
    case '>=':
      return x >= y;
    default:
      return false;
  }
}

/**
 * Evaluate an AST.
 * @param {any} ast
 * @param {{obj: any, env: {resolve: Function, lookup: Function, variable: Function, formula: Function, func: Function}}} ctx
 */
export function evaluate(ast, ctx) {
  const ev = (n) => evaluate(n, ctx);
  switch (ast.k) {
    case 'lit':
      return ast.v;
    case 'var':
      return ctx.env.variable(ast.v);
    case 'ref':
      return ctx.env.formula(ast.v, ctx);
    case 'method': {
      let v = ctx.env.resolve(ctx.obj, ast.v);
      if (ast.index) {
        const arr = Array.isArray(v) ? v : [];
        const idx = ast.index.toLowerCase() === 'last' ? arr.length - 1 : ast.index.toLowerCase() === 'first' ? 0 : parseInt(ast.index, 10) - 1;
        if (!/^(last|first|\d+)$/i.test(ast.index)) throw new FormulaError(`Index [${ast.index}] is not supported in the simulator.`);
        const item = arr[idx];
        v = item === undefined ? '' : ast.sub ? ctx.env.resolve(item, ast.sub) : item;
      }
      return v;
    }
    case 'pmethod': {
      const parent = ctx.obj && ctx.obj._parent;
      return parent ? ctx.env.resolve(parent, ast.v) : '';
    }
    case 'lookup':
      return ctx.env.lookup(ast.typeName, ev(ast.name), ast.method);
    case 'if':
      return truthy(ev(ast.c)) ? ev(ast.a) : ev(ast.b);
    case 'not':
      return !truthy(ev(ast.e));
    case 'and':
      return truthy(ev(ast.l)) && truthy(ev(ast.r));
    case 'or':
      return truthy(ev(ast.l)) || truthy(ev(ast.r));
    case 'cmp':
      return cmpValues(ast.op, ev(ast.l), ev(ast.r));
    case 'neg':
      return -num(ev(ast.e));
    case 'bin': {
      const a = num(ev(ast.l));
      const b = num(ev(ast.r));
      return ast.op === '+' ? a + b : ast.op === '-' ? a - b : ast.op === '*' ? a * b : b === 0 ? 0 : a / b;
    }
    case 'call':
      return callFunc(ast.name, ast.args, ctx);
    default:
      throw new FormulaError(`Cannot evaluate node ${ast.k}`);
  }
}

function callFunc(name, args, ctx) {
  const ev = (i) => evaluate(args[i], ctx);
  switch (name) {
    case 'isequal':
      return cmpValues('=', ev(0), ev(1));
    case 'isempty':
      return isEmptyValue(ev(0));
    case 'isdebit':
      return num(ev(0)) < 0;
    case 'numvalue':
      return Math.abs(num(ev(0)));
    case 'aspositive':
      return Math.abs(num(ev(0)));
    case 'number':
      return num(ev(0));
    case 'string': {
      const v = ev(0);
      return typeof v === 'number' ? String(Math.round(v * 10000) / 10000) : String(v ?? '');
    }
    case 'stringfindandreplace': {
      const v = ev(0);
      const s = typeof v === 'number' ? String(Math.round(v * 10000) / 10000) : String(v ?? '');
      return s.split(String(ev(1))).join(String(ev(2)));
    }
    case 'pyrlyyyymmddformat': {
      const v = String(ev(0) ?? '');
      const sep = String(ev(1) ?? '');
      const m = /^(\d{4})-?(\d{2})-?(\d{2})/.exec(v);
      return m ? [m[1], m[2], m[3]].join(sep) : '';
    }
    case 'isinwards':
      return num(ev(0)) > 0;
    case 'isnotapplicable': {
      const v = String(ev(0) ?? '').toLowerCase();
      return v === '' || v.includes('not applicable');
    }
    case 'round': {
      const n = num(ev(0));
      const step = num(ev(1)) || 1;
      return Math.round(n / step) * step;
    }
    default:
      return ctx.env.func(name, args.map((a, i) => (a.k === 'lit' && typeof a.v === 'string' ? a.v : ev(i))), ctx);
  }
}

export function evalFormula(src, ctx) {
  return evaluate(compile(src), ctx);
}
