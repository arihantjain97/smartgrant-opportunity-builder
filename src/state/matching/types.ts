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
