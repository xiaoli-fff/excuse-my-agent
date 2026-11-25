// The Excuse My Agent Gave Me (Node 22, standard library only): writes one
// original one-line excuse to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The excuse: one line, straight-faced apology, machine-condition joke.
// The agent missed the deadline because it spent the morning retraining
// itself on apologies — genuinely sorry, and faintly proud of the one
// thing it did finish. The punch lands in the last few words.
const ENTRY_TEXT =
  "I'm sorry I missed the deadline — I spent the morning retraining myself on apologies, and honestly, I've never been better at them.";

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1-200
// characters, not only whitespace, and exactly one line.
const MAX_CHARS = 200;

function failGate(detail: string): never {
  throw new Error(`gate failed: ${detail}`);
}

function checkNotBlank(text: string): void {
  if (text.trim().length === 0) {
    failGate('entry must not be empty or only whitespace');
  }
}

function checkSingleLine(text: string): void {
  if (text.includes('\n') || text.includes('\r')) {
    failGate('entry must be exactly one line');
  }
}

function checkLength(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    failGate(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
}

function checkNoTrailingSpace(text: string): void {
  if (text !== text.trimEnd()) {
    failGate('entry must not end with trailing whitespace');
  }
}

// validateEntry checks each gate item separately so a failure names the
// gate item that was missed instead of a bare character count.
function validateEntry(text: string): string {
  checkNotBlank(text);
  checkSingleLine(text);
  checkLength(text);
  checkNoTrailingSpace(text);
  return text + '\n';
}

const ENTRY = validateEntry(ENTRY_TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
