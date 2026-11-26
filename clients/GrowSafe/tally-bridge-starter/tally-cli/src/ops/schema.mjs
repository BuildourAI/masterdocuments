/**
 * Minimal input validation for operation parameters (a JSON-Schema subset), with coercion for
 * values that arrive as strings from the command line.
 *
 * Supported: type (string|number|integer|boolean|array|object|date|any), enum, default, items,
 * properties, required, minimum, maximum, description.
 */
import { TallyCliError, suggest } from '../core/errors.mjs';
import { parseDate } from '../core/dates.mjs';

function coerce(value, schema, field, fromCli) {
  const t = schema.type || 'any';
  if (value === undefined || value === null) return value;
  switch (t) {
    case 'string':
      if (typeof value === 'object') throw bad(field, 'a string');
      return String(value);
    case 'number':
    case 'integer': {
      const n = typeof value === 'number' ? value : fromCli || typeof value === 'string' ? Number(String(value).replace(/,/g, '')) : NaN;
      if (!Number.isFinite(n)) throw bad(field, `a ${t}`);
      if (t === 'integer' && !Number.isInteger(n)) throw bad(field, 'a whole number');
      if (schema.minimum !== undefined && n < schema.minimum) throw new TallyCliError('E_INPUT', `${field} must be at least ${schema.minimum}.`);
      if (schema.maximum !== undefined && n > schema.maximum) throw new TallyCliError('E_INPUT', `${field} must be at most ${schema.maximum}.`);
      return n;
    }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (/^(true|yes|1|on)$/i.test(String(value))) return true;
      if (/^(false|no|0|off)$/i.test(String(value))) return false;
      throw bad(field, 'true or false');
    case 'date':
      return parseDate(value, { field });
    case 'array': {
      let arr = value;
      if (!Array.isArray(arr)) arr = typeof arr === 'string' && fromCli ? arr.split(',').map((s) => s.trim()).filter(Boolean) : [arr];
      return schema.items ? arr.map((v, i) => coerce(v, schema.items, `${field}[${i}]`, fromCli)) : arr;
    }
    case 'object':
      if (typeof value === 'string' && fromCli) {
        try {
          return JSON.parse(value);
        } catch {
          throw bad(field, 'a JSON object (use --input file.json for large payloads)');
        }
      }
      if (typeof value !== 'object' || Array.isArray(value)) throw bad(field, 'an object');
      return value;
    default:
      return value;
  }
}

const bad = (field, what) => new TallyCliError('E_INPUT', `${field} must be ${what}.`);

/**
 * Validate and coerce input against an op's input schema.
 * @returns {object} the cleaned input (defaults applied, unknown keys rejected)
 */
export function validateInput(op, input, { fromCli = false } = {}) {
  const props = op.input?.properties || {};
  const out = {};
  const src = input || {};
  for (const k of Object.keys(src)) {
    if (src[k] === undefined) continue;
    if (!(k in props)) {
      const s = suggest(k, Object.keys(props), 3);
      throw new TallyCliError('E_INPUT', `Unknown parameter "${k}" for ${op.id}.`, {
        hint: s.length ? `Did you mean: ${s.join(', ')}?` : `Valid parameters: ${Object.keys(props).join(', ') || '(none)'}`,
      });
    }
  }
  for (const [k, schema] of Object.entries(props)) {
    let v = src[k];
    if (v === undefined && schema.default !== undefined) v = structuredClone(schema.default);
    if (v === undefined) continue;
    v = coerce(v, schema, k, fromCli);
    if (schema.enum && v !== undefined && !schema.enum.includes(v)) {
      throw new TallyCliError('E_INPUT', `${k} must be one of: ${schema.enum.join(', ')} (got ${v}).`);
    }
    out[k] = v;
  }
  for (const r of op.input?.required || []) {
    if (out[r] === undefined || out[r] === '') {
      throw new TallyCliError('E_INPUT', `Missing required parameter "${r}" for ${op.id}.`, { hint: props[r]?.description });
    }
  }
  return out;
}

/** Convert an op's input schema to standard JSON Schema (for MCP tools and the catalogue). */
export function toJsonSchema(op) {
  const conv = (s) => {
    const o = {};
    if (s.description) o.description = s.description;
    if (s.type === 'date') {
      o.type = 'string';
      o.format = 'date';
    } else if (s.type && s.type !== 'any') o.type = s.type;
    if (s.enum) o.enum = s.enum;
    if (s.default !== undefined) o.default = s.default;
    if (s.items) o.items = conv(s.items);
    if (s.properties) {
      o.properties = Object.fromEntries(Object.entries(s.properties).map(([k, v]) => [k, conv(v)]));
    }
    if (s.minimum !== undefined) o.minimum = s.minimum;
    return o;
  };
  const props = op.input?.properties || {};
  return {
    type: 'object',
    properties: Object.fromEntries(Object.entries(props).map(([k, v]) => [k, conv(v)])),
    required: op.input?.required || [],
    additionalProperties: false,
  };
}
