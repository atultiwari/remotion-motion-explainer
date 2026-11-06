import { describe, expect, it } from "vitest";
import { FRANCE_LATLON, bounds, insidePolygon, project, scatterInside, toPath } from "../src/lib/geo";

const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];

describe("geo helpers", () => {
  it("detects points inside and outside a polygon", () => {
    expect(insidePolygon({ x: 5, y: 5 }, square)).toBe(true);
    expect(insidePolygon({ x: 15, y: 5 }, square)).toBe(false);
  });
  it("projects Paris inside the France outline", () => {
    const poly = FRANCE_LATLON.map((p) => project(p, 72));
    expect(insidePolygon(project([48.86, 2.35], 72), poly)).toBe(true);
    expect(insidePolygon(project([51.5, -0.12], 72), poly)).toBe(false); // London
  });
  it("scatters the requested number of deterministic points inside", () => {
    let i = 0;
    const seq = [0.1, 0.2, 0.5, 0.5, 0.9, 0.9, 0.3, 0.7];
    const rand = () => seq[i++ % seq.length];
    const pts = scatterInside(square, 3, rand, "t");
    expect(pts).toHaveLength(3);
    pts.forEach((p) => expect(insidePolygon(p, square)).toBe(true));
  });
  it("builds a closed SVG path and bounds", () => {
    expect(toPath(square)).toMatch(/^M0\.0,0\.0 .* Z$/);
    expect(bounds(square)).toEqual({ minX: 0, maxX: 10, minY: 0, maxY: 10 });
  });
});
