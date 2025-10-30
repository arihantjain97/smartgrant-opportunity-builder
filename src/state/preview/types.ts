export interface Vendor {
  id: string;
  name: string;
  logo: string;
  match: number;
  grantTag: 'PSG' | 'EDG' | 'NON_GRANT';
  sector: string;
  product: string;
  costRange: [number, number];
  duration: [number, number];
  reason: string;
  tags: string[];
  selected: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  logo: string;
  match: number;
  specialty: string;
  experience: string;
  successRate: number;
  coreFocus: string[];
  rating: number;
  avgTurnaround: number;
  selected: boolean;
}

export interface PreviewState {
  vendors: Vendor[];
  consultants: Consultant[];
  visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC';
  totalSelected: number;
  vendorCount: number;
  consultantCount: number;
}
