export type BubbleRole = "AI" | "SME" | "SYSTEM";

export interface ChatMessage {
  id: string;
  role: BubbleRole;
  text: string;
  actions?: { id: string; label: string }[]; // e.g., clarifier options, Apply Suggestion
}
