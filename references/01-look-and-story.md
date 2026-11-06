# 01 · The look and the story

## The visual language

- **Ground:** deep navy with slowly drifting coloured glows (`Backdrop`). Four moods carry
  meaning:
  - `cool` (teal, indigo, magenta): default;
  - `violet`: AI sections;
  - `hope` (teal, green): fixes, checklists, endings;
  - `heat` (0–1): blends to amber and red as things go wrong, so temperature *is* colour.

  Never a flat black frame: the owner read black as "no background".
- **Type:** Space Grotesk for headlines and captions, JetBrains Mono for data and tags,
  UnifrakturMaguntia + Playfair Display + Old Standard TT for newspaper pages. All loaded through
  `@remotion/google-fonts` in `src/theme.ts`.
- **Colour semantics:** ice `#7FD8F5` = normal or safe, amber `#F5A623` = warning, red `#FF4D4F` =
  failure, green `#4ADE80` = fix. Tokens live in `src/theme.ts`; never put a literal colour in a scene.
- **Frame furniture on every scene:**
  - "INCIDENT REPORT · FILE NN" beat tag, top-left;
  - source tag, top-right;
  - captions, bottom;
  - watermark, bottom-right.

  Newspaper scenes drop the tags and print their sources on the paper.
- **Newspaper inserts** (the owner's favourite): an aged page spins in, the camera pushes to the
  headline (a red ink underline draws on), then pans to a sepia "moving picture" and the columns.
  Use them for "what the news said" beats. The masthead is invented (*The Cold Chain
  Chronicle*), the columns are paraphrased from sources, and a footnote names them.
- **One recurring motif** ties a long video together. Fridge-hack used a thermometer: it opens at
  4°C rising to 80°C, returns as failure #5 and as the "poisoned thermometer", and closes back
  at 4°C with a working alarm. Pick a motif per story and make it come back at least three times.
- **Motion:** spring and ease-out arrivals (`riseIn`, `springIn`, `ramp` in `src/lib/motion.ts`),
  counters that tick, dots that pulse in waves, cards that stack. No spinning for its own sake.
  Everything is driven by `useCurrentFrame()`: no CSS transitions.

## Story structure that worked (fridge-hack, 11 min)

| Beat | Job | Components |
|---|---|---|
| Cold open | Something the viewer owns ("your blood bank fridge"), then the event, then a question | ThermometerDisplay, KineticText |
| Title | 6 s, music only | TitleCard |
| What happened | Newspaper, clippings, map + counters, timeline, losses, attribution status | NewspaperFrontPage, ClippingsWall, FranceMapDots, NightTimeline, StatCounter, KineticText (stamp) |
| N failures | One card each; a retention hook before the last ("the one that should worry doctors most") | FailureCard ×N + metaphors |
| The pivot | "This wasn't an AI attack. That's exactly the point." + the owner's thesis (closed networks → AI opens doors) | KineticText, HospitalNetwork |
| Mirror | Supermarket ↔ hospital, one row per narration line | SplitMirror ×rows, IconLine |
| Second incident | The AI-native version (an OpenAI agent in Australia's Medicare portal) | NewspaperFrontPage, AgentBreach, KineticText |
| Research | One striking number (0.001% poisoning) | PoisonedThermometer |
| Consequence | "Why they threw everything away" → logs decide what you recall | RecallScene |
| Checklist | 7 items, one scene each, plus a local regulation band | ChecklistReveal ×7, IndiaContext |
| Asks | 1:1 consultation (QR), callback to the motif, comment question, WhatsApp + subscribe | ConsultCard, ThermometerDisplay, EndCard, ChannelCard |

## Writing rules (TTS-safe, owner's voice)

- First line names something the viewer already has. Never a definition or a statistic.
- Spell numbers and years in words ("twenty twenty two"); no em dashes; no 1–2 word sentences
  followed by more text (they fuse). `npm run tts:lint` checks all three.
- Banned words: leverage, utilize, seamless, cutting-edge, empower, paradigm shift,
  game-changer, delve. No "In this video I'm going to…".
- Paraphrase news; at most a few short attributed quotes, shown as quote cards.
- Plain sentences that translate to Hindi or Hinglish.
- Asks: never in the first third. Consultation after the checklist (the moment "how do I do
  this?" arises). Subscribe and WhatsApp on the end card, in separate sentences.
- Word budget: the Sarvam clone at pace 1.1 speaks about **160 wpm**. 1,663 words gave 10:29
  of speech and 11:05 of video. For ~10 minutes, write about 1,450 words.
