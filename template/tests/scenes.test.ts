import { describe, expect, it } from "vitest";
import scenesJson from "../src/data/scenes.json";
import { parseSceneGraph } from "../src/data/schema";

const NO_DIGITS = /\d/;
const KNOWN_COMPONENTS = [
  "AgentBreach", "ChannelCard", "ChecklistReveal", "ConsultCard", "ClippingsWall", "EndCard", "FailureCard", "FranceMapDots",
  "HospitalNetwork", "IconLine", "IndiaContext", "KineticText", "NewspaperFrontPage", "NightTimeline",
  "PoisonedThermometer", "RecallScene", "SplitMirror", "StatCounter", "ThermometerDisplay", "TitleCard",
];

describe("scenes.json", () => {
  const graph = parseSceneGraph(scenesJson);

  it("is valid against the schema", () => {
    expect(graph.scenes.length).toBeGreaterThan(0);
  });
  it("rejects duplicate ids", () => {
    const dup = { ...graph, scenes: [graph.scenes[0], graph.scenes[0]] };
    expect(() => parseSceneGraph(dup)).toThrow(/duplicate scene id/);
  });
  it("uses only registered components", () => {
    graph.scenes.forEach((s) => expect(KNOWN_COMPONENTS).toContain(s.component));
  });
  it("keeps narration TTS-safe: no digits, no em dashes", () => {
    graph.scenes.forEach((s) => {
      expect(s.narration, s.id).not.toMatch(NO_DIGITS);
      expect(s.narration, s.id).not.toContain("—");
    });
  });
  it("has one mirror row per mirror scene and seven checklist items", () => {
    const maxRows = Math.max(...graph.scenes.filter((s) => s.component === "SplitMirror").map((s) => Number(s.props.visibleRows)));
    expect(maxRows).toBe(graph.meta.mirrorRows.length);
    expect(graph.meta.checklist.items).toHaveLength(7);
  });
});
