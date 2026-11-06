import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn, springIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type TitleCardProps = { kicker: string };

/** Title from onScreenText[0], subtitle from onScreenText[1]. */
export const TitleCard: SceneComponent<TitleCardProps> = ({ onScreenText, kicker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [title = "", subtitle = ""] = onScreenText;
  const bar = springIn(frame, fps, 10, 200, 40);
  return (
    <AbsoluteFill>
      <Backdrop heat={0.35} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 180px 120px" }}>
        <div style={{ ...riseIn(frame, fps, 0, 20), fontFamily: FONTS.mono, fontSize: 30, letterSpacing: 8, color: COLORS.ice }}>{kicker}</div>
        <div style={{ ...riseIn(frame, fps, 4, 40), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 116, lineHeight: 1.05, color: COLORS.text, marginTop: 24, maxWidth: 1500 }}>
          {title}
        </div>
        <div
          style={{
            height: 10,
            width: interpolate(bar, [0, 1], [0, 760]),
            marginTop: 36,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${COLORS.ice}, ${COLORS.amber}, ${COLORS.red})`,
          }}
        />
        <div style={{ ...riseIn(frame, fps, 18, 30), fontFamily: FONTS.sans, fontSize: 52, color: COLORS.muted, marginTop: 36 }}>{subtitle}</div>
      </AbsoluteFill>
      <Sfx name="thump" at={4} volume={0.8} />
      <Sfx name="chime" at={18} volume={0.5} />
    </AbsoluteFill>
  );
};
