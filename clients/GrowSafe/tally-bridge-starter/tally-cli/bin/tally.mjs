#!/usr/bin/env node
/**
 * tally: command-line bridge between AI systems and Tally.
 * Run "tally --help" for commands, "tally doctor" to check the connection.
 */
const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  process.stderr.write(`tally needs Node.js 20 or newer (found ${process.versions.node}). Install the LTS version from nodejs.org.\n`);
  process.exit(2);
}

const { runCli } = await import('../src/cli/main.mjs');
const code = await runCli(process.argv.slice(2));
// Long-running commands (mcp, serve, relay, watch, simulate) keep the process alive themselves.
if (code !== null && code !== undefined) process.exitCode = code;
