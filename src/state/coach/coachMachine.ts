export type CoachStage =
  | "INPUT"          // user sees textbox + hint of AI Coach
  | "DIAGNOSED"      // coach shows clarifying chips
  | "ELABORATED"     // user clicked a chip; coach ready with suggestion
  | "STRUCTURED"     // suggestion card + Apply button
  | "APPLIED"        // refined text applied; show tags + clarity meter
  | "PREVIEW_READY"; // show ReqDoc v1 preview + enable Continue

export interface CoachState {
  stage: CoachStage;
  input: string;
  domain?: "GROWTH" | "OPERATIONS" | "CAPABILITY" | "SUPPLY";
  clarifierId?: string;
  refinedText?: string;
}

export const initialCoachState: CoachState = {
  stage: "INPUT",
  input: "I want to increase customers for my business"
};

export const coachActions = {
  diagnose(state: CoachState, domain: CoachState["domain"]): CoachState {
    return { ...state, stage: "DIAGNOSED", domain };
  },
  chooseClarifier(state: CoachState, clarifierId: string): CoachState {
    return { ...state, stage: "ELABORATED", clarifierId };
  },
  showSuggestion(state: CoachState, refinedText: string): CoachState {
    return { ...state, stage: "STRUCTURED", refinedText };
  },
  applySuggestion(state: CoachState): CoachState {
    return { ...state, stage: "APPLIED", input: state.refinedText ?? state.input };
  },
  showPreview(state: CoachState): CoachState {
    return { ...state, stage: "PREVIEW_READY" };
  }
};
