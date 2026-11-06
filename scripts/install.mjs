#!/usr/bin/env node
/**
 * Create a new motion-explainer video project from this skill's template.
 *
 *   node <skill>/scripts/install.mjs <new-project-folder> [--no-install] [--force]
 *
 * In order:
 *   1. copies template/ into the folder (refuses a non-empty folder unless --force)
 *   2. renames gitignore -> .gitignore
 *   3. npm install (skip with --no-install)
 *   4. synthesises the sound effects and music bed (python3 + numpy)
 *
 * The template ships with the fridge-hack story as a working example in
 * src/data/scenes.json: replace it with the new story (see references/02-scene-graph.md).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = path.join(SKILL, "template");
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
const install = !args.includes("--no-install");

if (!target || args.includes("--help")) {
  console.log("Usage: node install.mjs <new-project-folder> [--no-install] [--force]");
  process.exit(target ? 0 : 2);
}
const dest = path.resolve(target);
if (fs.existsSync(dest) && fs.readdirSync(dest).filter((f) => f !== ".DS_Store").length > 0 && !force) {
  console.error(`install: ${dest} is not empty. Use an empty folder, or --force to overwrite template files.`);
  process.exit(1);
}
fs.mkdirSync(dest, { recursive: true });
fs.cpSync(TEMPLATE, dest, { recursive: true });
fs.renameSync(path.join(dest, "gitignore"), path.join(dest, ".gitignore"));
console.log(`✓ template copied to ${dest}`);

const run = (cmd) => execSync(cmd, { cwd: dest, stdio: "inherit" });
if (install) {
  run("npm install --no-audit --no-fund");
  try {
    run("python3 -I scripts/synth-audio.py");
  } catch {
    console.warn("! could not synthesise audio (needs python3 + numpy). Run `npm run sfx` later.");
  }
}
console.log(`
Next:
  cd ${dest}
  npm run dev            # Remotion Studio: composition "Explainer", per-scene comps under Scenes/
  edit src/data/scenes.json, then: npm run estimate && npm run narration
See ${path.join(SKILL, "SKILL.md")} for the full workflow.`);
