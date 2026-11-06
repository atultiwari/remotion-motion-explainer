import { AbsoluteFill } from "remotion";
import { FONTS } from "../theme";

/** Persistent ownership mark, bottom-right, below the caption band. */
export const Watermark: React.FC<{ text: string; handle?: string; scale?: number }> = ({ text, handle, scale = 1 }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: `0 ${36 * scale}px ${18 * scale}px 0`, pointerEvents: "none" }}>
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: 21 * scale,
        letterSpacing: 1,
        color: "rgba(232,238,242,0.62)",
        textShadow: "0 1px 4px rgba(0,0,0,0.8)",
      }}
    >
      {text}
      {handle ? <span style={{ opacity: 0.7 }}> · {handle}</span> : null}
    </div>
  </AbsoluteFill>
);
