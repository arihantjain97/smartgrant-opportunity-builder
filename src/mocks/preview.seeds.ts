import { Vendor, Consultant } from '../state/preview/types';

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'acme-erp',
    name: 'Acme ERP',
    logo: '/assets/vendors/acme-erp.svg',
    match: 92,
    grantTag: 'PSG',
    sector: 'F&B',
    product: 'Cloud ERP Suite',
    costRange: [20000, 25000],
    duration: [3, 4],
    reason: 'Your goal = Process Automation (F&B)',
    tags: ['Fast Deployment', 'Budget Fit', 'Local Support'],
    selected: true
  },
  {
    id: 'nova-cloud',
    name: 'Nova Cloud',
    logo: '/assets/vendors/nova-cloud.svg',
    match: 88,
    grantTag: 'PSG',
    sector: 'Retail',
    product: 'Digital Marketing Platform',
    costRange: [15000, 20000],
    duration: [2, 3],
    reason: 'Matches your digital transformation goals',
    tags: ['Quick Setup', 'PSG Approved', '24/7 Support'],
    selected: true
  },
  {
    id: 'techflow-systems',
    name: 'TechFlow Systems',
    logo: '/assets/vendors/techflow.svg',
    match: 77,
    grantTag: 'EDG',
    sector: 'Manufacturing',
    product: 'IoT Integration Suite',
    costRange: [30000, 40000],
    duration: [4, 6],
    reason: 'Advanced automation for manufacturing',
    tags: ['Enterprise Grade', 'EDG Eligible', 'Custom Solutions'],
    selected: false
  },
  {
    id: 'datawise-analytics',
    name: 'DataWise Analytics',
    logo: '/assets/vendors/datawise.svg',
    match: 65,
    grantTag: 'NON_GRANT',
    sector: 'Services',
    product: 'Business Intelligence Platform',
    costRange: [10000, 15000],
    duration: [2, 3],
    reason: 'Data analytics for business insights',
    tags: ['Cost Effective', 'Easy Integration', 'Self-Service'],
    selected: false
  },
  {
    id: 'cloudscale-solutions',
    name: 'CloudScale Solutions',
    logo: '/assets/vendors/cloudscale.svg',
    match: 71,
    grantTag: 'PSG',
    sector: 'F&B',
    product: 'Inventory Management System',
    costRange: [12000, 18000],
    duration: [2, 4],
    reason: 'F&B-specific inventory optimization',
    tags: ['Industry Specific', 'PSG Ready', 'Quick ROI'],
    selected: false
  }
];

export const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: 'carter-advisory',
    name: 'Carter Advisory',
    logo: '/assets/consultants/carter.svg',
    match: 88,
    specialty: 'EDG Specialist',
    experience: '3 yrs F&B projects',
    successRate: 92,
    coreFocus: ['EDG Grant Planning', 'Process Redesign'],
    rating: 4.8,
    avgTurnaround: 14,
    selected: true
  },
  {
    id: 'aegis-partners',
    name: 'Aegis Partners',
    logo: '/assets/consultants/aegis.svg',
    match: 75,
    specialty: 'PSG Expert',
    experience: '5 yrs Retail sector',
    successRate: 87,
    coreFocus: ['Digital Transformation', 'Vendor Selection'],
    rating: 4.6,
    avgTurnaround: 10,
    selected: false
  },
  {
    id: 'strategic-insights',
    name: 'Strategic Insights',
    logo: '/assets/consultants/strategic.svg',
    match: 69,
    specialty: 'General Business',
    experience: '8 yrs cross-industry',
    successRate: 78,
    coreFocus: ['Business Strategy', 'Technology Adoption'],
    rating: 4.3,
    avgTurnaround: 21,
    selected: false
  }
];
