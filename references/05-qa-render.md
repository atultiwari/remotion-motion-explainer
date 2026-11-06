# 05 · QA, render, chapters

## Stills before any render

```bash
npm run stills                                   # out/stills/<scene>.png at 0.7 of each scene (one bundle)
node scripts/stills.mjs out/stills 0.33 front    # a fraction and a scene-id filter
```

Then build contact sheets (9 per sheet at 640×360) with PIL and **look at them**. Check:

- nothing below y = 870 (the caption band), no text overlapping text;
- stamp and tag positions don't collide with content;
- no near-black empty frames (the backdrop must show during fades);
- captions are at most two lines;
- word-cued events: after narration, render at a cue's fraction and confirm the picture
  matches the highlighted word;
- text is readable at phone size (headline ≥ 72 px, body ≥ 40 px).

Run `npm test` (scene graph valid, narration TTS-safe, timing, captions, map, cues) and
`npm run lint`.

## Render (only when the owner says so)

```bash
npx remotion render Explainer out/<name>-1080p.mp4 --codec=h264 --crf=16 \
  --audio-codec=aac --audio-bitrate=320k --pixel-format=yuv420p --log=error
```

An 11-minute render took about 20 minutes, so run it in the background. Ignore the 404 lines
for absent caption and audio files. Then verify the delivered file, not the master:

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration out/<name>-1080p.mp4
ffmpeg -nostats -i out/<name>-1080p.mp4 -vn -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary
```

Extract 5–6 frames at known times (`ffmpeg -ss T -frames:v 1`) and check them.

## Chapters

```bash
npm run chapters        # youtube/chapters.txt
```

Chapter times are computed with exactly the scene-length rule the composition uses. On
fridge-hack the total matched the rendered file to the frame (19,943 frames = 664.77 s), so
check that the total equals the video duration. Spot-check two chapter starts against frames
extracted from the MP4.

## Hand-over

Thumbnails, carousel, YouTube description, upload and social copy: `video-promo-kit`.
