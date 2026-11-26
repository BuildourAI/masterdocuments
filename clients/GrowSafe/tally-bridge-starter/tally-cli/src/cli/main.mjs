/**
 * CLI entry: parse arguments, build the context, invoke the operation, render the result.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './args.mjs';
import { mainHelp, areaHelp, opHelp } from './help.mjs';
import { chooseFormat, render, renderError, renderWarnings } from './output.mjs';
import { createContext } from '../ops/context.mjs';
import { invoke } from '../ops/invoke.mjs';
import { readText, parseJson, writeFileSafe } from '../core/textio.mjs';
import { asCliError, EXIT } from '../core/errors.mjs';
import { TOOL_ROOT } from '../core/config.mjs';
import '../ops/index.mjs';

export function version() {
  try {
    return JSON.parse(fs.readFileSync(path.join(TOOL_ROOT, 'package.json'), 'utf8')).version;
  } catch {
    return '0.0.0';
  }
}

/**
 * Run the CLI. Returns the exit code. `io` lets tests capture output.
 * @param {string[]} argv
 * @param {{stdout?: any, stderr?: any, env?: object, cwd?: string}} io
 */
export async function runCli(argv, io = {}) {
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (err) {
    const e = asCliError(err);
    stderr.write(`Error [${e.code}]: ${e.message}\n${e.hint ? 'Hint: ' + e.hint + '\n' : ''}`);
    return e.exitCode;
  }
  const { opId, words, flags, op } = parsed;
  let { input } = parsed;

  if (flags.version) {
    stdout.write(`${version()}\n`);
    return EXIT.OK;
  }
  if (!opId) {
    if (!words.length || flags.help || words[0] === 'help') {
      const target = words[0] === 'help' ? words.slice(1) : words;
      const text = target.length ? opHelp(target.join('.')) || areaHelp(target[0]) : null;
      stdout.write(text || mainHelp(version()));
      return EXIT.OK;
    }
    const text = areaHelp(words[0]);
    if (text) {
      stdout.write(text);
      return flags.help ? EXIT.OK : EXIT.USAGE;
    }
    stderr.write(`Error [E_USAGE]: Unknown command "${words.join(' ')}".\nHint: Run "tally --help" for the list of commands.\n`);
    return EXIT.USAGE;
  }
  if (flags.help) {
    stdout.write(opHelp(opId));
    return EXIT.OK;
  }

  try {
    if (flags.input) {
      const text = await readText(flags.input);
      if (op.inputMode === 'text') input = { ...input, [op.inputKey || 'text']: text };
      else {
        const payload = /\.ndjson$/i.test(flags.input) ? parseJson(text, 'input file', { ndjson: true }) : parseJson(text, 'input file');
        if (op.inputKey) input = { ...input, [op.inputKey]: payload };
        else if (payload && typeof payload === 'object' && !Array.isArray(payload)) input = { ...payload, ...input };
        else throw asCliError(new Error('The input file must contain a JSON object for this command.'));
      }
    }
  } catch (err) {
    const e = asCliError(err);
    stderr.write(renderError({ error: e.toJSON() }));
    return e.exitCode;
  }

  let ctx;
  try {
    ctx = createContext({
      frontend: 'cli',
      configPath: flags.config,
      profile: flags.profile,
      verbose: flags.verbose,
      env: io.env,
      cwd: io.cwd,
      overrides: {
        url: flags.url,
        company: flags.company,
        timeoutMs: flags.timeout ? Number(flags.timeout) * 1000 : undefined,
        encoding: flags.encoding,
        readOnly: flags.readOnly,
        record: flags.record,
      },
    });
    ctx.io = { stdout, stderr, flags, interactive: !!(process.stdin.isTTY && stdout.isTTY) && !io.stdout };
  } catch (err) {
    const e = asCliError(err);
    stderr.write(renderError({ error: e.toJSON() }));
    return e.exitCode;
  }

  const env = await invoke(opId, input, ctx, { fromCli: true });
  if (env.ok && env.data && env.data.__stream) return env.data.exitCode ?? EXIT.OK; // long-running ops handle their own output
  const format = chooseFormat(flags, stdout);
  const rawText = env.ok && env.data && typeof env.data === 'object' ? env.data.__raw : undefined;
  if (rawText !== undefined) delete env.data.__raw;
  if (rawText !== undefined && !flags.json && !flags.out) {
    stdout.write(rawText.endsWith('\n') ? rawText : rawText + '\n');
    if (!flags.quiet) stderr.write(renderWarnings(env));
    return EXIT.OK;
  }
  const text = render(env, format, { piped: !stdout.isTTY, pretty: flags.pretty });
  if (flags.out && env.ok) {
    const outText = rawText !== undefined ? rawText : text;
    writeFileSafe(path.resolve(io.cwd || process.cwd(), flags.out), outText);
    if (!flags.quiet) stderr.write(`Wrote ${flags.out}\n`);
  } else if (text) stdout.write(text);
  if (!flags.quiet) stderr.write(renderWarnings(env));
  if (!env.ok) {
    if (format !== 'json' || stdout.isTTY) stderr.write(renderError(env));
    if (flags.verbose && env.stack) stderr.write(env.stack + '\n');
    return env.exitCode ?? EXIT.INTERNAL;
  }
  return EXIT.OK;
}
