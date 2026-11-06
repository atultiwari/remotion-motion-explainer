---
name: remotion-motion-explainer
description: >-
  Self-contained Remotion kit and runbook for colourful motion-graphics explainer videos in an
  "incident report" style: news and incident explainers, case studies, "what went wrong and what
  doctors should learn" videos. Includes Daily-Prophet-style newspaper pages with moving pictures,
  clippings walls, map dots, a recurring gauge or thermometer motif, failure cards, a split-screen
  mirror table, checklists, a QR consultation card, burned-in word-highlighted captions,
  component-fired sound effects and a synthesised music bed, all driven by one scenes.json.
  Timing comes from per-scene narration files (Sarvam cloned voice), with word cues that land
  visuals on the spoken word. Use when asked for a news, incident or case-study explainer, a
  motion-graphics or typography video (not hand-drawn), "make it look like the fridge-hack video",
  or a video built from a scene graph. For drawn or whiteboard videos use remotion-whiteboard;
  for thumbnails, carousels and social copy use video-promo-kit.
license: MIT
metadata:
  author: Dr Atul Tiwari
  version: "1.0.0"
  measuredOn: "2026-10-14"
  workedExample: "Fridges Hacked: What Doctors Must Learn About AI Security (youtu.be/sEJZZfI0iuo)"
---

# Motion explainer

A complete video project template plus the runbook that produced *Fridges Hacked: What Doctors
Must Learn About AI Security* (11:05, 49 scenes, Oct 2026). **Everything needed is inside this
skill:** the template (`template/`), its scripts (including copies of the Sarvam TTS and
mastering scripts), and the worked example (`examples/fridge-hack/`). Nothing points at the
original project folder.

## When to use which skill

| Video | Skill |
|---|---|
| News, incident, case study, "lessons from X": typography, maps, newspaper pages, gauges | **this skill** |
| Drawn pictures, a pen and hand, stroke-by-stroke anatomy or diagrams | `remotion-whiteboard` (unchanged; required for anything drawn) |
| Order of work, claims, script, voice, gates (any video) | `youtube-video-production` (its `motion` mode points here) |
| Thumbnails, carousels, LinkedIn/Instagram/WhatsApp copy, YouTube upload | `video-promo-kit` |

## Quick start

```bash
node ~/.claude/skills/remotion-motion-explainer/scripts/install.mjs ~/Projects/remotion-projects/<name>
cd ~/Projects/remotion-projects/<name> && npm run dev
```

The template opens with the fridge-hack story so the look is visible immediately. Replace
`src/data/scenes.json` with the new story.

## The order of work (gates in bold)

1. **Facts first.** Write a fact sheet with sources before any narration. Every on-screen
   number needs a `sourceCitation`.
2. **Story → `scenes.json`.** Narration per scene, component + props, citations.
   `npm run estimate && npm run narration`; lint with `npm run tts:lint`.
3. **Silent preview with temporary captions.** Sentence captions, estimated durations.
   **The owner approves the story here; no TTS before this.**
4. **Stills QA:** `npm run stills`, contact sheet, fix overlaps (references/05).
5. **Voice:** `npm run tts` → `npm run tts:check` (Whisper, every take) → re-take or re-word →
   `npm run tts:master` → `npm run captions`. Scene lengths now come from the audio.
6. **Word cues:** add `{"atWord": "…"}` to the props whose events must land on a word.
7. **Sound:** effects fire from components; check the full mix with an audio-only render
   (target −14 LUFS, ≤ −1 dBTP).
8. **Render** only when the owner says so (references/05).
9. **Chapters** (`npm run chapters`), then hand over to `video-promo-kit`.

## Where the detail lives

| File | Read at |
|---|---|
| `references/01-look-and-story.md` | step 1–2: the visual language, story arc, motifs, writing rules |
| `references/02-scene-graph.md` | step 2: every field of scenes.json, word cues, transitions |
| `references/03-components.md` | step 2–4: component catalogue, props, layout rules, adding one |
| `references/04-voice-and-sound.md` | step 5–7: Sarvam, Whisper check, mastering, captions, effects, music, levels |
| `references/05-qa-render.md` | step 4, 8, 9: stills, contact sheets, render, verification, chapters |
| `references/06-lessons.md` | when something looks wrong: every mistake made and its rule |
| `examples/fridge-hack/` | the worked example: scenes.json, narration script, status, lessons, stills of the look |

## Non-negotiables

- No real logos or brand marks; outlet and company names as plain text; headlines paraphrased;
  invented visuals labelled "illustrative".
- No exploit steps, code or how-to for attacks in security videos.
- Never speculate on attribution; say "not publicly attributed as of <date>".
- The owner approves the script, the thumbnail and the render. Ask when in doubt.
