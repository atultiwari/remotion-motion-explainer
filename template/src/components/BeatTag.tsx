import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../theme";

/** Top-left file tag that tells the viewer which part of the story they're in. */
export const BeatTag: React.FC<{ title: string }> = ({ title }) => (
  <AbsoluteFill style={{ padding: "48px 60px", pointerEvents: "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 3, color: COLORS.muted }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.red, boxShadow: `0 0 12px ${COLORS.red}` }} />
      INCIDENT REPORT · {title}
    </div>
  </AbsoluteFill>
);
