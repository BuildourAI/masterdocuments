/**
 * Typed errors and exit codes. Every failure that reaches a caller has a stable `code`,
 * a human `message`, and usually a `hint` saying what to do next.
 */

export const EXIT = Object.freeze({
  OK: 0,
  INTERNAL: 1,
  USAGE: 2,
  CONNECT: 3,
  TALLY: 4,
  VALIDATION: 5,
  POLICY: 6,
  NOT_FOUND: 7,
  INDETERMINATE: 8,
  CONFLICT: 9,
});

/** code -> exit status */
const CODE_EXIT = {
  E_USAGE: EXIT.USAGE,
  E_INPUT: EXIT.VALIDATION,
  E_VALIDATION: EXIT.VALIDATION,
  E_CONFIG: EXIT.USAGE,
  E_CONNECT: EXIT.CONNECT,
  E_TIMEOUT: EXIT.CONNECT,
  E_TRUNCATED: EXIT.TALLY,
  E_TALLY: EXIT.TALLY,
  E_NOT_FOUND: EXIT.NOT_FOUND,
  E_POLICY: EXIT.POLICY,
  E_INDETERMINATE: EXIT.INDETERMINATE,
  E_CONFLICT: EXIT.CONFLICT,
  E_UNSUPPORTED: EXIT.USAGE,
  E_LOCKED: EXIT.CONNECT,
  E_INTERNAL: EXIT.INTERNAL,
};

export class TallyCliError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {{hint?: string, details?: any, cause?: any}} [extra]
   */
  constructor(code, message, extra = {}) {
    super(message);
    this.name = 'TallyCliError';
    this.code = code;
    this.hint = extra.hint;
    this.details = extra.details;
    if (extra.cause) this.cause = extra.cause;
  }

  get exitCode() {
    return CODE_EXIT[this.code] ?? EXIT.INTERNAL;
  }

  toJSON() {
    const out = { code: this.code, message: this.message };
    if (this.hint) out.hint = this.hint;
    if (this.details !== undefined) out.details = this.details;
    return out;
  }
}

export const fail = (code, message, extra) => {
  throw new TallyCliError(code, message, extra);
};

/** Normalise anything thrown into a TallyCliError. */
export function asCliError(err) {
  if (err instanceof TallyCliError) return err;
  const e = new TallyCliError('E_INTERNAL', err?.message || String(err), {
    hint: 'This is a bug in the tool. Re-run with --verbose and keep the output.',
  });
  e.stack = err?.stack;
  return e;
}

/** Levenshtein distance, used for "did you mean" suggestions. */
export function distance(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 0;
  const prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Rank candidate names by similarity to `wanted` (substring matches first). */
export function suggest(wanted, candidates, limit = 5) {
  const w = String(wanted).toLowerCase().trim();
  if (!w) return [];
  const scored = [];
  for (const c of candidates) {
    const lc = String(c).toLowerCase();
    let score;
    if (lc === w) score = 0;
    else if (lc.startsWith(w)) score = 1;
    else if (lc.includes(w)) score = 2;
    else if (w.includes(lc) && lc.length > 2) score = 3;
    else if (lc.split(/[^a-z0-9]+/).some((word) => word.length > 2 && (word.startsWith(w) || (w.length > 3 && distance(w, word.slice(0, w.length)) <= 1)))) score = 3;
    else {
      const d = distance(w, lc);
      if (d > Math.max(2, Math.floor(w.length / 3))) continue;
      score = 3 + d;
    }
    scored.push([score, c]);
  }
  scored.sort((x, y) => x[0] - y[0] || String(x[1]).length - String(y[1]).length);
  return scored.slice(0, limit).map((s) => s[1]);
}
