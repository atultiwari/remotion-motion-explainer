import { useMemo } from "react";
import QRCode from "qrcode";

/** A QR code drawn as SVG squares; generated synchronously so every frame is identical. */
export const QrCode: React.FC<{ value: string; size: number; color?: string; background?: string }> = ({
  value,
  size,
  color = "#0B1117",
  background = "#FFFFFF",
}) => {
  const { count, cells } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
    const n = qr.modules.size;
    const on: { x: number; y: number }[] = [];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (qr.modules.get(x, y)) on.push({ x, y });
      }
    }
    return { count: n, cells: on };
  }, [value]);

  const quiet = 4; // standard quiet zone, in modules
  const total = count + quiet * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges">
      <rect width={total} height={total} fill={background} />
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x + quiet} y={c.y + quiet} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
};
