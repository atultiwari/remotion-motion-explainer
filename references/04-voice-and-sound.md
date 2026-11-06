# 04 · Voice and sound

All scripts are bundled in `template/scripts/`. `sarvam-tts.py`, `master-audio.py` and
`check-script.py` are copies from `youtube-video-production`.

## Voice (Sarvam cloned voice)

Needs `SARVAM_API_KEY` and `SARVAM_VOICE_ID` in `~/.zshenv` (not `.zshrc`: agent shells read
`.zshenv` only). Never print or store the key.

```bash
npm run tts:script                       # tts/script.md: one "## NN · scene_id" beat per narrated scene
python3 -I scripts/sarvam-tts.py tts/script.md --takes tts/takes --pace 1.1 --dry-run   # characters = cost
npm run tts                              # all takes (skips takes that already have sound)
npm run tts:check                        # Whisper every take vs the script
```

- **Cost:** about ₹2 per 1,000 characters (9,800 characters ≈ ₹21, Oct 2026). About 3 minutes for 48 takes.
- **Pace 1.1** sounded natural; ≈160 wpm.
- **Test the hard names first:** generate the 2–3 beats with proper nouns, transcribe them, and
  add respellings to `meta.ttsPronunciations` before the full run.
- **`tts:check` is mandatory.** Sarvam's own quality check passed a take that said "100" for
  "one hundred and eighty". Under 95% word match is flagged.
  - Ordinals ("eleventh" vs "11th") and homophones ("write" / "right") are false alarms.
  - A real problem gets one regeneration: `sarvam-tts.py … --beats NN --force`.
  - **If it fails twice, change the words** in scenes.json: "per store" → "at each store";
    "the poisoned models" → "the models trained on poisoned text".
  - A consistent soft consonant (the "-ed" in "poisoned") is the voice. Accept it.
  - "CERT-In" heard as "certain" is the correct pronunciation.

## Mastering

```bash
npm run tts:master     # join takes → 48 kHz dual-mono → voice EQ → −14 LUFS / −1 dBTP → split per scene
```

- Masters the narration **as one performance** (one gain, so no scene is louder than its
  neighbour), then cuts it back at the recorded boundaries into `public/audio/<id>.wav` with
  4 ms edge fades.
- Upmixes to stereo **before** measuring. A mono file summed to stereo plays about 3 LU hotter
  than it measured.
- Result on fridge-hack: −14.16 LUFS, −1.31 dBTP, LRA 2.5 after 5 limiter passes.

## Captions

```bash
npm run captions       # public/captions/<id>.json: phrases with per-word start times
```

The words shown are the script's own (real spelling); only the timing comes from Whisper.
Script words are aligned to heard words by sequence matching, and unmatched words are
interpolated. The `Captions` component highlights the current word in amber.

## Sound effects

13 effects synthesised from seeded noise and sine partials (`npm run sfx` →
`scripts/synth-audio.py` → `public/sfx/*.wav`). No samples, nothing to license:

whoosh, paper-spin, paper-drop, thump, tick, pop, blip, chime, riser, alarm, hum (6 s loop),
glitch, counter.

**Each component fires its own effects at the frames of its own events** with
`<Sfx name at volume loop? durationInFrames? />`, so sound follows the picture when a scene is
retimed. `SceneShell` adds a whoosh on fade and slide entries. Defaults that worked:

- stamps, failure numbers, verdicts: thump;
- list items: pop;
- checklist ticks: tick + soft chime;
- doors opening, breaches: glitch;
- newspaper: paper-spin, then paper-drop on landing;
- clippings: paper-drop each;
- map: sparse blips;
- counters: counter ticks every 3 frames;
- gauge scenes: hum loop, riser on the climb, alarm when unsafe, chime when back to safe.

## Music bed

A calm Am(add9)–Fmaj7–C–Em7 pad with a soft arpeggio after the first pass, 128 s seamless loop,
`public/audio/music.wav`. In the composition it loops at `music.volume` (0.45 ≈ −24 LUFS) in
pauses and glides to `duckedVolume` (0.25, ≈15 dB under the voice) over ±6 frames around
narrated scenes. Replace the file to use a licensed track.

## Verify the mix before the video render

```bash
npx remotion render Explainer /tmp/mix.wav --codec=wav --log=error
ffmpeg -nostats -i /tmp/mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary
```

Target −14 LUFS integrated, true peak ≤ −1 dBTP. Fridge-hack measured −14.1 LUFS / −1.6 dBTP
with effects at 0.45. The audio-only render took 17 minutes for 11 minutes of video, so run it
in the background.
