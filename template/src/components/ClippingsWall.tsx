import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { PaperTexture } from "./newspaper/PaperTexture";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type Clipping = { outlet: string; date: string; headline: string; tilt: number };
export type ClippingsWallProps = { clippings: Clipping[]; note: string };

/** Layout slots for up to six clippings on the desk (x, y of the top-left corner). */
const SLOTS = [
  { x: 110, y: 120 }, { x: 720, y: 90 }, { x: 1300, y: 140 },
  { x: 330, y: 470 }, { x: 960, y: 450 }, { x: 1380, y: 520 },
];
const CLIP_W = 500;

export const ClippingsWall: SceneComponent<ClippingsWallProps> = ({ durationInFrames, clippings, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = (durationInFrames * 0.6) / Math.max(1, clippings.length);
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a130d" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #4a3524 0%, #1a130d 75%)" }} />
      <AbsoluteFill style={{ scale: String(push) }}>
        {clippings.slice(0, SLOTS.length).map((c, i) => {
          const p = springIn(frame, fps, i * per + 6, 14);
          const slot = SLOTS[i];
          return (
            <div
              key={c.headline}
              style={{
                position: "absolute",
                left: slot.x,
                top: slot.y,
                width: CLIP_W,
                padding: "26px 30px 30px",
                opacity: interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
                translate: `0px ${(1 - p) * -160}px`,
                rotate: `${c.tilt + (1 - p) * 14}deg`,
                scale: String(interpolate(p, [0, 1], [1.25, 1])),
                boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
                clipPath: "polygon(0% 2%, 6% 0%, 30% 1.5%, 55% 0%, 80% 2%, 100% 0%, 99% 40%, 100% 98%, 70% 100%, 40% 98.5%, 10% 100%, 0% 97%)",
              }}
            >
              <PaperTexture id={`clip${i}`} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.serif, fontSize: 22, color: COLORS.inkSoft, borderBottom: `2px solid ${COLORS.ink}`, paddingBottom: 6 }}>
                  <span style={{ fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{c.outlet}</span>
                  <span>{c.date}</span>
                </div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: COLORS.ink, marginTop: 12 }}>{c.headline}</div>
                {[0.95, 0.88, 0.92, 0.6].map((w, li) => (
                  <div key={li} style={{ height: 9, width: `${w * 100}%`, backgroundColor: "rgba(42,33,24,0.25)", marginTop: 12, borderRadius: 2 }} />
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, bottom: 200, fontFamily: FONTS.mono, fontSize: 22, color: "rgba(232,220,192,0.7)" }}>{note}</div>
      {clippings.slice(0, SLOTS.length).map((c, i) => (
        <Sfx key={`s-${c.headline}`} name="paper-drop" at={i * per + 12} volume={0.8} />
      ))}
    </AbsoluteFill>
  );
};
