import { COLORS } from "../../theme";

/** Aged-paper ground: base tone, grain, foxing stains and darkened edges. */
export const PaperTexture: React.FC<{ id: string }> = ({ id }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.paper,
        backgroundImage: [
          "radial-gradient(ellipse at 18% 12%, rgba(140,100,50,0.18) 0%, transparent 22%)",
          "radial-gradient(ellipse at 82% 64%, rgba(140,100,50,0.16) 0%, transparent 18%)",
          "radial-gradient(ellipse at 40% 88%, rgba(120,80,40,0.14) 0%, transparent 25%)",
          "radial-gradient(ellipse at center, transparent 55%, rgba(110,75,35,0.45) 100%)",
        ].join(", "),
      }}
    />
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", opacity: 0.55 }}>
      <filter id={`grain-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={7} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  </>
);
