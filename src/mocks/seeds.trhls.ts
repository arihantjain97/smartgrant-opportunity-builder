import { TRHLSOption } from "../state/types";

export const TRHLS_FOR_MARKETING_VISIBILITY: TRHLSOption[] = [
  {
    id: "psg-digital-ads-suite",
    name: "Digital Ads & CRM Launchpad",
    grantTag: "PSG",
    whyFit: "The perfect launchpad for SMEs wanting not just more leads, but a hands-off, unified approach across digital channels. We’ll bring advanced yet easy-to-use tools for ads, CRM, and analytics—so you focus on growth while we handle the campaign science.",
    estCostBand: [20000, 25000],
    estDurationMonths: [3, 4],
    businessImpact: {
      revenueLiftPct: 10,
      leadDeltaPerMonth: 80,
      cacChangePct: -12,
      timeToFirstLeadWeeks: 3
    },
    grantWhy: "PSG supports adoption of pre-approved digital marketing and CRM systems for productivity and lead generation, and we help you maximize these funds at every step.",
    rationaleSignals: ["Industry fit (F&B/Retail)", "Budget within PSG range", "Proven vendors available"]
  },
  {
    id: "edg-market-expansion-sea",
    name: "SEA Market Expansion Blueprint",
    grantTag: "EDG",
    whyFit: "Supports overseas marketing strategy for regional customer growth.",
    estCostBand: [40000, 60000],
    estDurationMonths: [6, 8],
    businessImpact: {
      revenueLiftPct: 15,
      leadDeltaPerMonth: 100,
      cacChangePct: -8,
      timeToFirstLeadWeeks: 6
    },
    grantWhy: "EDG funds market access projects that build new customer pipelines across SEA.",
    rationaleSignals: ["Export ambition detected", "Medium complexity project", "Consultant-led implementation"]
  },
  {
    id: "edg-brand-refresh",
    name: "Brand Revamp & Content Campaign",
    grantTag: "EDG",
    whyFit: "Improves brand positioning, storytelling and content funnel conversion.",
    estCostBand: [30000, 45000],
    estDurationMonths: [4, 6],
    businessImpact: {
      revenueLiftPct: 9,
      leadDeltaPerMonth: 50,
      cacChangePct: -10,
      timeToFirstLeadWeeks: 5
    },
    grantWhy: "EDG supports branding and content capability building projects tied to growth outcomes.",
    rationaleSignals: ["Creative capability gap", "Good fit for content-driven industries", "Consultant-guided project"]
  },
  {
    id: "ads-sprint-nongrant",
    name: "High Velocity Ads Sprint",
    grantTag: "NON_GRANT",
    whyFit: "Quick-start campaign to validate lead generation before committing to a full-scale rollout.",
    estCostBand: [12000, 18000],
    estDurationMonths: [1, 2],
    businessImpact: {
      revenueLiftPct: 5,
      leadDeltaPerMonth: 70,
      cacChangePct: -5,
      timeToFirstLeadWeeks: 2
    },
    rationaleSignals: ["Fast deployment", "Low commitment", "Useful for ROI benchmarking"]
  },
  {
    id: "cro-web-refresh-nongrant",
    name: "CRO + Website UX Refresh",
    grantTag: "NON_GRANT",
    whyFit: "Revamps your website UX and analytics to improve conversion rate.",
    estCostBand: [15000, 20000],
    estDurationMonths: [2, 3],
    businessImpact: {
      revenueLiftPct: 6,
      leadDeltaPerMonth: 30,
      cacChangePct: -10,
      timeToFirstLeadWeeks: 4
    },
    rationaleSignals: ["Improves conversion path", "Fast measurable impact", "Pairs with grant-funded MarTech"]
  }
];
