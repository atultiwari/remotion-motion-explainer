import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type ChecklistRevealProps = { visibleItems: number; showIndiaLowerThird?: boolean };

/** The seven-point checklist from meta.checklist; one more item per scene. */
export const ChecklistReveal: SceneComponent<ChecklistRevealProps> = ({ visibleItems, showIndiaLowerThird = false, meta, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, items, indiaLowerThird } = meta.checklist;

  return (
    <AbsoluteFill>
      <Backdrop mood="hope" />
      <AbsoluteFill style={{ padding: "100px 120px 220px" }}>
        <div style={{ ...(visibleItems === 0 ? riseIn(frame, fps, 4, 30) : {}), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 60, color: COLORS.text, marginBottom: 14 }}>{title}</div>
        {items.map((item, i) => {
          const shown = i < visibleItems;
          const isNew = i === visibleItems - 1;
          const check = isNew ? ramp(frame, 14, 26) : shown ? 1 : 0;
          return (
            <div key={item.text} style={{ ...(isNew ? riseIn(frame, fps, 2, 24) : {}), display: "flex", alignItems: "center", gap: 26, padding: "8px 0", opacity: shown ? (isNew ? 1 : 0.62) : 0.12 }}>
              <div style={{ width: 54, height: 54, borderRadius: 12, border: `3px solid ${shown ? COLORS.green : COLORS.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.green, flexShrink: 0 }}>
                <div style={{ opacity: check, scale: String(check) }}><Icon name="check" size={38} strokeWidth={3} /></div>
              </div>
              <div style={{ color: shown ? COLORS.ice : COLORS.muted, flexShrink: 0 }}><Icon name={item.icon} size={40} /></div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 42, lineHeight: 1.15, fontWeight: isNew ? 700 : 500, color: COLORS.text }}>{shown ? item.text : `${i + 1}.`}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {showIndiaLowerThird ? (
        <div style={{ ...riseIn(frame, fps, durationInFrames * 0.5, 20), position: "absolute", left: 120, right: 120, bottom: 214, padding: "14px 24px", borderRadius: 12, backgroundColor: "rgba(245,166,35,0.12)", border: `2px solid ${COLORS.amber}`, fontFamily: FONTS.mono, fontSize: 26, color: COLORS.amber }}>
          {indiaLowerThird}
        </div>
      ) : null}
      {visibleItems > 0 ? <Sfx name="tick" at={14} /> : null}
      {visibleItems > 0 ? <Sfx name="chime" at={20} volume={0.35} /> : null}
    </AbsoluteFill>
  );
};
