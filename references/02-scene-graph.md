# 02 · The scene graph (`src/data/scenes.json`)

The single source of truth. React components read everything from it; no story text lives in
code. It is validated by zod (`src/data/schema.ts`) at load, so a typo fails loudly. Edit JSON
with a JSON tool (python/node), never with `sed`: `json.dump` reformats lines and sed silently
misses.

## Scene fields

| Field | Meaning |
|---|---|
| `id` | snake_case, unique, e.g. `s04g_failure5_alarm_fooled`. Also the audio and caption file name. |
| `beat` | `S1`, `S2`, `S6b`…: groups scenes into chapters and beat tags |
| `narration` | Spoken text (TTS-safe). Empty = silent scene (uses `estimatedDurationSec`). |
| `estimatedDurationSec` | Filled by `npm run estimate` (words ÷ `wordsPerSecondEstimate` + 0.6 s) |
| `audioFile` | Optional override; default `audio/<id>.wav` |
| `component` | Name registered in `src/scenes/registry.ts` |
| `props` | That component's props (see 03-components) |
| `onScreenText` | Lines for text components (KineticText, TitleCard) |
| `sourceCitation` | Small source tag top-right; `null` for none |
| `transition` | `fade` / `slide` / `cut` / `spin` (spin = newspaper handles its own entry) |

## Meta fields

| Field | Use |
|---|---|
| `title`, `subtitle`, `fps`, `width`, `height` | Composition basics (1920×1080 @ 30) |
| `wordsPerSecondEstimate` | 2.9 at Sarvam pace 1.1 (≈ 174 wpm estimate; real speech ran ≈ 160 wpm) |
| `music` | `{src, volume, duckedVolume}`: bed at 0.45 in pauses, 0.25 under narration |
| `sfx` | `{volume, enabled}`: master effects level (0.45) |
| `brand` | `{watermark, handle}`, shown bottom-right on every frame |
| `beatTitles` | beat → "FILE 02 · FIVE FAILURES" (the beat tag) |
| `chapterTitles` | beat → YouTube chapter title (`npm run chapters`) |
| `mirrorHeaders`, `mirrorRows` | Data for SplitMirror |
| `checklist` | `{title, items[{icon,text}], indiaLowerThird}` for ChecklistReveal |
| `ttsPronunciations` | Text → spoken respelling, **voice only** (e.g. `"E.Leclerc": "E Leclair"`, `"CERT-In": "Cert-In"`, `"AIIMS": "Aims"`) |
| `factsAsOf` | Date the facts were checked |

## Timing

`src/calculateMetadata.ts` runs before render:
1. For each scene, the length of `public/audio/<id>.wav` + 0.6 s, else `estimatedDurationSec`.
2. Captions from `public/captions/<id>.json` (word-timed), else sentence chunks spread over
   the estimate.
3. Word cues resolved (below).
4. The music file is detected; total duration = sum of scenes.

Animations inside components use **fractions of the scene** or **word cues**, never absolute
seconds, so they survive a re-take.

## Word cues

Any object in a scene's props with `"atWord"` gets an `at` fraction (0–1) from the moment that
word is spoken (`src/lib/cues.ts`):

```json
"keyframes": [
  { "at": 0, "temp": 4 },
  { "at": 0.38, "atWord": "twenty", "temp": 25 },
  { "at": 0.5, "atWord": "fifty", "temp": 50 }
]
```

- Matching is prefix and accent-insensitive on the caption words; `"nth": 2` takes the second
  occurrence; `"offsetSec": -0.3` leads the word.
- Always keep a fallback `at` beside `atWord`: it's used before narration exists.
- Components with cue props: ThermometerDisplay `keyframes`; FranceMapDots `chains[].cue`;
  AgentBreach `steps[]`; IconLine `items[].cue`, `punchlineCue`; KineticText `lineCues[]`,
  `stampCue`; StatCounter `statCue`, `binCue`; RecallScene `rightCue`, `flipCue`, `lessonCue`;
  HospitalNetwork `doorCues[]`, `incidentCue`; IndiaContext `items[].cue`, `lineCue`;
  PoisonedThermometer `ringCue`, `ratioCue`, `passCue`, `verdictCue`.

## Scripts that read the graph

| Command | Output |
|---|---|
| `npm run estimate` | Rewrites `estimatedDurationSec` |
| `npm run narration` | `narration-script.md` (for review and the owner) |
| `npm run tts:script` | `tts/script.md` in `## NN · id` beats (+ respellings) and `tts/beat-map.json` |
| `npm run chapters` | `youtube/chapters.txt` from real audio timings |
