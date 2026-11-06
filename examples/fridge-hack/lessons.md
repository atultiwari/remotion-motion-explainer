# Lessons from the fridge-hack video, and the skill plan

Built 13–14 Oct 2026: a 49-scene, 11:05 longform. Path: script → Sarvam voice → mastered mix
→ YouTube upload, plus thumbnail, carousel and social copy. Each lesson below names where it
should live, so the next video starts from this point.

The **whiteboard pipeline (pen, hand, stroke-by-stroke drawing) stays exactly as it is.** This
plan adds a second visual mode next to it; it replaces nothing.

---

## A. What worked (keep it)

| Approach | Why it worked |
|---|---|
| **`scenes.json` as the single source of truth**, checked against a zod schema | Every narration, prop, source and timing change was one edit in one file. TTS script, captions, chapters and narration export were all generated from it. |
| **Scene length = audio length + 0.6 s**, with the estimate as fallback (`calculateMetadata`) | Silent preview first, real timing later, with no code changes. |
| **Word cues** (`{"atWord": "fifty"}` in props → `at` fraction) | Visual events land on the spoken word, and stay there through re-takes. |
| **Effects fired by the component that owns the event** (`<Sfx at={eventFrame}>`) | Sound stays in sync when scenes are retimed. No cue list to drift. |
| **Synthesised effects + music bed** (numpy, seeded) | Licence-free, reproducible, regenerated in 2 s. |
| **Mastering the joined narration once, then splitting per scene** | One gain for the whole voice: no scene louder than its neighbour. |
| **Every take Whisper-checked against the script** | Sarvam's own check missed "100" for "one hundred and eighty". Whisper caught 9 bad takes. |
| **Spoken respellings for the voice only** (`ttsPronunciations`) | E.Leclerc, CERT-In and AIIMS are spoken right while captions keep the real spelling. |
| **Daily-Prophet newspaper + clippings wall** for news beats | The owner's favourite look; turns "according to reports" into a picture. |
| **One recurring motif** (the thermometer: opens, returns at failure #5, closes at 4°C) | Ties 11 minutes together. |
| **Colourful backdrop moods** (cool / violet / hope / heat) | Replaced flat black; colour now carries meaning (red = danger, green = fix). |
| **Watermark on every frame**, consult QR scene, WhatsApp + subscribe end card | Branding and the channel asks, built once and reusable. |
| **Stills per scene + contact sheets** for QA, with no video render | Caught every overflow and overlap before the render. |

## B. What went wrong, and the rule it produced

| What happened | Rule |
|---|---|
| Owner saw "black, empty" frames: scenes faded in from the composition's black | Keep a backdrop **under** the transition layer; fade content only. |
| Captions 3 lines tall overlapped the picture | Split caption chunks evenly at ≤11 words when a sentence has no commas. Keep all content above a **210 px caption band**. |
| Thermometer "ALARM · SILENT", stamp text and timeline cards overlapped | Render one still per scene at 0.7 of its length and look at a contact sheet before any render. |
| TTS: "per store" → "per second tour"; "the poisoned models" → "poison" | Re-word the script, don't re-roll forever: after 2 failed takes, change the words. |
| Thumbnail "Hospitals next?" read as a threat | Educational framing: "lessons", not "you're next". |
| Thumbnail hierarchy: the hook was largest, the subject smallest | The subject ("HEALTHCARE AI") is the largest line; the hook is the lead-in. Check at 320 px wide. |
| YouTube description came pre-filled with the channel template | Select-all and replace, then **read the field back** (already in 06-publish; it happened again). |
| Pressing Escape in the upload dialog would have closed it (hashtag popup) | Click an inert label to dismiss popups. |
| The date picker moved between screenshot and click → scheduled for **Nov** 14 | After any date or time pick, read the value back before saving. |
| Chrome extension can't upload files over 10 MB | The owner drags the video into the dialog; the agent fills in everything else. |
| Video ran 11:05, not the 9–10 min target, at Sarvam pace 1.1 | At pace 1.1 the clone speaks about 160 wpm: budget about 1,450 words for 10 minutes. |
| Writing a sed edit against a JSON file reformatted by `json.dump` | Edit JSON with a JSON tool, never with sed. |

---

## C. Updates to existing skills

### `youtube-video-production` (the runbook)

1. **Step 0, modes:** add a fourth row, **`motion` (news / incident explainer)**: typography, SVG
   motion graphics, newspaper inserts, no pen. It uses the new kit (section D) instead of
   `remotion-whiteboard`. **The `illustrated` mode keeps requiring `remotion-whiteboard`,
   unchanged.** `install-kit.mjs` keeps enforcing it for drawn styles.
2. **03-script:** add `meta.ttsPronunciations` (respell for the voice, never in captions), and
   the rule "after 2 failed takes, change the words".
3. **04-voice:** add the measured numbers:
   - pace 1.1 → about 160 wpm (1,663 words = 10:29 of speech);
   - the Whisper check is mandatory: add `check-takes.py` to `scripts/`;
   - master the **joined** narration as dual-mono stereo, then split: add `master-narration.py`.
4. **09-motion:** document word cues (`atWord`, `nth`, `offsetSec`) as the way a beat-level
   prop lands on a word. Add `resolveWordCues` to the kit.
5. **10-sound:** add the **component-fired effects** path for when no measure render is
   wanted: the `Sfx` component, `synth-audio.py`, and the measured result (full mix
   −14.1 LUFS, −1.6 dBTP, bed ducked about 15 dB with a 6-frame glide).
6. **11-visual-qa:** add `stills.mjs` (one still per scene from one bundle), the 210 px
   caption band, and the backdrop-under-transition rule.
7. **06-publish:** add the YouTube Studio browser recipe:
   - the owner drags the file in;
   - replace the template description;
   - dismiss popups by clicking, never Escape;
   - read the schedule date back;
   - generate chapters from real timings (`youtube-chapters.py`);
   - tick the altered-content disclosure for the cloned voice;
   - read every field back from the saved video, not from the dialog.
8. **mistakes.md:** add the table in section B.

### `remotion-whiteboard`

No changes. It stays the engine for every drawn video.

---

## D. New skill 1: `remotion-motion-explainer` (the look of this video)

A kit and template for **news and incident explainers** in the incident-report style. It is
installed into a project the way the whiteboard kit is.

- **Template project:** `scenes.json` + schema, `calculateMetadata` (audio timing, captions,
  word cues), `SceneShell` (backdrop, transitions, beat tag, source tag, captions, watermark,
  effects), the main composition, single-scene compositions for review.
- **Components, all props-driven:** ThermometerDisplay (any "gauge" motif), NewspaperFrontPage
  + MovingPicture, ClippingsWall, MapDots (any region outline), NightTimeline, StatCounter,
  FailureCard + metaphors, SplitMirror, HospitalNetwork (closed vs open doors), AgentBreach,
  PoisonedThermometer, IconLine, ChecklistReveal, RecallScene, IndiaContext, ConsultCard (QR),
  ChannelCard, KineticText, TitleCard.
- **Theme:** colour tokens, the four backdrop moods, Space Grotesk / JetBrains Mono /
  UnifrakturMaguntia / Playfair / Old Standard.
- **Audio:** `synth-audio.py`, `Sfx`, music ducking with a glide.
- **Scripts:** estimate durations, export narration, make the TTS script, check takes, master
  narration, build captions, stills, chapters.
- **Guidance:** which component for which beat; one recurring motif; source tag on every fact;
  "illustrative" labels; no logos; no exploit detail.

The fridge-hack project is the worked example; the skill links to it.

## E. New skill 2: `video-promo-kit` (works for whiteboard and motion videos alike)

Everything after the render, reusable for any video:

- **Thumbnails:** 5+ variants as Remotion `Still`s from data. Vector illustrations (hospital,
  blood bank fridge, doctor, checklist, blood bag); a phone check at 320 px; the owner picks
  the final; educational framing; subject largest.
- **Carousel:** **1080×1080 (1:1) by default for Instagram**, as the owner asked. The same
  slides go into the LinkedIn PDF, so one design serves both; 4:5 stays an option. Co-branding
  with the white VRL seal on dark slides; video link on the first and last slides; QR code on
  the last; a teaser structure (hold back the best item, show 3 of 7).
- **Copy:** YouTube title/description/tags/chapters; LinkedIn post (Unicode bold, link in the
  first comment); Instagram caption (link in bio, 5 hashtags); WhatsApp message (`*bold*`,
  link on its own line); publish-timing notes.
- **Platform recipes:** YouTube Studio scheduling via Chrome; Instagram profile set-up
  (Creator account, name, bio). Account creation always stays with the owner.

---

## F. The one workflow change requested

Instagram carousel images become **1:1 (1080×1080)**. For this video that means re-laying out
the 10 slides for square: the content area loses 270 px of height, so slides 4, 7 and 9 need
tighter layouts. In the promo kit, 1:1 is the default.
