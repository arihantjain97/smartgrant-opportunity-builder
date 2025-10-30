import { LeadResponse, MatchingStats, ResponseWindow } from '../state/matching/types';

export const MOCK_LEAD_RESPONSES: LeadResponse[] = [
  {
    id: 'response-1',
    vendorId: 'acme-erp',
    type: 'VENDOR',
    name: 'Acme ERP Solutions',
    logo: '/assets/vendors/acme-erp.svg',
    status: 'ACCEPTED',
    qualificationScore: 92,
    responseTime: 2.5,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    indicativeSubmission: {
      id: 'sub-1',
      title: 'Cloud ERP Implementation Proposal',
      summary: 'Comprehensive ERP solution tailored for F&B sector with PSG grant optimization',
      estimatedCost: [18000, 22000],
      timeline: [3, 4],
      keyFeatures: [
        'Inventory Management System',
        'Financial Reporting Suite',
        'PSG Grant Application Support',
        '24/7 Technical Support'
      ],
      nextSteps: [
        'Detailed requirements analysis',
        'Custom configuration setup',
        'User training program',
        'Go-live support'
      ],
      grantTag: 'PSG',
      tags: ['Budget Fit', 'Fast Deployment'],
      breakdown: [
        { item: 'ERP Software Licence', costBand: [9000, 11000] },
        { item: 'Onboarding & Setup', costBand: [6000, 8000] },
        { item: '6-Month Support', costBand: [3000, 4000] }
      ],
      grantEligible: true,
      support: 'Includes 6-month support and on-site training.',
      addOns: ['Data migration', 'API integration']
    }
  },
  {
    id: 'response-2',
    vendorId: 'nova-cloud',
    type: 'VENDOR',
    name: 'Nova Cloud Technologies',
    logo: '/assets/vendors/nova-cloud.svg',
    status: 'PENDING',
    qualificationScore: 88,
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
  },
  {
    id: 'response-3',
    consultantId: 'carter-advisory',
    type: 'CONSULTANT',
    name: 'Carter Advisory Group',
    logo: '/assets/consultants/carter.svg',
    status: 'ACCEPTED',
    qualificationScore: 95,
    responseTime: 1.2,
    submittedAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000), // 1.2 hours ago
    expiresAt: new Date(Date.now() + 22.8 * 60 * 60 * 1000), // 22.8 hours from now
    indicativeSubmission: {
      id: 'sub-2',
      title: 'EDG Grant Strategy & Implementation Plan',
      summary: 'Expert guidance for EDG grant application with proven track record in F&B sector',
      estimatedCost: [8000, 12000],
      timeline: [2, 3],
      keyFeatures: [
        'Grant Application Strategy',
        'Documentation Preparation',
        'Government Liaison',
        'Project Management Support'
      ],
      nextSteps: [
        'Initial consultation call',
        'Grant application review',
        'Documentation preparation',
        'Submission support'
      ],
      grantTag: 'EDG',
      tags: ['High Success Rate', 'Fast Turnaround'],
      understanding: 'You aim to improve online visibility and streamline campaign reporting across channels.',
      approachPhases: [
        { label: 'Diagnostic', weeks: '1–2 wks', icon: 'Search' },
        { label: 'Implementation', weeks: '4–6 wks', icon: 'Settings' },
        { label: 'Reporting & Claims', weeks: '2 wks', icon: 'FileCheck2' }
      ],
      team: [
        { name: 'Alice Carter', role: 'Lead Consultant' },
        { name: 'Ben Lee', role: 'Senior Analyst' }
      ],
      similarProjects: [
        { sector: 'F&B Retailer', result: '30% faster EDG approval' },
        { sector: 'Services SME', result: 'Improved claims documentation quality' }
      ],
      assumptions: [
        'Assumes vendor stack provides campaign analytics API',
        'Assumes SME can provide last 6 months of campaign data'
      ]
    }
  },
  {
    id: 'response-4',
    vendorId: 'techflow-systems',
    type: 'VENDOR',
    name: 'TechFlow Systems',
    logo: '/assets/vendors/techflow.svg',
    status: 'DECLINED',
    qualificationScore: 77,
    responseTime: 4.5,
    submittedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000), // 4.5 hours ago
    expiresAt: new Date(Date.now() + 19.5 * 60 * 60 * 1000), // 19.5 hours from now
  },
  {
    id: 'response-5',
    consultantId: 'aegis-partners',
    type: 'CONSULTANT',
    name: 'Aegis Partners',
    logo: '/assets/consultants/aegis.svg',
    status: 'PENDING',
    qualificationScore: 82,
    expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
  },
  {
    id: 'response-6',
    vendorId: 'datawise-analytics',
    type: 'VENDOR',
    name: 'DataWise Analytics',
    logo: '/assets/vendors/datawise.svg',
    status: 'EXPIRED',
    qualificationScore: 65,
    expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  }
];

export const MOCK_MATCHING_STATS: MatchingStats = {
  totalSent: 6,
  accepted: 2,
  declined: 1,
  pending: 2,
  expired: 1,
  responseRate: 50, // (accepted + declined) / totalSent * 100
  avgResponseTime: 2.7
};

export const MOCK_RESPONSE_WINDOW: ResponseWindow = {
  closesAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
  hoursRemaining: 20,
  isUrgent: false
};
