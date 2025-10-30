import { ReqDoc } from '../types';

export const getModeHint = (reqDoc: ReqDoc | null) => {
  if (!reqDoc?.trhlsSelectedIds) {
    return { 
      recommended: 'CONSULTANT_MANAGED' as const, 
      reason: 'Default recommendation for guided experience.' 
    };
  }
  
  const hasEDG = reqDoc.trhlsSelectedIds.some(id => id.includes('edg'));
  return hasEDG
    ? { 
        recommended: 'CONSULTANT_MANAGED' as const, 
        reason: 'EDG items benefit from consultant-led planning.' 
      }
    : { 
        recommended: 'SME_SELF_MANAGED' as const, 
        reason: 'Vendor-first flow suits tool adoption (PSG / non-grant).' 
      };
};

export const MODE_COPY = {
  CONSULTANT_MANAGED: {
    value: 'Expert-guided. You approve decisions; we orchestrate.',
    youHandle: ['Approvals', 'Final selection', 'Payments'],
    weHandle: ['Vendor shortlist', 'Grant paperwork outline', 'Timeline planning'],
    badges: ['Fastest to Start', 'Higher Grant Fit', 'Lower SME Effort'],
    effort: 'Low',
    grantAlignment: 0.85,
    timeToFirstQuote: '≈ 3–5 days',
    footnote: 'Consultant fees are shown transparently before award.'
  },
  SME_SELF_MANAGED: {
    value: 'You drive shortlist; we keep it structured.',
    youHandle: ['Vendor picks', 'Brief consolidation', 'Basic comparisons'],
    weHandle: ['Matching engine', 'Invitation dispatch', 'Status tracking'],
    badges: ['Full Control', 'Direct Vendor Contact'],
    effort: 'Medium',
    grantAlignment: 0.65,
    timeToFirstQuote: '≈ 2–4 days',
    footnote: 'You can invite a consultant later if grants are involved.'
  }
} as const;
