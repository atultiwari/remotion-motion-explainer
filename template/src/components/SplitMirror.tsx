import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type SplitMirrorProps = { visibleRows: number };

/** Opening frame: the two worlds, facing each other. */
const MirrorIntro: React.FC<{ left: string; right: string }> = ({ left, right }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const side = (label: string, icon: string, color: string, delay: number) => (
    <div style={{ ...riseIn(frame, fps, delay, 40), display: "flex", flexDirection: "column", alignItems: "center", gap: 26, color }}>
      <Icon name={icon} size={200} strokeWidth={1.2} />
      <div style={{ fontFamily: FONTS.mono, fontSize: 48, letterSpacing: 8 }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 120, paddingBottom: 180 }}>
      {side(left, "snowflake", COLORS.ice, 4)}
      <div style={{ ...riseIn(frame, fps, 14, 0), fontFamily: FONTS.mono, fontSize: 120, color: COLORS.muted }}>⇄</div>
      {side(right, "activity", COLORS.amber, 10)}
    </AbsoluteFill>
  );
};

/**
 * Supermarket ↔ hospital table from meta.mirrorRows. Each scene shows one more
 * row than the last, so a row arrives exactly with its own narration take.
 */
export const SplitMirror: SceneComponent<SplitMirrorProps> = ({ visibleRows, meta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { left: leftHead, right: rightHead } = meta.mirrorHeaders;
  if (visibleRows === 0) {
    return (
      <AbsoluteFill>
        <Backdrop />
        <MirrorIntro left={leftHead} right={rightHead} />
        <Sfx name="whoosh" at={6} volume={0.6} />
        <Sfx name="thump" at={14} volume={0.5} />
      </AbsoluteFill>
    );
  }
  const rows = meta.mirrorRows.slice(0, visibleRows);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ padding: "110px 100px 220px" }}>
        <div style={{ display: "flex", gap: 24, fontFamily: FONTS.mono, fontSize: 32, letterSpacing: 6, marginBottom: 14 }}>
          <div style={{ width: 600, color: COLORS.ice }}>{leftHead}</div>
          <div style={{ width: 60 }} />
          <div style={{ flex: 1, color: COLORS.amber }}>{rightHead}</div>
        </div>
        {rows.map((row, i) => {
          const isNew = i === visibleRows - 1;
          const leftIn = isNew ? ramp(frame, 2, 14) : 1;
          const arrowIn = isNew ? ramp(frame, 12, 22) : 1;
          const rightIn = isNew ? riseIn(frame, fps, 18, 20) : { opacity: 1 };
          return (
            <div key={row.left} style={{ display: "flex", alignItems: "center", gap: 24, padding: "14px 0", borderTop: `1px solid ${COLORS.panelEdge}`, opacity: isNew ? 1 : 0.45 }}>
              <div style={{ width: 600, opacity: leftIn, fontFamily: FONTS.sans, fontSize: isNew ? 40 : 32, color: COLORS.text, lineHeight: 1.15 }}>{row.left}</div>
              <div style={{ width: 60, opacity: arrowIn, fontFamily: FONTS.mono, fontSize: 44, color: COLORS.muted, textAlign: "center" }}>→</div>
              <div style={{ ...rightIn, flex: 1, fontFamily: FONTS.sans, fontSize: isNew ? 40 : 32, fontWeight: isNew ? 700 : 500, color: isNew ? COLORS.amber : COLORS.text, lineHeight: 1.15 }}>{row.right}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Sfx name="pop" at={2} volume={0.6} />
      <Sfx name="tick" at={18} volume={0.9} />
    </AbsoluteFill>
  );
};
