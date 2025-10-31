import { LeadResponse, MatchingStats, ResponseWindow } from '../state/matching/types';

export const MOCK_LEAD_RESPONSES: LeadResponse[] = [
  { // 1. Acme ERP (ACCEPTED)
    id: 'response-1', vendorId: 'acme-erp', type: 'VENDOR', name: 'Acme ERP', logo: '/assets/vendors/acme-erp.svg', status: 'ACCEPTED', qualificationScore: 92, responseTime: 2.5, submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    indicativeSubmission: { id: 'sub-1', title: 'Cloud ERP Proposal', summary: 'Cloud ERP for F&B. PSG grant ready.', estimatedCost: [20000, 25000], timeline: [3, 4], keyFeatures: ['PSG Pre-approved','Inventory Mgmt','24/7 Support','Training'], nextSteps: ['Requirements','Configuration','UAT','Go-live'], grantTag: 'PSG', tags: ['Fast Deployment','Budget Fit'], breakdown: [{item:'Licence',costBand:[10000,12000]},{item:'Setup',costBand:[7000,8000]},{item:'Support',costBand:[3000,4000]}], grantEligible: true, support: '6-month warranty', addOns: ['API','Custom Reports'] }
  },
  { // 2. Nova Cloud (ACCEPTED)
    id: 'response-2', vendorId: 'nova-cloud', type: 'VENDOR', name: 'Nova Cloud', logo: '/assets/vendors/nova-cloud.svg', status: 'ACCEPTED', qualificationScore: 88, responseTime: 1.4, submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
    indicativeSubmission: { id: 'sub-2', title: 'Digital Marketing Platform', summary: 'Full-funnel marketing, analytics and PSG grant.', estimatedCost: [15000, 20000], timeline: [2, 3], keyFeatures: ['Quick Setup','Analytics','PSG Approved','24/7 Support'], nextSteps: ['Kickoff','Sandbox','Rollout'], grantTag: 'PSG', tags: ['Quick Start','Cloud'], breakdown: [{item:'Platform',costBand:[9000,13000]},{item:'Service',costBand:[6000,7000]}], grantEligible: true, support:'1-year support', addOns: ['Mobile Access'] }
  },
  { // 3. TechFlow Systems (PENDING)
    id: 'response-3', vendorId: 'techflow-systems', type: 'VENDOR', name: 'TechFlow Systems', logo: '/assets/vendors/techflow.svg', status: 'PENDING', qualificationScore: 77, expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000) 
  },
  { // 4. DataWise Analytics (Optional - can be EXPIRED)
    id: 'response-4', vendorId: 'datawise-analytics', type: 'VENDOR', name: 'DataWise Analytics', logo: '/assets/vendors/datawise.svg', status: 'EXPIRED', qualificationScore: 65, expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  { // 5. CloudScale Solutions (Optional)
    id: 'response-5', vendorId: 'cloudscale-solutions', type: 'VENDOR', name: 'CloudScale Solutions', logo: '/assets/vendors/cloudscale.svg', status: 'EXPIRED', qualificationScore: 71, expiresAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  // Consultants:
  { // 6. Carter Advisory (ACCEPTED)
    id: 'response-6', consultantId: 'carter-advisory', type: 'CONSULTANT', name: 'Carter Advisory', logo: '/assets/consultants/carter.svg', status: 'ACCEPTED', qualificationScore: 95, responseTime: 1.2, submittedAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000), expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    indicativeSubmission: { id: 'sub-3', title: 'EDG Grant Plan', summary:'Grant application & strategy for SME digital transformation.', estimatedCost:[8000,12000], timeline:[2,3], keyFeatures:['EDG Ready','Consultant Team','Compliance Support','Claims Handling'], nextSteps:['Consultation','Doc Review','Submission'], grantTag:'EDG', tags:['High Success Rate'], understanding:'Increase online customers through digital strategy.', approachPhases:[{label:'Strategy',weeks:'1-2 wks'},{label:'Implementation',weeks:'4-6 wks'},{label:'Claims',weeks:'2 wks'}], team:[{name:'Alice Carter',role:'Lead'},{name:'Ben Lee',role:'Co-consultant'}], assumptions:['SME provides recent P&L'], breakdown:[], support:'Advisory till grant award.'}
  },
  { // 7. Strategic Insights (ACCEPTED)
    id: 'response-7', consultantId: 'strategic-insights', type: 'CONSULTANT', name: 'Strategic Insights', logo: '/assets/consultants/strategic.svg', status: 'ACCEPTED', qualificationScore: 88, responseTime: 2.0, submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000),
    indicativeSubmission: { id:'sub-4', title:'Advisory Proposal', summary:'Process redesign and grant planning.', estimatedCost:[9000,13000], timeline:[2,4], keyFeatures:['Grant Specialist','Tech Advisory','Quick Start'], nextSteps:['Strategy Call','Planning','Dok Prep'], grantTag:'EDG', tags:['Process Expert'], understanding:'Increase digital leads via SEO.', approachPhases:[{label:'Plan',weeks:'1 wk'},{label:'Implement',weeks:'2-3 wks'}], team:[{name:'Sara Tan',role:'Lead'},{name:'Ken Wong',role:'Analyst'}], assumptions:['Access to prior grant docs'], breakdown:[], support:'Full submission support.'}
  },
  { // 8. Aegis Partners (PENDING)
    id: 'response-8', consultantId: 'aegis-partners', type: 'CONSULTANT', name: 'Aegis Partners', logo: '/assets/consultants/aegis.svg', status: 'PENDING', qualificationScore: 82, expiresAt: new Date(Date.now() + 17 * 60 * 60 * 1000) 
  },
  { // 9. InsightWorks Consulting (New, PENDING)
    id: 'response-9', consultantId: 'insightworks-consulting', type: 'CONSULTANT', name: 'InsightWorks Consulting', logo: '/assets/consultants/insightworks.svg', status: 'PENDING', qualificationScore: 80, expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000) 
  },
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
