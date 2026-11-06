#!/usr/bin/env python3
"""Word-timed captions per scene, from the Whisper transcripts of the real takes.

    python3 -I scripts/build-captions.py

The words shown are the script's own (correct spelling, never Whisper's guesses); only the
timing comes from Whisper. Script words are aligned to heard words by sequence matching, and
any word Whisper missed takes a time interpolated from its neighbours.

Writes public/captions/<sceneId>.json: phrase cues of at most 11 words, each with its words'
start times so the current word can be highlighted.
"""
from __future__ import annotations

import difflib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module  # noqa: E402

check = import_module("check-takes")  # reuse number spelling + normalisation

ROOT = Path(__file__).resolve().parent.parent
TTS = ROOT / "tts"
OUT = ROOT / "public" / "captions"
MAX_WORDS = 11
END_PAD_MS = 250


def chunks(text: str) -> list[str]:
    """Same rule as src/lib/timing.ts splitIntoChunks: sentences, then commas, then even splits."""
    out: list[str] = []
    for sentence in [s for s in re.split(r"(?<=[.?!])\s+", text.strip()) if s]:
        if len(sentence.split()) <= MAX_WORDS:
            out.append(sentence)
            continue
        merged: list[str] = []
        for part in re.split(r"(?<=,)\s+", sentence):
            if merged and len(merged[-1].split()) + len(part.split()) <= MAX_WORDS:
                merged[-1] = f"{merged[-1]} {part}"
            else:
                merged.append(part)
        for m in merged:
            words = m.split()
            if len(words) <= MAX_WORDS:
                out.append(m)
            else:
                pieces = -(-len(words) // MAX_WORDS)
                size = -(-len(words) // pieces)
                out.extend(" ".join(words[i:i + size]) for i in range(0, len(words), size))
    return out


def heard_words(beat: str) -> list[tuple[str, float, float]]:
    data = json.loads((TTS / "whisper" / f"en-{beat}.json").read_text())
    out: list[tuple[str, float, float]] = []
    for seg in data["segments"]:
        for w in seg.get("words", []):
            parts = check.norm_words(w["word"])
            span = (w["end"] - w["start"]) / max(1, len(parts))
            out.extend((p, w["start"] + i * span, w["start"] + (i + 1) * span) for i, p in enumerate(parts))
    return out


def token_times(tokens: list[str], heard: list[tuple[str, float, float]]) -> list[float | None]:
    """Start time for each script token, None where unmatched."""
    flat: list[tuple[int, str]] = [(ti, n) for ti, tok in enumerate(tokens) for n in check.norm_words(tok)]
    sm = difflib.SequenceMatcher(a=[n for _, n in flat], b=[h[0] for h in heard], autojunk=False)
    times: list[float | None] = [None] * len(tokens)
    for block in sm.get_matching_blocks():
        for k in range(block.size):
            ti = flat[block.a + k][0]
            if times[ti] is None:
                times[ti] = heard[block.b + k][1]
    return times


def fill(times: list[float | None], total: float) -> list[float]:
    known = [(i, t) for i, t in enumerate(times) if t is not None]
    if not known:
        return [total * i / max(1, len(times)) for i in range(len(times))]
    out: list[float] = []
    for i, t in enumerate(times):
        if t is not None:
            out.append(t)
            continue
        before = max(((j, v) for j, v in known if j < i), default=(-1, 0.0))
        after = min(((j, v) for j, v in known if j > i), default=(len(times), total))
        frac = (i - before[0]) / (after[0] - before[0])
        out.append(before[1] + (after[1] - before[1]) * frac)
    return [max(a, b) for a, b in zip(out, [0.0] + out[:-1])]  # never go backwards


def main() -> int:
    graph = json.loads((ROOT / "src/data/scenes.json").read_text())
    narration = {s["id"]: s["narration"] for s in graph["scenes"]}
    beat_map: dict[str, str] = json.loads((TTS / "beat-map.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    for beat, scene_id in sorted(beat_map.items()):
        heard = heard_words(beat)
        total = heard[-1][2] if heard else 0.0
        text = narration[scene_id]
        cues = []
        times_all: list[float] = []
        token_lists = [c.split() for c in chunks(text)]
        all_tokens = [t for c in token_lists for t in c]
        times_all = fill(token_times(all_tokens, heard), total)
        k = 0
        for c_tokens in token_lists:
            starts = times_all[k:k + len(c_tokens)]
            k += len(c_tokens)
            cues.append({
                "text": " ".join(c_tokens),
                "startMs": round(starts[0] * 1000),
                "words": [{"text": t, "startMs": round(s * 1000)} for t, s in zip(c_tokens, starts)],
            })
        for i, cue in enumerate(cues):
            cue["endMs"] = cues[i + 1]["startMs"] if i + 1 < len(cues) else round(total * 1000) + END_PAD_MS
        (OUT / f"{scene_id}.json").write_text(json.dumps(cues, indent=1, ensure_ascii=False))
    print(f"wrote captions for {len(beat_map)} scenes to public/captions/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
