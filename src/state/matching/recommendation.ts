import { ReqDoc } from '../types';

export const getSmartRecommendation = (reqDoc: ReqDoc | null) => {
  if (!reqDoc) {
    return {
      recommended: 'CONSULTANT_MANAGED' as const,
      reason: 'Default recommendation for guided experience.',
      bannerText: 'Recommended for your timeline and grant paperwork needs — structured guidance, higher approval confidence.',
      tooltipText: 'Grant submissions often need scoped plans, evidence and checklists. Consultants shorten that cycle.'
    };
  }

  const { grantRelevant, timelineMonths, complexity } = reqDoc;
  const timeline = timelineMonths[0]; // Use minimum timeline

  // Heuristics
  const isLongTimeline = timeline >= 3;
  const isHighComplexity = complexity === 'HIGH';
  const hasGrantRequirements = grantRelevant === true;

  if (hasGrantRequirements && (isLongTimeline || isHighComplexity)) {
    return {
      recommended: 'CONSULTANT_MANAGED' as const,
      reason: 'Grant requirements with longer timeline or high complexity benefit from consultant guidance.',
      bannerText: 'Recommended for your timeline and grant paperwork needs — structured guidance, higher approval confidence.',
      tooltipText: 'Grant submissions often need scoped plans, evidence and checklists. Consultants shorten that cycle.'
    };
  }

  if (!hasGrantRequirements || timeline <= 2) {
    return {
      recommended: 'SME_SELF_MANAGED' as const,
      reason: 'Short timeline or no grant requirements favor direct vendor approach.',
      bannerText: 'Recommended for your short timeline — get vendor quotes faster with full control.',
      tooltipText: 'When grants are optional or light, direct vendor shortlisting gets you quotes quicker.'
    };
  }

  // Default fallback
  return {
    recommended: 'CONSULTANT_MANAGED' as const,
    reason: 'Default recommendation for guided experience.',
    bannerText: 'Recommended for your timeline and grant paperwork needs — structured guidance, higher approval confidence.',
    tooltipText: 'Grant submissions often need scoped plans, evidence and checklists. Consultants shorten that cycle.'
  };
};
