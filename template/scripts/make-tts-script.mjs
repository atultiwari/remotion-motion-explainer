#!/usr/bin/env node
// Write tts/script.md in the "## NN · Title" beat format that sarvam-tts.py and
// word-timestamps.py read, plus tts/beat-map.json (beat number → scene id).
// Silent scenes are skipped. One beat per narrated scene.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const graph = JSON.parse(readFileSync(new URL("../src/data/scenes.json", import.meta.url), "utf8"));
const outDir = new URL("../tts/", import.meta.url);
mkdirSync(outDir, { recursive: true });

// Spoken respellings for the voice only; captions keep the real spelling.
const respell = (text) =>
  Object.entries(graph.meta.ttsPronunciations ?? {}).reduce((t, [from, to]) => t.split(from).join(to), text);

const narrated = graph.scenes.filter((s) => s.narration.trim() !== "");
const map = {};
const lines = [`# ${graph.meta.title}`, ""];
narrated.forEach((s, i) => {
  const beat = String(i + 1).padStart(2, "0");
  map[beat] = s.id;
  // One paragraph per sentence: these become word-timestamps' "lines".
  const sentences = respell(s.narration).split(/(?<=[.?!])\s+/).filter(Boolean);
  lines.push(`## ${beat} · ${s.id}`, "", ...sentences.flatMap((x) => [x, ""]));
});
writeFileSync(new URL("script.md", outDir), lines.join("\n"));
writeFileSync(new URL("beat-map.json", outDir), JSON.stringify(map, null, 2) + "\n");
console.log(`tts/script.md · ${narrated.length} beats · ${narrated.reduce((n, s) => n + respell(s.narration).length, 0)} characters`);
