export const COACH_CONFIG = {
  keywordMap: [
    { keys: ["customer", "customers", "sales", "marketing", "leads"], domain: "GROWTH" },
    { keys: ["inventory", "process", "system", "workflow"], domain: "OPERATIONS" },
    { keys: ["staff", "training", "hiring", "skills"], domain: "CAPABILITY" },
    { keys: ["supplier", "production", "machine", "manufacturing"], domain: "SUPPLY" }
  ],
  clarifiers: {
    GROWTH: [
      { id: "acquisition", label: "Find new customers" },
      { id: "retention",  label: "Improve retention" },
      { id: "visibility", label: "Increase online visibility" }
    ],
    // keep others for future
  },
  suggestionTemplates: {
    GROWTH: {
      coachLine: "Got it — focusing on acquisition and marketing visibility.",
      text: "We're struggling to attract new customers due to low online visibility. We want to improve our reach through digital marketing (SEO/ads) and website improvements.",
      rationale: "This helps us match you to vendors who specialise in lead generation and online presence."
    }
  },
  // Category chips to show under chat (auto from domain + clarifier)
  categoryMap: {
    GROWTH: ["Growth", "Marketing", "Digital Transformation"]
  },
  reqDocPreview: {
    problem: "Low visibility and difficulty attracting new customers",
    goal: "Increase online customer acquisition through digital marketing",
    domain: "Growth",
    complexity: "Low",
    industry: "F&B (example)",
    budgetBand: [25000, 50000],
    timelineMonths: [3, 6],
    grantPredictions: [
      { grant: "EDG", confidence: 0.78, reason: "Market expansion and capability building" },
      { grant: "PSG", confidence: 0.65, reason: "Adoption of digital marketing tools" }
    ],
    qualificationScore: 82
  }
} as const;
