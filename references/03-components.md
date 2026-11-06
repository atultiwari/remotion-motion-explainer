# 03 · Components

All in `template/src/components/`, registered by name in `src/scenes/registry.ts`. Every scene
component receives its `props` plus `durationInFrames`, `onScreenText` and `meta`.
`SceneShell` wraps each one with: the backdrop (stays put during fades), the entry transition,
the beat tag, the source tag, captions, the watermark, a transition whoosh, and the narration
`<Audio>`.

## Catalogue

| Component | Use for | Key props |
|---|---|---|
| `ThermometerDisplay` | The gauge motif: a temperature, pressure or score that climbs. Alarm light, drips, night clock, hum + riser + alarm sounds. | `label`, `keyframes[{at, atWord?, temp}]`, `alarmWorking`, `alarmOn`, `night`, `melting`, `clock{from,to}`, `caption` |
| `KineticText` | Big statements; lines from `onScreenText` arrive one by one; the last line takes the accent. Optional rubber stamp. | `accent` (ice/amber/red), `size` (lg/xl), `stamp`, `caption`, `lineCues[]`, `stampCue` |
| `TitleCard` | Title + subtitle (`onScreenText[0..1]`) with gradient bar | `kicker` |
| `NewspaperFrontPage` | Daily-Prophet-style front page: spin-in, camera push to headline, moving sepia picture, columns | `masthead`, `edition`, `headline`, `subhead`, `photo` (thermometer/agent), `photoCaption`, `columns[4]`, `sideHeadline`, `sideText`, `footnote`, `camera[]` |
| `ClippingsWall` | Up to 6 aged clippings dropping onto a desk (outlet as plain text, paraphrased headline) | `clippings[{outlet,date,headline,tilt}]`, `note` |
| `FranceMapDots` | Outline map + dots per group lighting in waves + counters. To use another region, add a lat/lon outline in `src/lib/geo.ts`. | `chains[{name,count,prefix,note,label?,color,cue?}]`, `mapNote` |
| `NightTimeline` | A playhead sweeping hours; bars for normal vs stretched windows; event cards | `axisLabel`, `hours`, `normalHours`, `stretchedHours`, `events[{hour,text,tone}]` |
| `StatCounter` | Quote card + counting stat + bins filling | `stats[{value,prefix,suffix,label}]`, `quote`, `quoteBy`, `bins`, `binLabel`, `statCue`, `binCue` |
| `FailureCard` | Numbered failure with progress pips + metaphor: `door`, `calendar`, `key`, `locks`, `thermometer` | `number`, `title`, `body`, `metaphor`, `tone`, `calendar{}`, `percent` |
| `HospitalNetwork` | A walled network of nodes; `closed` phase vs `open` phase where doors punch through to outside services | `phase`, `nodes[6]`, `wallLabel`, `doors[≤5]`, `note`, `incident`, `doorCues[]`, `incidentCue` |
| `IconLine` | 2–4 icon + text rows and a punchline | `items[{icon,text,cue?}]`, `punchline`, `punchlineCue` |
| `SplitMirror` | Two-column comparison; scene N shows N rows (one narration line per row); `visibleRows: 0` = intro | `visibleRows`; data in `meta.mirrorHeaders/mirrorRows` |
| `AgentBreach` | An agent's task log (left) and a public/non-public diagram it slips through (right) + a quote | `task`, `steps[{at,atWord?,text,status}]`, `quote`, `quoteBy`, `note` |
| `PoisonedThermometer` | `poison`: one red token in a field of 100,000; `benchmark`: clean and poisoned models both PASS | `stage`, `fraction`, `fractionLabel`, `ratio`, labels, `verdict`, cues |
| `RecallScene` | Two panels: "can't prove it was safe → recall everything" | titles/texts, `windowLabel`, `reports`, `lesson`, cues |
| `ChecklistReveal` | N-item checklist; scene N reveals item N; optional local-law band | `visibleItems`, `showIndiaLowerThird`; data in `meta.checklist` |
| `IndiaContext` | 3 cards (law, rule, past incident) + a line | `items[{title,text,cue?}]`, `line`, `lineCue` |
| `ConsultCard` | 1:1 consultation with a QR code, 3 points, URL | `kicker`, `title`, `points[]`, `url`, `displayUrl`, `scanLabel`, `name` |
| `EndCard` | Comment question (+ optional subscribe pill) | `question`, `prompt`, `subscribe` |
| `ChannelCard` | Closing card: name, tagline, WhatsApp group box, subscribe | `name`, `tagline`, `groupTitle`, `groupNote`, `subscribe` |

Building blocks: `Backdrop` (moods), `Icon` (lucide names: activity bot calendar check clock
door droplet file flask hand key lock login refresh scan server shield snowflake syringe
thermometer users wrench log globe cloud cpu), `QrCode` (sync, deterministic), `Sfx`,
`Captions` (word highlight), `SourceLowerThird`, `BeatTag`, `Watermark`,
`newspaper/PaperTexture`, `newspaper/MovingPicture`, `metaphors/Metaphors`.

## Layout rules (1920×1080), measured on fridge-hack stills

- Keep all content **above y = 870**: captions occupy the bottom 210 px when they wrap to two
  lines. Notes and lower bands sit at `bottom: 214`.
- Side safe area 110–140 px. The beat tag (top-left) and source tag (top-right) own the top 100 px.
- Minimum sizes: headline 72–96 px, body 40–50 px, captions 50 px, small labels 22–28 px mono.
- Long tables (mirror, checklist): the newest row at full size and weight, earlier rows dimmed
  to 0.45–0.62 opacity and smaller.
- Captions: phrases of ≤11 words. Sentences split at commas, then evenly; the current word in
  amber.

## Adding a component

1. Create `src/components/X.tsx` exporting `X: SceneComponent<XProps>`. Use `useCurrentFrame()`
   and fractions of `durationInFrames`. Take cue props as `{ at?: number }` and use
   `cueFrame(cue, fallbackFraction, durationInFrames)`.
2. Put its sounds in the same file (`<Sfx name="pop" at={frame} />`) at the frames of its events.
3. Register it in `src/scenes/registry.ts`, and add it to `KNOWN_COMPONENTS` in
   `tests/scenes.test.ts`.
4. Use it in scenes.json, `npm run stills`, look at it, then `npm test`.
