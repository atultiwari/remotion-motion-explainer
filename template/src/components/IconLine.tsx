import { cueFrame } from "../lib/cues";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type IconLineProps = { items: { icon: string; text: string; cue?: { at?: number } }[]; punchline: string; punchlineCue?: { at?: number } };

/** A short list, one icon per line, revealed in step with the narration. */
export const IconLine: SceneComponent<IconLineProps> = ({ durationInFrames, items, punchline, punchlineCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const span = durationInFrames * (punchline ? 0.62 : 0.8);
  const per = span / Math.max(1, items.length);
  const itemAt = (i: number) => cueFrame(items[i].cue, (i * per + 4) / durationInFrames, durationInFrames);
  const punchAt = cueFrame(punchlineCue, (span + 6) / durationInFrames, durationInFrames);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", padding: "120px 200px 230px", gap: 34 }}>
        {items.map((item, i) => (
          <div key={item.text} style={{ ...riseIn(frame, fps, itemAt(i), 30), display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ width: 96, height: 96, borderRadius: 22, backgroundColor: COLORS.panel, border: `2px solid ${COLORS.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.ice, flexShrink: 0 }}>
              <Icon name={item.icon} size={52} />
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 50, fontWeight: 500, color: COLORS.text, lineHeight: 1.2 }}>{item.text}</div>
          </div>
        ))}
        {punchline ? (
          <div style={{ ...riseIn(frame, fps, punchAt, 30), marginTop: 20, fontFamily: FONTS.sans, fontWeight: 700, fontSize: 60, color: COLORS.amber }}>{punchline}</div>
        ) : null}
      </AbsoluteFill>
      {items.map((item, i) => (
        <Sfx key={`s-${item.text}`} name="pop" at={itemAt(i)} volume={0.7} />
      ))}
      {punchline ? <Sfx name="thump" at={punchAt} volume={0.55} /> : null}
    </AbsoluteFill>
  );
};
