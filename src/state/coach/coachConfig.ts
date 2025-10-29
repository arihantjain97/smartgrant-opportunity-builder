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
      { id: "retention", label: "Improve retention" },
      { id: "visibility", label: "Increase online visibility" }
    ],
    OPERATIONS: [
      { id: "inefficiency", label: "Fix process inefficiency" },
      { id: "tools", label: "Replace outdated tools" }
    ],
    CAPABILITY: [
      { id: "hiring", label: "Hiring challenges" },
      { id: "upskilling", label: "Upskill current staff" }
    ],
    SUPPLY: [
      { id: "sourcing", label: "Sourcing issues" },
      { id: "delays", label: "Supplier delays" }
    ]
  },
  suggestionTemplates: {
    GROWTH: {
      coachLine: "Got it — sounds like a marketing visibility and acquisition issue.",
      text: "We're struggling to attract new customers due to low online visibility. We want to improve our reach through digital marketing (SEO/ads) and website improvements.",
      rationale: "This helps us match you to vendors who specialise in lead generation and online presence."
    },
    OPERATIONS: {
      coachLine: "Got it — sounds like an operational efficiency and process improvement issue.",
      text: "We're struggling with inefficient processes that slow down our operations. We want to streamline our workflows and implement better tools to improve productivity.",
      rationale: "This helps us match you to vendors who specialise in process optimization and operational tools."
    },
    CAPABILITY: {
      coachLine: "Got it — sounds like a team capability and skills development issue.",
      text: "We're struggling with team capacity and skills gaps that limit our growth. We want to upskill our current team and improve our hiring processes.",
      rationale: "This helps us match you to vendors who specialise in training and workforce development."
    },
    SUPPLY: {
      coachLine: "Got it — sounds like a supply chain and sourcing issue.",
      text: "We're struggling with supplier reliability and sourcing challenges that affect our production. We want to diversify our supplier base and improve our supply chain management.",
      rationale: "This helps us match you to vendors who specialise in supply chain optimization and sourcing solutions."
    }
  },
  reqDocPreview: {
    problem: "Low visibility and difficulty attracting new customers",
    goal: "Increase online customer acquisition through digital marketing",
    domain: "Growth",
    complexity: "Low",
    industry: "F&B (example)",              // just placeholders for the preview
    budgetBand: [25000, 50000],
    timelineMonths: [3, 6],
    grantPredictions: [
      { grant: "EDG", confidence: 0.78, reason: "Market expansion and capability building" },
      { grant: "PSG", confidence: 0.65, reason: "Adoption of digital marketing tools" }
    ],
    qualificationScore: 82
  }
} as const;
