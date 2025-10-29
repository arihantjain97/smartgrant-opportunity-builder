import { ChatMessage } from "./types";

export type CoachStage =
  | "INPUT"          // textbox only
  | "CHAT_INIT"      // after Diagnose: AI greets + asks clarifier
  | "CLARIFIER_SHOWN"
  | "SUGGESTION_SHOWN"
  | "APPLIED"        // refined text applied; categories/clarity bump
  | "PREVIEW_READY"; // enable Continue → TRHLS

export interface CoachState {
  stage: CoachStage;
  input: string;
  domain?: "GROWTH" | "OPERATIONS" | "CAPABILITY" | "SUPPLY";
  clarifierId?: string;
  refinedText?: string;
  messages: ChatMessage[];
  categories: string[];
  clarity: number; // 0–100
}

export const initialCoachState: CoachState = {
  stage: "INPUT",
  input: "I want to increase customers for my business",
  messages: [],
  categories: [],
  clarity: 38 // low clarity for vague text
};

// naive clarity calculator for demo:
export function computeClarity({ refined }: { refined: boolean }): number {
  return refined ? 82 : 38;
}

export const coachActions = {
  diagnose(state: CoachState, domain: CoachState["domain"]): CoachState {
    const first: ChatMessage = {
      id: "m1",
      role: "AI",
      text: "It sounds like a marketing or sales growth issue. Which best fits?",
      actions: [
        { id: "acquisition", label: "Find new customers" },
        { id: "retention",  label: "Improve retention" },
        { id: "visibility", label: "Increase online visibility" }
      ]
    };
    return {
      ...state,
      stage: "CHAT_INIT",
      domain,
      messages: [first],
      categories: domain ? ["Growth"] : [],
      clarity: computeClarity({ refined: false })
    };
  },

  chooseClarifier(state: CoachState, clarifierId: string, label: string): CoachState {
    const userMsg: ChatMessage = { id: "m2", role: "SME", text: label };
    const ack: ChatMessage = {
      id: "m3",
      role: "AI",
      text: `Thanks — focusing on ${label.toLowerCase()}.`
    };
    const next: ChatMessage = {
      id: "m4",
      role: "AI",
      text: "Suggested improvement:\n\"We're struggling to attract new customers due to low online visibility. We want to improve our reach through digital marketing (SEO/ads) and website improvements.\"",
      actions: [
        { id: "apply", label: "Apply Suggestion" },
        { id: "back",  label: "Back to Clarifiers" }
      ]
    };
    return {
      ...state,
      stage: "SUGGESTION_SHOWN",
      clarifierId,
      messages: [...state.messages, userMsg, ack, next]
    };
  },

  backToClarifiers(state: CoachState): CoachState {
    // regenerate the first clarifier message
    const back: ChatMessage = {
      id: "m_back",
      role: "AI",
      text: "No problem. Which best fits?",
      actions: [
        { id: "acquisition", label: "Find new customers" },
        { id: "retention",  label: "Improve retention" },
        { id: "visibility", label: "Increase online visibility" }
      ]
    };
    return { ...state, stage: "CLARIFIER_SHOWN", messages: [...state.messages, back] };
  },

  applySuggestion(state: CoachState, refinedText: string, categories: string[]): CoachState {
    const applied: ChatMessage = {
      id: "m_applied",
      role: "SYSTEM",
      text: "Applied suggested improvement to your goal."
    };
    const newClarity = computeClarity({ refined: true });
    return {
      ...state,
      stage: "APPLIED",
      refinedText,
      input: refinedText,         // replace textbox content
      messages: [...state.messages, applied],
      categories,
      clarity: newClarity
    };
  },

  showPreview(state: CoachState): CoachState {
    const msg: ChatMessage = {
      id: "m_preview",
      role: "AI",
      text: "Great — I've normalised your input. You can proceed to recommendations next."
    };
    return { ...state, stage: "PREVIEW_READY", messages: [...state.messages, msg] };
  }
};
