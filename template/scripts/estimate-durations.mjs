#!/usr/bin/env node
// Re-estimate each scene's estimatedDurationSec from its narration word count.
// Usage: node scripts/estimate-durations.mjs [--wps 2.75] [--dry]
import { readFileSync, writeFileSync } from "node:fs";

const PATH = new URL("../src/data/scenes.json", import.meta.url);
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const wpsArg = args.indexOf("--wps");
const graph = JSON.parse(readFileSync(PATH, "utf8"));
const wps = wpsArg >= 0 ? Number(args[wpsArg + 1]) : graph.meta.wordsPerSecondEstimate;
if (!Number.isFinite(wps) || wps <= 0) throw new Error(`Invalid --wps value`);

const PAD = 0.6;
const SILENT_SEC = 6;
const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

const scenes = graph.scenes.map((s) => {
  const w = words(s.narration);
  const est = w === 0 ? SILENT_SEC : Math.round((w / wps + PAD) * 10) / 10;
  return { ...s, estimatedDurationSec: est };
});

const totalWords = scenes.reduce((n, s) => n + words(s.narration), 0);
const totalSec = scenes.reduce((n, s) => n + s.estimatedDurationSec, 0);
console.log(`${scenes.length} scenes · ${totalWords} words · ~${Math.floor(totalSec / 60)}m ${Math.round(totalSec % 60)}s at ${wps} words/sec`);
if (!dry) writeFileSync(PATH, JSON.stringify({ ...graph, scenes }, null, 2) + "\n");
