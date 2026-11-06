# 06 · Lessons (every mistake from fridge-hack and its rule)

| What happened | Rule |
|---|---|
| Frames looked "black, empty": scenes faded in from the composition's black | `SceneShell` renders a `Backdrop` under the transition layer; only the content fades. |
| Whole palette read as "dark theme, no background" | Coloured glows by mood; heat shifts the palette. Never flat near-black. |
| Captions ran to three lines over the picture | Chunk ≤11 words; comma-free runs split evenly; keep content above the 210 px band. |
| "ALARM · SILENT" overlapped the reading; stamp over text; timeline cards hit captions | One still per scene + contact sheet before every render. |
| Mirror and checklist text too small for phones; empty lower half | Newest row large, older rows dimmed; fill the height. |
| A script of 1,809 words for a 9–10 min target | Budget words from the voice's real rate (≈160 wpm at pace 1.1). |
| Sarvam QC passed "100" for "one hundred and eighty" | Whisper-check every take (`tts:check`). |
| "E.Leclerc" → "ET. Leklak", "AIIMS" → "Haines" | `ttsPronunciations` respellings (voice only); test hard names on 2 beats first. |
| "per store" → "per second tour" survived re-takes | After 2 failed takes, change the words. |
| Thermometer climbed out of step with "ten… twenty five… fifty" | Word cues (`atWord`) on keyframes. |
| Map chains lit before being named | `chains[].cue` on each chain's name. |
| Cue warnings flooded the log before narration existed | Only warn when real word timings exist. |
| Music stepped in volume at narrated/silent boundaries | Average the duck state over ±6 frames. |
| Thumbnail claim "From home" implied unknown facts about attackers | Every claim on every surface (thumbnail too) must be in the fact sheet. |
| A sed edit on JSON silently did nothing after `json.dump` reformatting | Edit JSON with python/node. |
| The analytics card for "best time to post" failed to load | Fall back to judgement: Indian doctors are online 7–9 PM IST weekdays, or 8–9 AM before OPD. |
| The scratchpad was cleared between sessions; reference stills were lost | Anything worth keeping goes into the project or the skill, not the scratchpad. |
