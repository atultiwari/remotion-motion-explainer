#!/usr/bin/env node
// Render one QA still per scene (at a fraction through each scene) without rendering video.
// Usage: node scripts/stills.mjs <outDir> [fraction=0.7] [sceneIdFilter]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [outDir = "out/stills", fracArg = "0.7", filter = ""] = process.argv.slice(2);
const fraction = Number(fracArg);
if (!(fraction >= 0 && fraction <= 1)) throw new Error("fraction must be between 0 and 1");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const main = await selectComposition({ serveUrl, id: "Explainer", inputProps: {} });
const timed = main.props.timed ?? [];
let start = 0;
for (const scene of timed) {
  const frame = start + Math.floor(scene.durationInFrames * fraction);
  start += scene.durationInFrames;
  if (filter && !scene.id.includes(filter)) continue;
  const output = path.join(outDir, `${scene.id}.png`);
  await renderStill({ serveUrl, composition: main, frame, output, inputProps: main.props, scale: 0.5 });
  console.log(`✓ ${scene.id} @ frame ${frame}`);
}
