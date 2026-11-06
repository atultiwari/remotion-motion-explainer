#!/usr/bin/env python3
"""Master the narration as one performance, then split it back into per-scene files.

    python3 -I scripts/master-narration.py

1. Joins tts/takes/en-NN.wav in beat order (tts/beat-map.json), recording each take's length.
2. Upmixes to 48 kHz dual-mono stereo, so loudness is measured as the video will play it
   (a mono file summed to stereo arrives about 3 LU hotter than it measured).
3. Masters the joined track once with the skill's master-audio.py (--voice-eq, -14 LUFS,
   -1 dBTP): one gain for the whole voice, so no scene is louder than its neighbour.
4. Cuts the master back at the recorded boundaries into public/audio/<sceneId>.wav,
   which calculateMetadata reads for scene timing.

Needs numpy and ffmpeg. Uses the bundled scripts/master-audio.py.
"""
from __future__ import annotations

import json
import subprocess
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
TTS = ROOT / "tts"
BUILD = TTS / "build"
PUBLIC_AUDIO = ROOT / "public" / "audio"
MASTER_SCRIPT = Path(__file__).resolve().parent / "master-audio.py"  # bundled copy
RATE = 48_000


def run(cmd: list[str]) -> str:
    done = subprocess.run(cmd, capture_output=True, text=True)
    if done.returncode != 0:
        raise SystemExit(f"{cmd[0]} failed:\n{done.stderr[-1200:]}")
    return done.stdout + done.stderr


def to_48k_stereo(src: Path, dst: Path) -> None:
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-ar", str(RATE), "-ac", "2", "-c:a", "pcm_s24le", str(dst)])


def read_pcm(path: Path) -> np.ndarray:
    """Read any WAV as float32 frames x channels via ffmpeg (handles 24-bit)."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").reshape(-1, 2)


def write_wav(path: Path, frames: np.ndarray) -> None:
    pcm = (np.clip(frames, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm.tobytes())


def main() -> int:
    beat_map: dict[str, str] = json.loads((TTS / "beat-map.json").read_text())
    BUILD.mkdir(parents=True, exist_ok=True)
    PUBLIC_AUDIO.mkdir(parents=True, exist_ok=True)

    pieces: list[np.ndarray] = []
    for beat in sorted(beat_map):
        take = TTS / "takes" / f"en-{beat}.wav"
        if not take.exists():
            raise SystemExit(f"missing take {take.name} for scene {beat_map[beat]}")
        tmp = BUILD / f"up-{beat}.wav"
        to_48k_stereo(take, tmp)
        pieces.append(read_pcm(tmp))
        tmp.unlink()
    lengths = [len(p) for p in pieces]
    joined = BUILD / "narration-joined.wav"
    write_wav(joined, np.concatenate(pieces))
    print(f"joined {len(pieces)} takes · {sum(lengths) / RATE:.1f}s")

    print(run(["python3", "-I", str(MASTER_SCRIPT), str(joined), "--out", str(BUILD / "mastered"), "--voice-eq"]).strip()[-600:])
    mastered = read_pcm(BUILD / "mastered" / joined.name)
    if abs(len(mastered) - sum(lengths)) > RATE * 0.05:
        raise SystemExit(f"mastered length {len(mastered)} differs from joined {sum(lengths)}; refusing to split")

    offset = 0
    for beat, n in zip(sorted(beat_map), lengths):
        part = mastered[offset:offset + n]
        offset += n
        fade = min(len(part), int(0.004 * RATE))  # 4 ms edges: no clicks at the cut
        part = part.copy()
        part[:fade] *= np.linspace(0, 1, fade)[:, None]
        part[-fade:] *= np.linspace(1, 0, fade)[:, None]
        write_wav(PUBLIC_AUDIO / f"{beat_map[beat]}.wav", part)
    print(f"wrote {len(lengths)} scene files to public/audio/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
