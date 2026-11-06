import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn, springIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { QrCode } from "./QrCode";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type ConsultCardProps = {
  kicker: string;
  title: string;
  points: string[];
  url: string;
  displayUrl: string;
  scanLabel: string;
  name: string;
};

/** A calm, one-scene invitation: QR code on the left, what the session covers on the right. */
export const ConsultCard: SceneComponent<ConsultCardProps> = ({ durationInFrames, kicker, title, points, url, displayUrl, scanLabel, name }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qrIn = springIn(frame, fps, 8, 16);
  const per = (durationInFrames * 0.45) / Math.max(1, points.length);

  return (
    <AbsoluteFill>
      <Backdrop mood="hope" />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "110px 140px 230px", gap: 90 }}>
        <div style={{ scale: String(qrIn), opacity: qrIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ padding: 22, borderRadius: 28, backgroundColor: "white", boxShadow: `0 0 70px rgba(0,191,165,0.45)` }}>
            <QrCode value={url} size={400} />
          </div>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: COLORS.ice }}>{scanLabel}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...riseIn(frame, fps, 4, 20), fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 6, color: COLORS.green }}>{kicker}</div>
          <div style={{ ...riseIn(frame, fps, 10, 30), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: COLORS.text, marginTop: 14 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 34 }}>
            {points.map((p, i) => (
              <div key={p} style={{ ...riseIn(frame, fps, fps + i * per, 24), display: "flex", alignItems: "center", gap: 18, fontFamily: FONTS.sans, fontSize: 40, color: COLORS.text }}>
                <span style={{ color: COLORS.green, display: "flex" }}><Icon name="check" size={40} strokeWidth={3} /></span>
                {p}
              </div>
            ))}
          </div>
          <div style={{ ...riseIn(frame, fps, durationInFrames * 0.55, 20), marginTop: 40, display: "inline-block", padding: "14px 26px", borderRadius: 14, backgroundColor: "rgba(0,191,165,0.14)", border: `2px solid ${COLORS.green}`, fontFamily: FONTS.mono, fontSize: 34, color: COLORS.text }}>
            {displayUrl}
          </div>
          <div style={{ ...riseIn(frame, fps, durationInFrames * 0.55, 20), marginTop: 14, fontFamily: FONTS.sans, fontSize: 30, color: COLORS.muted }}>{name}</div>
        </div>
      </AbsoluteFill>
      <Sfx name="chime" at={8} volume={0.6} />
      {points.map((p, i) => (
        <Sfx key={`s-${p}`} name="pop" at={fps + i * per} volume={0.6} />
      ))}
    </AbsoluteFill>
  );
};
