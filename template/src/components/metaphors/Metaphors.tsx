import { interpolate, random, useCurrentFrame } from "remotion";
import { ramp } from "../../lib/motion";
import { COLORS, FONTS } from "../../theme";
import { Icon } from "../Icon";

type MetaProps = { start: number; durationInFrames: number };

/** #1 A door swinging open toward the internet. */
export const DoorMetaphor: React.FC<MetaProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const open = ramp(frame, start, start + 40);
  return (
    <div style={{ position: "relative", width: 520, height: 560, perspective: 1200 }}>
      <div style={{ position: "absolute", left: 80, top: 40, width: 360, height: 500, backgroundColor: "#04070a", border: `6px solid ${COLORS.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.amber }}>
        <div style={{ opacity: open }}><Icon name="globe" size={180} strokeWidth={1.2} /></div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 40, width: 360, height: 500, backgroundColor: "#24333f", border: `6px solid ${COLORS.panelEdge}`, transformOrigin: "left center", transform: `rotateY(${-75 * open}deg)` }}>
        <div style={{ position: "absolute", right: 30, top: 240, width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.muted }} />
      </div>
    </div>
  );
};

/** #2 Two calendar pages and the gap between them. */
export const CalendarMetaphor: React.FC<MetaProps & { calendar: { from: string; fromLabel: string; to: string; toLabel: string; gap: string } }> = ({ start, calendar }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, start, start + 20);
  const line = ramp(frame, start + 20, start + 60);
  const b = ramp(frame, start + 55, start + 75);
  const Page: React.FC<{ title: string; label: string; color: string; o: number }> = ({ title, label, color, o }) => (
    <div style={{ opacity: o, width: 220, borderRadius: 16, overflow: "hidden", backgroundColor: COLORS.panel, border: `3px solid ${COLORS.panelEdge}` }}>
      <div style={{ backgroundColor: color, color: COLORS.bgDeep, fontFamily: FONTS.mono, fontWeight: 700, fontSize: 30, textAlign: "center", padding: 12 }}>{title}</div>
      <div style={{ padding: 18, fontFamily: FONTS.sans, fontSize: 26, color: COLORS.text, textAlign: "center", minHeight: 110 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: 600 }}>
      <Page title={calendar.from} label={calendar.fromLabel} color={COLORS.ice} o={a} />
      <div style={{ position: "relative", width: 160, height: 6, backgroundColor: COLORS.panelEdge }}>
        <div style={{ width: `${line * 100}%`, height: 6, backgroundColor: COLORS.amber }} />
        <div style={{ position: "absolute", top: -54, width: "100%", textAlign: "center", fontFamily: FONTS.mono, fontSize: 28, color: COLORS.amber, opacity: line }}>{calendar.gap}</div>
      </div>
      <Page title={calendar.to} label={calendar.toLabel} color={COLORS.red} o={b} />
    </div>
  );
};

/** #3 A key that appears from nowhere, half hidden in shadow. */
export const KeyMetaphor: React.FC<MetaProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, start + 45);
  return (
    <div style={{ position: "relative", width: 520, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,166,35,${0.25 * p}) 0%, transparent 65%)` }} />
      <div style={{ color: COLORS.amber, opacity: p, rotate: `${interpolate(p, [0, 1], [-60, -20])}deg`, filter: `blur(${(1 - p) * 10}px)` }}>
        <Icon name="key" size={300} strokeWidth={1.2} />
      </div>
      <div style={{ position: "absolute", bottom: 30, fontFamily: FONTS.mono, fontSize: 24, color: COLORS.muted, opacity: p }}>concept only</div>
    </div>
  );
};

/** #4 A grid of identical locks; ~60% turn red together. */
export const LocksMetaphor: React.FC<MetaProps & { percent: number }> = ({ start, percent }) => {
  const frame = useCurrentFrame();
  const cols = 10;
  const total = 50;
  const flip = ramp(frame, start + 30, start + 50);
  return (
    <div style={{ width: 560 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFrance = i < (total * percent) / 100;
          const appear = ramp(frame, start + random(`lock-${i}`) * 25, start + 25 + random(`lock-${i}`) * 25);
          return (
            <div key={i} style={{ opacity: appear, color: isFrance && flip > 0.5 ? COLORS.red : COLORS.muted }}>
              <Icon name="lock" size={44} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 22, fontFamily: FONTS.mono, fontSize: 28, color: COLORS.red, opacity: flip }}>■ ≈{percent}% in France</div>
    </div>
  );
};

/** #5 Defrost bar: normal 1h vs stretched 8h, the alarm never fires. */
export const AlarmMetaphor: React.FC<MetaProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const grow = ramp(frame, start + 20, start + 90);
  return (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: 28 }}>
      {[{ label: "Normal defrost", h: 1, color: COLORS.ice }, { label: "Attack: stretched defrost", h: 8, color: COLORS.red }].map((row) => (
        <div key={row.label}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 26, color: COLORS.muted, marginBottom: 8 }}>{row.label} · {row.h}h</div>
          <div style={{ height: 40, backgroundColor: COLORS.panel, borderRadius: 8 }}>
            <div style={{ height: 40, width: `${(row.h / 8) * 100 * (row.h === 1 ? 1 : grow)}%`, backgroundColor: row.color, borderRadius: 8, opacity: 0.85 }} />
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: "#1a2129", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.7)" }} />
        <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.green }}>STATUS: ROUTINE DEFROST ✓</div>
      </div>
    </div>
  );
};
