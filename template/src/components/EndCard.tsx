import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type EndCardProps = { question: string; prompt: string; subscribe: string };

export const EndCard: SceneComponent<EndCardProps> = ({ durationInFrames, question, prompt, subscribe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Backdrop mood="hope" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "100px 180px 240px", gap: 40, textAlign: "center" }}>
        <div style={{ ...riseIn(frame, fps, 4), fontFamily: FONTS.mono, fontSize: 64, fontWeight: 700, color: COLORS.ice }}>4.0°C</div>
        <div style={{ ...riseIn(frame, fps, 10), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 80, lineHeight: 1.1, color: COLORS.text }}>{question}</div>
        <div style={{ ...riseIn(frame, fps, durationInFrames * 0.3), fontFamily: FONTS.sans, fontSize: 44, color: COLORS.muted }}>{prompt}</div>
        {subscribe ? <div style={{ ...riseIn(frame, fps, durationInFrames * 0.7), padding: "18px 44px", borderRadius: 40, backgroundColor: COLORS.red, fontFamily: FONTS.sans, fontWeight: 700, fontSize: 40, color: "white" }}>{subscribe}</div> : null}
      </AbsoluteFill>
      <Sfx name="pop" at={10} volume={0.6} />
      {subscribe ? <Sfx name="chime" at={durationInFrames * 0.7} volume={0.6} /> : null}
    </AbsoluteFill>
  );
};
