import { Company, User, TRHLSOption, CreditWallet } from '../state/types';

export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Innovate Pte. Ltd.',
    jurisdiction: 'SG',
    industry: 'Food & Beverage',
    revenueBand: 'S$1M - S$5M',
    headcountBand: '10-50 employees'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-sme-1',
    name: 'Innovate Pte. Ltd.',
    persona: 'SME',
    companyId: 'company-1',
    credits: 12
  },
  {
    id: 'user-vendor-1',
    name: 'Acme ERP',
    persona: 'VENDOR',
    companyId: 'company-1', // Same company for simplicity
    credits: 5
  },
  {
    id: 'user-vendor-2',
    name: 'Nova Cloud',
    persona: 'VENDOR',
    companyId: 'company-1',
    credits: 8
  },
  {
    id: 'user-consultant-1',
    name: 'Carter Advisory',
    persona: 'CONSULTANT',
    companyId: 'company-1',
    credits: 12
  },
  {
    id: 'user-consultant-2',
    name: 'Aegis Partners',
    persona: 'CONSULTANT',
    companyId: 'company-1',
    credits: 10
  }
];

export const mockTRHLS: TRHLSOption[] = [
  {
    id: 'trhls-1',
    name: 'Cloud ERP Implementation',
    grantTag: 'PSG',
    whyFit: 'Matches your F&B industry & budget for pre-approved systems.',
    estCostBand: [20000, 25000],
    estDurationMonths: [3, 4],
    businessImpact: {
      revenueLiftPct: 15,
      costSavePct: 25,
      opsSpeedupPct: 40
    },
    grantWhy: 'Pre-approved under PSG for productivity solutions in F&B sector.'
  },
  {
    id: 'trhls-2',
    name: 'Targeted Digital Marketing Campaign',
    grantTag: 'EDG',
    whyFit: 'Ideal for your goal to expand into Malaysia (Market Access).',
    estCostBand: [40000, 50000],
    estDurationMonths: [6, 8],
    businessImpact: {
      revenueLiftPct: 35,
      costSavePct: 10,
      opsSpeedupPct: 20
    },
    grantWhy: 'Eligible for EDG support for overseas market expansion initiatives.'
  },
  {
    id: 'trhls-3',
    name: 'Custom Website Development',
    grantTag: 'NON_GRANT',
    whyFit: 'Full custom control, but not aligned with grant support.',
    estCostBand: [15000, 20000],
    estDurationMonths: [2, 3],
    businessImpact: {
      revenueLiftPct: 20,
      costSavePct: 5,
      opsSpeedupPct: 15
    },
    grantWhy: 'Custom development without pre-approved templates typically does not qualify for PSG.'
  }
];

export const mockWallets: CreditWallet[] = [
  { userId: 'user-sme-1', balance: 12 },
  { userId: 'user-vendor-1', balance: 5 },
  { userId: 'user-vendor-2', balance: 8 },
  { userId: 'user-consultant-1', balance: 12 },
  { userId: 'user-consultant-2', balance: 10 }
];
