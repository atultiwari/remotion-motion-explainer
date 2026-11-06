import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type ChannelCardProps = { name: string; tagline: string; groupTitle: string; groupNote: string; subscribe: string };

/** The closing card: the channel speaking, with the WhatsApp group and subscribe. */
export const ChannelCard: SceneComponent<ChannelCardProps> = ({ durationInFrames, name, tagline, groupTitle, groupNote, subscribe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subAt = durationInFrames * 0.6;
  return (
    <AbsoluteFill>
      <Backdrop mood="hope" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "100px 160px 240px", gap: 34, textAlign: "center" }}>
        <div style={{ ...riseIn(frame, fps, 2, 30), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 86, color: COLORS.text }}>{name}</div>
        <div style={{ ...riseIn(frame, fps, 8, 20), fontFamily: FONTS.sans, fontSize: 40, color: COLORS.muted }}>{tagline}</div>
        <div style={{ ...riseIn(frame, fps, fps, 30), display: "flex", alignItems: "center", gap: 26, marginTop: 20, padding: "24px 40px", borderRadius: 24, backgroundColor: "rgba(37,211,102,0.12)", border: "3px solid #25D366" }}>
          <span style={{ color: "#25D366", display: "flex" }}><Icon name="users" size={64} /></span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 48, color: COLORS.text }}>{groupTitle}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 28, color: COLORS.muted, marginTop: 4 }}>{groupNote}</div>
          </div>
        </div>
        <div style={{ ...riseIn(frame, fps, subAt, 20), padding: "18px 48px", borderRadius: 40, backgroundColor: COLORS.red, fontFamily: FONTS.sans, fontWeight: 700, fontSize: 40, color: "white" }}>{subscribe}</div>
      </AbsoluteFill>
      <Sfx name="chime" at={4} volume={0.5} />
      <Sfx name="pop" at={fps} volume={0.7} />
      <Sfx name="pop" at={subAt} volume={0.7} />
    </AbsoluteFill>
  );
};
