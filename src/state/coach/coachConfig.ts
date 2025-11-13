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
      coachLine: "Absolutely understood — let's zero in on boosting your brand's online presence and simplifying your campaign reporting.",
      text: "\"We're struggling to attract new customers due to low online visibility. We want to improve our reach through digital marketing (SEO/ads) and website improvements.\"",
      rationale: "This approach enables a holistic match to marketing partners who not only drive lead generation, but also take pride in transparent, data-driven campaign outcomes."
    }
  },
  // Category chips to show under chat (auto from domain + clarifier)
  categoryMap: {
    GROWTH: ["Growth", "Marketing", "Digital Transformation"]
  },
  reqDocPreview: {
    problem: "Standing out online is tough, and it can be a real challenge to see which campaigns are actually making a difference. It's frustrating to pour effort (and budget) into digital channels and not get a simple, unified view of what's working.",
    goal: "Make your brand discoverable, boost your digital growth, and put streamlined, all-in-one campaign tracking in your hands — so you always know where your efforts are paying off.",
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
