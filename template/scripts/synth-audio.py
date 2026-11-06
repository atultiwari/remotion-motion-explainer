#!/usr/bin/env python3
"""Synthesise the sound effects and the music bed for the video.

Everything is built from seeded noise and sine partials, so there are no samples
and nothing to license. Re-running gives identical files.

    python3 -I scripts/synth-audio.py            # writes public/sfx/*.wav and public/audio/music.wav
    python3 -I scripts/synth-audio.py --only sfx

Needs numpy only.
"""
from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

SR = 48_000
ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = ROOT / "public" / "sfx"
MUSIC_PATH = ROOT / "public" / "audio" / "music.wav"
rng = np.random.default_rng(11)


# ---------- helpers ----------------------------------------------------------

def t_axis(sec: float) -> np.ndarray:
    return np.arange(int(sec * SR)) / SR


def noise(sec: float) -> np.ndarray:
    return rng.standard_normal(int(sec * SR))


def band(x: np.ndarray, lo: float, hi: float) -> np.ndarray:
    """Brick-wall band-pass in the frequency domain (fine for short, enveloped sounds)."""
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(freqs < lo) | (freqs > hi)] = 0
    return np.fft.irfft(spec, len(x))


def lowpass_soft(x: np.ndarray, cutoff: float) -> np.ndarray:
    """Gentle low-pass: a smooth roll-off rather than a wall."""
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (freqs / cutoff) ** 4)
    return np.fft.irfft(spec, len(x))


def env_ad(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-np.maximum(t - attack, 0) / max(decay, 1e-4))
    return a * d


def bell(n: int) -> np.ndarray:
    return np.sin(np.linspace(0, np.pi, n)) ** 2


def sweep(f0: float, f1: float, sec: float) -> np.ndarray:
    t = t_axis(sec)
    f = f0 * (f1 / f0) ** (t / sec)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def normalise(x: np.ndarray, peak_db: float = -3.0) -> np.ndarray:
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * 10 ** (peak_db / 20)


def stereo(x: np.ndarray, pan: np.ndarray | float = 0.0) -> np.ndarray:
    pan = np.broadcast_to(pan, x.shape)
    left = x * np.cos((pan + 1) * np.pi / 4)
    right = x * np.sin((pan + 1) * np.pi / 4)
    return np.stack([left, right], axis=1)


def write(path: Path, x: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    data = x if x.ndim == 2 else stereo(x)
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"  {path.relative_to(ROOT)}  {len(data) / SR:.2f}s")


# ---------- effects ----------------------------------------------------------

def whoosh(sec: float = 0.7) -> np.ndarray:
    n = int(sec * SR)
    x = band(noise(sec), 300, 5000) * bell(n)
    return stereo(normalise(x, -6), np.linspace(-0.6, 0.6, n))


def paper_spin(sec: float = 1.3) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    flutter_rate = np.linspace(22, 5, n)
    flutter = 0.55 + 0.45 * np.sin(2 * np.pi * np.cumsum(flutter_rate) / SR)
    x = band(noise(sec), 900, 7000) * flutter * bell(n) * np.exp(-t * 0.6)
    return stereo(normalise(x, -5), np.sin(np.linspace(0, 3 * np.pi, n)) * 0.5)


def paper_drop(sec: float = 0.35) -> np.ndarray:
    n = int(sec * SR)
    rustle = band(noise(sec), 800, 4500) * env_ad(n, 0.01, 0.06)
    tap = sweep(140, 70, sec) * env_ad(n, 0.002, 0.05)
    return normalise(rustle + 0.6 * tap, -5)


def thump(sec: float = 0.45) -> np.ndarray:
    n = int(sec * SR)
    body = sweep(120, 45, sec) * env_ad(n, 0.003, 0.12)
    click = band(noise(sec), 1500, 6000) * env_ad(n, 0.001, 0.008)
    return normalise(body + 0.3 * click, -3)


def tick(sec: float = 0.05) -> np.ndarray:
    n = int(sec * SR)
    x = np.sin(2 * np.pi * 3200 * t_axis(sec)) * env_ad(n, 0.0005, 0.006)
    return normalise(x + 0.3 * band(noise(sec), 3000, 9000) * env_ad(n, 0.0005, 0.004), -8)


def pop(sec: float = 0.14) -> np.ndarray:
    n = int(sec * SR)
    return normalise(sweep(520, 980, sec) * env_ad(n, 0.003, 0.035), -7)


def blip(sec: float = 0.09) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    x = (np.sin(2 * np.pi * 1320 * t) + 0.4 * np.sin(2 * np.pi * 2640 * t)) * env_ad(n, 0.002, 0.02)
    return normalise(x, -10)


def chime(sec: float = 1.2) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    x = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(880, 1), (1320, 0.5), (1760, 0.25), (2640, 0.12)])
    return normalise(x * env_ad(n, 0.004, 0.35), -8)


def riser(sec: float = 4.0) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    tone = sweep(110, 440, sec) + 0.5 * sweep(165, 660, sec)
    air = band(noise(sec), 2000, 8000) * (t / sec) ** 2
    x = (0.7 * tone + 0.4 * air) * (t / sec) ** 1.5
    fade = np.ones(n)
    fade[-int(0.05 * SR):] = np.linspace(1, 0, int(0.05 * SR))
    return normalise(x * fade, -6)


def alarm(sec: float = 1.6) -> np.ndarray:
    t = t_axis(sec)
    out = np.zeros_like(t)
    for i, f in enumerate([880, 660, 880, 660]):
        start = int(i * 0.4 * SR)
        seg = int(0.28 * SR)
        tt = np.arange(seg) / SR
        tone = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)
        out[start:start + seg] += tone * env_ad(seg, 0.01, 0.12)
    return normalise(out, -8)


def hum(sec: float = 6.0) -> np.ndarray:
    """Fridge compressor drone; 50 Hz family, an exact number of cycles so it loops cleanly."""
    t = t_axis(sec)
    x = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(50, 1), (100, 0.6), (150, 0.25), (200, 0.12)])
    wobble = 1 + 0.08 * np.sin(2 * np.pi * 0.5 * t)
    air = lowpass_soft(noise(sec), 400) * 0.15
    return normalise(x * wobble + air, -10)


def glitch(sec: float = 0.5) -> np.ndarray:
    n = int(sec * SR)
    x = noise(sec)
    gate = np.repeat(rng.random(n // 480 + 1) > 0.45, 480)[:n]
    crushed = np.round(x * 4) / 4
    tone = np.sign(np.sin(2 * np.pi * 220 * t_axis(sec)))
    return normalise((crushed * 0.6 + tone * 0.4) * gate * bell(n) ** 0.3, -9)


def coin_tick(sec: float = 0.06) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    x = np.sin(2 * np.pi * 2093 * t) + 0.5 * np.sin(2 * np.pi * 4186 * t)
    return normalise(x * env_ad(n, 0.001, 0.012), -12)


EFFECTS = {
    "whoosh": whoosh, "paper-spin": paper_spin, "paper-drop": paper_drop, "thump": thump,
    "tick": tick, "pop": pop, "blip": blip, "chime": chime, "riser": riser, "alarm": alarm,
    "hum": hum, "glitch": glitch, "counter": coin_tick,
}


# ---------- music bed --------------------------------------------------------

def midi(m: float) -> float:
    return 440 * 2 ** ((m - 69) / 12)


# Calm, slightly unresolved progression: Am(add9) · Fmaj7 · C · Em7
CHORDS = [
    (45, [57, 60, 64, 71]),
    (41, [53, 57, 60, 64]),
    (48, [55, 60, 64, 67]),
    (40, [52, 55, 59, 62]),
]
CHORD_SEC = 8.0
CYCLES = 4
BPM = 80


def pad_note(f: float, sec: float) -> np.ndarray:
    t = t_axis(sec)
    x = np.zeros_like(t)
    for detune in (-0.12, 0.0, 0.12):
        ff = f * 2 ** (detune / 12)
        for h, a in [(1, 1), (2, 0.35), (3, 0.12)]:
            x += a * np.sin(2 * np.pi * ff * h * t + rng.random() * 6.28)
    n = len(t)
    attack = int(2.5 * SR)
    release = int(3.0 * SR)
    env = np.ones(n)
    env[:attack] = np.linspace(0, 1, attack) ** 2
    env[-release:] = np.linspace(1, 0, release) ** 2
    return x * env


def pluck(f: float, sec: float = 1.2) -> np.ndarray:
    n = int(sec * SR)
    t = t_axis(sec)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return x * env_ad(n, 0.004, 0.32)


def music() -> np.ndarray:
    loop_sec = CHORD_SEC * len(CHORDS) * CYCLES
    tail = 4.0
    total = int((loop_sec + tail) * SR)
    pad = np.zeros(total)
    bass = np.zeros(total)
    arp = np.zeros(total)
    step = 60 / BPM / 2  # eighth notes
    for cycle in range(CYCLES):
        for ci, (root, notes) in enumerate(CHORDS):
            start_sec = (cycle * len(CHORDS) + ci) * CHORD_SEC
            s = int(start_sec * SR)
            dur = CHORD_SEC + 3.0
            for m in notes:
                seg = pad_note(midi(m), dur)
                pad[s:s + len(seg)] += seg[: total - s]
            seg = np.sin(2 * np.pi * midi(root) * t_axis(dur))
            env = np.minimum(1, np.minimum(np.arange(len(seg)) / (1.5 * SR), (len(seg) - np.arange(len(seg))) / (2.5 * SR)))
            bass[s:s + len(seg)] += (seg * env)[: total - s]
            if cycle >= 1:  # the arpeggio enters after the first pass
                pattern = notes + notes[::-1][1:-1]
                for k in range(int(CHORD_SEC / step)):
                    m = pattern[k % len(pattern)] + 12
                    p = pluck(midi(m))
                    ps = s + int(k * step * SR)
                    accent = 1.0 if k % 4 == 0 else 0.6
                    arp[ps:ps + len(p)] += (p * accent)[: total - ps]
    pad = lowpass_soft(pad, 1800)
    arp = lowpass_soft(arp, 3500)
    air = lowpass_soft(band(rng.standard_normal(total), 200, 6000), 3000) * 0.02
    mono_l = 0.55 * pad + 0.5 * bass + 0.18 * arp + air
    mono_r = 0.55 * np.roll(pad, int(0.012 * SR)) + 0.5 * bass + 0.18 * np.roll(arp, int(0.18 * SR)) + air
    mix = np.stack([mono_l, mono_r], axis=1)
    # Fold the release tail back onto the start so the bed loops without a seam.
    n_loop = int(loop_sec * SR)
    looped = mix[:n_loop].copy()
    looped[: total - n_loop] += mix[n_loop:]
    return normalise(looped, -6)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", choices=["sfx", "music"], help="build only one group")
    args = parser.parse_args()
    if args.only in (None, "sfx"):
        print("Effects:")
        for name, fn in EFFECTS.items():
            write(SFX_DIR / f"{name}.wav", fn())
    if args.only in (None, "music"):
        print("Music bed:")
        write(MUSIC_PATH, music())


if __name__ == "__main__":
    main()
