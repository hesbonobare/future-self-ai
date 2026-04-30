export interface TimelineEvent {
  time: string;
  event: string;
  impact: string;
}

export interface TurningPoint {
  event: string;
  effect: string;
}

export interface EmotionalPhase {
  phase: string;
  feeling: string;
}

export type ScenarioType = "best_case" | "most_likely" | "worst_case";

export interface Scenario {
  type: ScenarioType;
  title: string;
  probability: number;
  summary: string;
  timeline: TimelineEvent[];
  turning_points: TurningPoint[];
  risks: string[];
  emotional_trajectory: EmotionalPhase[];
  financial_trajectory: string;
}

export interface SimulationResult {
  decision: string;
  scenarios: Scenario[];
}

export interface SimulationRequest {
  decision: string;
  age: number;
  career: string;
  financial_status: string;
  risk_level: string;
  time_horizon: string;
  isVariation?: boolean;
}
