#!/usr/bin/env python3
"""YouTube chapter timestamps from the real scene timings (same rule as calculateMetadata).

    python3 -I scripts/youtube-chapters.py

Scene length = narration file length + 0.6 s (or estimatedDurationSec when silent), in whole
frames. Chapters start at the first scene of each beat listed in meta.chapterTitles in
scenes.json (falls back to meta.beatTitles); beats not listed fold into the previous chapter.
YouTube needs the first chapter at 0:00, at least 3 chapters, each at least 10 s long.
"""
from __future__ import annotations

import json
import math
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAIL_PAD = 0.6
MIN_SCENE = 2.0


def wav_seconds(path: Path) -> float | None:
    if not path.exists():
        return None
    with wave.open(str(path)) as w:
        return w.getnframes() / w.getframerate()


def stamp(sec: float) -> str:
    s = int(sec)
    return f"{s // 60}:{s % 60:02d}"


def main() -> int:
    graph = json.loads((ROOT / "src/data/scenes.json").read_text())
    fps = graph["meta"]["fps"]
    chapters: dict[str, str] = graph["meta"].get("chapterTitles") or graph["meta"].get("beatTitles", {})
    if not chapters:
        raise SystemExit("add meta.chapterTitles (beat -> chapter title) to scenes.json")
    t_frames = 0
    seen: set[str] = set()
    lines: list[str] = []
    for scene in graph["scenes"]:
        beat = scene["beat"]
        if beat in chapters and beat not in seen:
            seen.add(beat)
            lines.append(f"{stamp(t_frames / fps)} {chapters[beat]}")
        audio = wav_seconds(ROOT / "public/audio" / f"{scene['id']}.wav") if scene["narration"] else None
        sec = scene["estimatedDurationSec"] if audio is None else audio + TAIL_PAD
        t_frames += max(1, math.ceil(round(max(MIN_SCENE, sec) * fps, 6)))
    out = ROOT / "youtube" / "chapters.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n")
    print("\n".join(lines))
    print(f"\ntotal {stamp(t_frames / fps)} ({t_frames} frames)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
