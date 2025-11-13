export type Persona = 'SME' | 'VENDOR' | 'CONSULTANT';

export interface Company {
  id: string;
  name: string;
  jurisdiction: 'SG';
  industry: string;
  revenueBand: string;
  headcountBand: string;
}

export interface User {
  id: string;
  name: string;
  persona: Persona;
  companyId: string;
  credits: number;
}

export type VisibilityLevel = 'PRIVATE' | 'LIMITED' | 'PUBLIC';
export type MatchingMode = 'SME_SELF_MANAGED' | 'CONSULTANT_MANAGED';

export interface TRHLSOption {
  id: string;
  name: string;                 // e.g., "Cloud ERP Implementation"
  grantTag: 'PSG' | 'EDG' | 'NON_GRANT';
  whyFit: string;               // explainable text
  personaTagline?: string;      // optional short persona cue
  estCostBand: [number, number];
  estDurationMonths: [number, number];
  businessImpact: { 
    revenueLiftPct?: number; 
    costSavePct?: number; 
    opsSpeedupPct?: number;
    leadDeltaPerMonth?: number;
    cacChangePct?: number;
    timeToFirstLeadWeeks?: number;
  };
  grantWhy?: string;            // "Pre-approved under PSG …"
  rationaleSignals?: string[];  // AI reasoning signals
}

export interface ReqDoc {
  id: string;
  companyId: string;
  problem: string;
  goal: string;
  domain: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  budgetBand: [number, number];
  timelineMonths: [number, number];
  grantRelevant: boolean;
  trhlsSelectedIds: string[];   // chosen solution paths (1–2)
  visibility: VisibilityLevel;
  matchingMode?: MatchingMode;
  qualificationScore: number;   // 0–100
  status: 'NEW' | 'SHORTLISTED' | 'PREVIEWED' | 'ACCEPTED' | 'INDICATIVE' | 'QNA' | 'DECISIONED' | 'AWARDED';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  reqDocId: string;
  audience: 'VENDOR' | 'CONSULTANT';
  maskedPreview: { 
    summary: string; 
    budgetBand: [number, number]; 
    urgency: 'LOW'|'MEDIUM'|'HIGH'; 
    grantTag?: 'PSG'|'EDG'|'NON_GRANT' 
  };
  priceCredits: number;
  qualificationScore: number;
  expiresAt: string;
  acceptedByUserId?: string; // when accepted → unmask
  createdAt: string;
}

export interface Quotation { 
  id: string; 
  vendorUserId: string; 
  reqDocId: string; 
  priceBand: [number, number]; 
  summary: string; 
  version: number;
  createdAt: string;
}

export interface Proposal { 
  id: string; 
  consultantUserId: string; 
  reqDocId: string; 
  feeBand: [number, number]; 
  approach: string; 
  timeline: [number, number]; 
  version: number;
  createdAt: string;
}

export interface Match { 
  id: string; 
  reqDocId: string; 
  vendorUserIds: string[]; 
  consultantUserIds: string[];
  createdAt: string;
}

export interface CreditWallet { 
  userId: string; 
  balance: number;
}

// Store state interface
export interface AppState {
  // Data arrays
  companies: Company[];
  users: User[];
  reqDocs: ReqDoc[];
  trhls: TRHLSOption[];
  leads: Lead[];
  proposals: Proposal[];
  quotations: Quotation[];
  matches: Match[];
  wallets: CreditWallet[];
  
  // UI state
  currentPersona: Persona;
  currentReqDocId?: string;
  
  // Actions
  setCurrentPersona: (persona: Persona) => void;
  createReqDoc: (reqDoc: Omit<ReqDoc, 'id' | 'createdAt' | 'updatedAt'>) => string;
  selectTRHLS: (reqDocId: string, trhlsIds: string[]) => void;
  setVisibility: (reqDocId: string, visibility: VisibilityLevel) => void;
  setMatchingMode: (reqDocId: string, mode: MatchingMode) => void;
  seedMatchingForReqDoc: (reqDocId: string) => void;
  acceptLead: (leadId: string, userId: string) => void;
  submitProposal: (proposal: Omit<Proposal, 'id' | 'createdAt'>) => string;
  submitQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => string;
  finalizeIndicatives: (reqDocId: string) => void;
  awardVendor: (reqDocId: string, vendorUserId: string) => void;
  awardConsultant: (reqDocId: string, consultantUserId: string) => void;
}
