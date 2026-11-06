import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";

/** Small source tag, top-right, kept clear of captions and the main subject. */
export const SourceLowerThird: React.FC<{ citation: string; label?: string }> = ({ citation, label = "SOURCE" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", padding: "44px 60px", pointerEvents: "none" }}>
      <div
        style={{
          ...riseIn(frame, fps, Math.round(fps * 0.6), 16),
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: "10px 18px",
          borderRadius: 10,
          backgroundColor: "rgba(10,16,22,0.85)",
          border: `1px solid ${COLORS.panelEdge}`,
          fontFamily: FONTS.mono,
          fontSize: 22,
          color: COLORS.muted,
        }}
      >
        <span style={{ color: COLORS.ice, fontWeight: 700 }}>{label}</span>
        <span>{citation}</span>
      </div>
    </AbsoluteFill>
  );
};
