import type React from "react";
import { AgentBreach } from "../components/AgentBreach";
import { ChannelCard } from "../components/ChannelCard";
import { ChecklistReveal } from "../components/ChecklistReveal";
import { ClippingsWall } from "../components/ClippingsWall";
import { ConsultCard } from "../components/ConsultCard";
import { EndCard } from "../components/EndCard";
import { FailureCard } from "../components/FailureCard";
import { FranceMapDots } from "../components/FranceMapDots";
import { HospitalNetwork } from "../components/HospitalNetwork";
import { IconLine } from "../components/IconLine";
import { IndiaContext } from "../components/IndiaContext";
import { KineticText } from "../components/KineticText";
import { NewspaperFrontPage } from "../components/NewspaperFrontPage";
import { NightTimeline } from "../components/NightTimeline";
import { PoisonedThermometer } from "../components/PoisonedThermometer";
import { RecallScene } from "../components/RecallScene";
import { SplitMirror } from "../components/SplitMirror";
import { StatCounter } from "../components/StatCounter";
import { ThermometerDisplay } from "../components/ThermometerDisplay";
import { TitleCard } from "../components/TitleCard";
import type { SceneBaseProps } from "../components/types";

/**
 * Maps the `component` string in scenes.json to a React component.
 * Props come straight from the JSON, so each component validates by shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENE_COMPONENTS: Record<string, React.FC<any & SceneBaseProps>> = {
  AgentBreach,
  ChannelCard,
  ChecklistReveal,
  ClippingsWall,
  ConsultCard,
  EndCard,
  FailureCard,
  FranceMapDots,
  HospitalNetwork,
  IconLine,
  IndiaContext,
  KineticText,
  NewspaperFrontPage,
  NightTimeline,
  PoisonedThermometer,
  RecallScene,
  SplitMirror,
  StatCounter,
  ThermometerDisplay,
  TitleCard,
};
