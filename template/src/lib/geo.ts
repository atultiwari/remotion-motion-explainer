export type Pt = { x: number; y: number };

/** Simplified mainland France outline as [lat, lon] (hand-built, public facts only). */
export const FRANCE_LATLON: ReadonlyArray<readonly [number, number]> = [
  [51.05, 2.37], [50.95, 1.85], [50.72, 1.6], [50.2, 1.55], [49.95, 1.2], [49.7, 0.2], [49.45, 0.1],
  [49.3, -0.3], [49.4, -1.15], [49.7, -1.3], [49.65, -1.9], [49.2, -1.6], [48.65, -1.5], [48.65, -2.0],
  [48.85, -3.0], [48.65, -4.0], [48.4, -4.75], [48.05, -4.6], [47.8, -4.2], [47.7, -3.4], [47.4, -2.6],
  [47.25, -2.2], [46.8, -2.1], [46.4, -1.75], [46.15, -1.15], [45.6, -1.05], [45.0, -1.2], [44.65, -1.25],
  [43.95, -1.35], [43.48, -1.56], [43.37, -1.78], [43.05, -1.2], [42.8, -0.2], [42.7, 0.7], [42.6, 1.6],
  [42.45, 2.5], [42.45, 3.15], [43.0, 3.05], [43.3, 3.5], [43.5, 4.3], [43.4, 4.8], [43.3, 5.4],
  [43.1, 5.9], [43.2, 6.6], [43.55, 7.0], [43.78, 7.5], [44.1, 7.7], [44.4, 6.9], [45.1, 6.6],
  [45.9, 7.0], [46.2, 6.1], [46.5, 6.2], [47.0, 6.8], [47.6, 7.55], [48.3, 7.7], [48.97, 8.2],
  [49.2, 6.7], [49.5, 5.9], [49.55, 5.4], [50.1, 4.8], [50.0, 4.2], [50.4, 3.6], [50.75, 2.9],
];

export const CORSICA_LATLON: ReadonlyArray<readonly [number, number]> = [
  [43.0, 9.4], [42.7, 9.45], [42.4, 9.55], [41.95, 9.4], [41.4, 9.2], [41.6, 8.8], [41.9, 8.6],
  [42.3, 8.6], [42.6, 8.75],
];

const LON_MIN = -5.2;
const LAT_MAX = 51.3;
const COS_LAT = Math.cos((46.5 * Math.PI) / 180);

export const project = ([lat, lon]: readonly [number, number], pxPerDeg: number): Pt => ({
  x: (lon - LON_MIN) * pxPerDeg * COS_LAT,
  y: (LAT_MAX - lat) * pxPerDeg,
});

export const toPath = (pts: ReadonlyArray<Pt>): string =>
  `${pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} Z`;

/** Ray-casting point-in-polygon test. */
export const insidePolygon = (p: Pt, poly: ReadonlyArray<Pt>): boolean =>
  poly.reduce((inside, a, i) => {
    const b = poly[(i + poly.length - 1) % poly.length];
    const crosses = a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x;
    return crosses ? !inside : inside;
  }, false);

export const bounds = (poly: ReadonlyArray<Pt>) => ({
  minX: Math.min(...poly.map((p) => p.x)),
  maxX: Math.max(...poly.map((p) => p.x)),
  minY: Math.min(...poly.map((p) => p.y)),
  maxY: Math.max(...poly.map((p) => p.y)),
});

/** Deterministic points scattered inside a polygon using a seeded RNG `rand(seed)`. */
export const scatterInside = (
  poly: ReadonlyArray<Pt>,
  count: number,
  rand: (seed: string) => number,
  seedPrefix: string,
): Pt[] => {
  const b = bounds(poly);
  const pts: Pt[] = [];
  for (let attempt = 0; pts.length < count && attempt < count * 50; attempt++) {
    const p = {
      x: b.minX + rand(`${seedPrefix}-x-${attempt}`) * (b.maxX - b.minX),
      y: b.minY + rand(`${seedPrefix}-y-${attempt}`) * (b.maxY - b.minY),
    };
    if (insidePolygon(p, poly)) pts.push(p);
  }
  return pts;
};
