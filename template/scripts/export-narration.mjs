#!/usr/bin/env node
// Write narration-script.md (scene id + text, in order) for the TTS step.
import { readFileSync, writeFileSync } from "node:fs";

const graph = JSON.parse(readFileSync(new URL("../src/data/scenes.json", import.meta.url), "utf8"));
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

let clock = 0;
let beat = "";
const lines = [
  `# Narration script — ${graph.meta.title}`,
  "",
  `_Generated from src/data/scenes.json. Do not edit by hand: edit the JSON and re-run \`npm run narration\`._`,
  "",
  "One audio file per scene: `public/audio/<scene id>.wav`. Scenes without narration need no file.",
  "",
];
for (const s of graph.scenes) {
  if (s.beat !== beat) {
    beat = s.beat;
    lines.push(`## ${beat} · ${graph.meta.beatTitles?.[beat] ?? ""}`, "");
  }
  lines.push(`### \`${s.id}\`  ·  ${fmt(clock)}  ·  ${words(s.narration)} words  ·  ~${s.estimatedDurationSec}s`, "");
  lines.push(s.narration ? s.narration : "_(no narration — title / music only)_", "");
  clock += s.estimatedDurationSec;
}
const total = graph.scenes.reduce((n, s) => n + words(s.narration), 0);
lines.push("---", "", `**Total:** ${total} words · ~${fmt(clock)} (estimate)`, "");
writeFileSync(new URL("../narration-script.md", import.meta.url), lines.join("\n"));
console.log(`narration-script.md written · ${total} words · ~${fmt(clock)}`);
