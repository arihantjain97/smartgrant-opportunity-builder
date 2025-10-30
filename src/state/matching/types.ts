export interface LeadResponse {
  id: string;
  vendorId?: string;
  consultantId?: string;
  type: 'VENDOR' | 'CONSULTANT';
  name: string;
  logo: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  qualificationScore: number;
  responseTime?: number; // hours
  submittedAt?: Date;
  expiresAt: Date;
  indicativeSubmission?: {
    id: string;
    title: string;
    summary: string;
    estimatedCost: [number, number];
    timeline: [number, number];
    keyFeatures: string[];
    nextSteps: string[];
    // New optional, structured fields for the 1-Page Confidence Snapshot
    grantTag?: 'PSG' | 'EDG' | 'NON_GRANT';
    tags?: string[]; // e.g., High Success Rate, Fast Turnaround
    understanding?: string; // consultant: paraphrase of SME goal
    approachPhases?: { label: string; weeks: string; icon?: string }[]; // consultant phases
    team?: { name: string; role: string; avatarUrl?: string }[]; // consultant team
    similarProjects?: { sector: string; result: string }[]; // consultant social proof
    assumptions?: string[]; // dependencies/assumptions list
    breakdown?: { item: string; costBand?: [number, number] }[]; // vendor items
    grantEligible?: boolean; // vendor grant applicability
    support?: string; // vendor support/warranty
    addOns?: string[]; // vendor optional add-ons
  };
}

export interface MatchingStats {
  totalSent: number;
  accepted: number;
  declined: number;
  pending: number;
  expired: number;
  responseRate: number;
  avgResponseTime: number;
}

export interface ResponseWindow {
  closesAt: Date;
  hoursRemaining: number;
  isUrgent: boolean;
}
