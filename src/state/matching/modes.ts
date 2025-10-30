export const MATCHING_MODES = {
  CONSULTANT_MANAGED: {
    title: "Consultant-Managed",
    tagline: "Guided & hands-off — we orchestrate for you.",
    badges: ["Expert-Guided", "Higher Grant Success"],
    recommended: true,
    roles: [
      { icon: "UserCheck", label: "You Approve" },
      { icon: "ListChecks", label: "Consultant Shortlists" },
      { icon: "FileCheck2", label: "Grant Docs Ready" }
    ],
    timeline: [
      { step: "Invite Consultants", icon: "UsersRound" },
      { step: "Compare Proposals", icon: "ClipboardCheck" },
      { step: "Select Consultant", icon: "Layers" }
    ],
    metrics: {
      effort: { label: "Your Effort", value: "Low", color: "emerald" },
      alignment: { label: "Grant Fit", value: "85%", bar: 0.85 },
      speed: { label: "First Quote", value: "3–5 days" }
    },
    note: "Best when approvals and documentation matter.",
    outcome: "Best when approvals and documentation matter."
  },
  SME_SELF_MANAGED: {
    title: "SME Self-Managed",
    tagline: "Hands-on & flexible — you drive vendor picks.",
    badges: ["Full Control", "Faster First Quotes"],
    recommended: false,
    roles: [
      { icon: "Hand", label: "You Pick Vendors" },
      { icon: "Send", label: "SmartGrant Dispatches" },
      { icon: "Users", label: "Consultant Optional" }
    ],
    timeline: [
      { step: "Invite Vendors", icon: "Store" },
      { step: "Receive Quotes", icon: "Inbox" },
      { step: "Add Consultant", icon: "Heart" }
    ],
    metrics: {
      effort: { label: "Your Effort", value: "Medium", color: "amber" },
      alignment: { label: "Grant Fit", value: "65%", bar: 0.65 },
      speed: { label: "First Quote", value: "2–4 days" }
    },
    note: "Best when you want speed and control.",
    outcome: "Best when you want speed and control."
  }
} as const;