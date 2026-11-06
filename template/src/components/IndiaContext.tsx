import { cueFrame } from "../lib/cues";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type IndiaContextProps = { items: { title: string; text: string; cue?: { at?: number } }[]; line: string; lineCue?: { at?: number } };

export const IndiaContext: SceneComponent<IndiaContextProps> = ({ durationInFrames, items, line, lineCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = (durationInFrames * 0.6) / Math.max(1, items.length);
  const itemAt = (i: number) => cueFrame(items[i].cue, (i * per + 4) / durationInFrames, durationInFrames);
  const lineAt = cueFrame(lineCue, 0.7, durationInFrames);
  return (
    <AbsoluteFill>
      <Backdrop mood="hope" />
      <AbsoluteFill style={{ justifyContent: "center", padding: "120px 120px 230px", gap: 60 }}>
        <div style={{ display: "flex", gap: 40 }}>
          {items.map((item, i) => (
            <div key={item.title} style={{ ...riseIn(frame, fps, itemAt(i), 30), flex: 1, borderRadius: 22, padding: "34px 36px", backgroundColor: COLORS.panel, borderTop: `8px solid ${i === items.length - 1 ? COLORS.red : COLORS.amber}` }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.amber }}>{item.title}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 44, lineHeight: 1.2, color: COLORS.text, marginTop: 16 }}>{item.text}</div>
            </div>
          ))}
        </div>
        <div style={{ ...riseIn(frame, fps, lineAt, 30), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 66, color: COLORS.text, textAlign: "center" }}>{line}</div>
      </AbsoluteFill>
      {items.map((item, i) => (
        <Sfx key={`s-${item.title}`} name="pop" at={itemAt(i)} volume={0.7} />
      ))}
      <Sfx name="thump" at={lineAt} volume={0.5} />
    </AbsoluteFill>
  );
};
