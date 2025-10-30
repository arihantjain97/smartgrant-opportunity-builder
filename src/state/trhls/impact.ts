import { TRHLSOption } from "../types";

export const formatImpact = (opt: TRHLSOption) => [
  { label: "Revenue Lift", value: `${opt.businessImpact.revenueLiftPct}%` },
  { label: "New Leads / mo", value: `${opt.businessImpact.leadDeltaPerMonth}` },
  { label: "CAC Change", value: `${opt.businessImpact.cacChangePct}%` },
  { label: "Time to First Lead", value: `${opt.businessImpact.timeToFirstLeadWeeks} wks` }
];

export const getGrantBadgeColor = (grantTag: string) => {
  switch (grantTag) {
    case "PSG":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "EDG":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "NON_GRANT":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getImpactColor = (value: number, type: 'revenue' | 'leads' | 'cac' | 'time') => {
  if (type === 'cac') {
    return value < 0 ? 'text-emerald-600' : 'text-red-600';
  }
  if (type === 'time') {
    return value <= 3 ? 'text-emerald-600' : value <= 6 ? 'text-amber-600' : 'text-slate-600';
  }
  return value >= 10 ? 'text-emerald-600' : value >= 5 ? 'text-amber-600' : 'text-slate-600';
};
