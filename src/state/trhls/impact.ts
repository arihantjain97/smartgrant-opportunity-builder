import { TRHLSOption } from "../types";

const toPercentDisplay = (value?: number) =>
  typeof value === "number" && !Number.isNaN(value) ? `${value}%` : "—";

const toNumericDisplay = (value?: number) =>
  typeof value === "number" && !Number.isNaN(value) ? `${value}` : "—";

const toWeeksDisplay = (value?: number) =>
  typeof value === "number" && !Number.isNaN(value) ? `${value} wks` : "—";

export const formatImpact = (opt: TRHLSOption) => [
  { label: "Revenue Lift", value: toPercentDisplay(opt.businessImpact.revenueLiftPct) },
  { label: "New Leads / mo", value: toNumericDisplay(opt.businessImpact.leadDeltaPerMonth) },
  { label: "CAC Change", value: toPercentDisplay(opt.businessImpact.cacChangePct) },
  { label: "Time to First Lead", value: toWeeksDisplay(opt.businessImpact.timeToFirstLeadWeeks) }
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

type ImpactMetricKey = 'revenueLiftPct' | 'leadDeltaPerMonth' | 'cacChangePct' | 'timeToFirstLeadWeeks';

interface MetricConfig {
  key: ImpactMetricKey;
  label: string;
  better: 'higher' | 'lower';
}

const METRIC_CONFIG: MetricConfig[] = [
  { key: 'revenueLiftPct', label: 'Revenue Lift', better: 'higher' },
  { key: 'leadDeltaPerMonth', label: 'New Leads / mo', better: 'higher' },
  { key: 'cacChangePct', label: 'CAC Change', better: 'lower' },
  { key: 'timeToFirstLeadWeeks', label: 'Time to First Lead', better: 'lower' }
];

export interface MetricWinnerInfo {
  label: string;
  bestValue: number | null;
  winnerIds: string[];
}

export type MetricWinnerMap = Record<string, MetricWinnerInfo>;

export const computeImpactWinners = (options: TRHLSOption[]): MetricWinnerMap => {
  if (!Array.isArray(options) || options.length <= 1) {
    return {};
  }

  return METRIC_CONFIG.reduce<MetricWinnerMap>((acc, metric) => {
    const scored = options
      .map(option => {
        const rawValue = option.businessImpact[metric.key];
        return {
          optionId: option.id,
          value: typeof rawValue === "number" && !Number.isNaN(rawValue) ? rawValue : null
        };
      })
      .filter(entry => entry.value !== null) as Array<{ optionId: string; value: number }>;

    if (scored.length === 0) {
      return acc;
    }

    const comparator = metric.better === 'higher'
      ? (a: number, b: number) => b - a
      : (a: number, b: number) => a - b;

    const bestEntry = scored.reduce((best, current) => {
      if (!best) {
        return current;
      }
      return comparator(best.value, current.value) < 0 ? best : current;
    }, scored[0]);

    if (!bestEntry) {
      return acc;
    }

    const bestValue = bestEntry.value;
    const tolerance = 0.0001;
    const winnerIds = scored
      .filter(entry => Math.abs(entry.value - bestValue) <= tolerance)
      .map(entry => entry.optionId);

    if (winnerIds.length === 0) {
      return acc;
    }

    acc[metric.label] = {
      label: metric.label,
      bestValue,
      winnerIds
    };
    return acc;
  }, {});
};

const DEFAULT_TIME_WEIGHT = 20;

export const computeImpactScore = (option: TRHLSOption): number => {
  const impact = option.businessImpact || {};
  const revenue = typeof impact.revenueLiftPct === "number" ? impact.revenueLiftPct : 0;
  const leads = typeof impact.leadDeltaPerMonth === "number" ? impact.leadDeltaPerMonth : 0;
  const cac = typeof impact.cacChangePct === "number" ? -impact.cacChangePct : 0; // lower is better -> invert
  const time = typeof impact.timeToFirstLeadWeeks === "number"
    ? DEFAULT_TIME_WEIGHT - impact.timeToFirstLeadWeeks
    : 0;

  return revenue * 1.5 + leads * 1.2 + cac * 1.1 + time * 0.8;
};

export const findBestOverallSolutionId = (options: TRHLSOption[]): string | null => {
  if (!Array.isArray(options) || options.length === 0) {
    return null;
  }

  const scored = options.map(option => ({
    id: option.id,
    score: computeImpactScore(option)
  }));

  const best = scored.reduce<{ id: string | null; score: number | null }>((acc, current) => {
    if (acc.id === null || (acc.score !== null && current.score > acc.score + 0.0001)) {
      return current;
    }
    if (acc.score !== null && Math.abs(current.score - acc.score) <= 0.0001) {
      // tie -> keep earlier (lower index) by returning existing acc
      return acc;
    }
    if (acc.score === null) {
      return current;
    }
    return acc;
  }, { id: null, score: null });

  return best.id;
};
