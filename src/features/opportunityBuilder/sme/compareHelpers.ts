import { TRHLSOption } from "../../../state/types";

const SENTENCE_END_REGEX = /[.?!]/;

export const derivePersonaLine = (solution: TRHLSOption): string | null => {
  const direct = solution.personaTagline?.trim();
  if (direct) {
    return direct;
  }

  const whyFit = solution.whyFit?.trim();
  if (!whyFit) {
    return null;
  }

  const firstSentence = whyFit.split(SENTENCE_END_REGEX)[0]?.trim() ?? "";
  if (!firstSentence) {
    return null;
  }

  const maxLength = 80;
  const lowerCaseFirst = (text: string) => (text ? text.charAt(0).toLowerCase() + text.slice(1) : "");
  const upperCaseFirst = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "");
  const finalize = (text: string) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) {
      return null;
    }
    return clean.length > maxLength ? `${clean.slice(0, maxLength - 3).trim()}...` : clean;
  };

  const withoutPeriod = firstSentence.replace(/\.$/, "").trim();

  const smeIndex = withoutPeriod.toLowerCase().indexOf("sme");
  if (smeIndex >= 0) {
    const snippet = upperCaseFirst(withoutPeriod.slice(smeIndex));
    const persona = finalize(`Best for ${snippet}`);
    if (persona) {
      return persona;
    }
  }

  const buildPersona = (prefix: string, rest: string) => finalize(`${prefix} ${lowerCaseFirst(rest)}`);

  if (/^Supports\s+/i.test(withoutPeriod)) {
    const rest = withoutPeriod.replace(/^Supports\s+/i, "").trim();
    const persona = buildPersona("Best for SMEs pursuing", rest);
    if (persona) {
      return persona;
    }
  }

  if (/^Improves\s+/i.test(withoutPeriod)) {
    const rest = withoutPeriod.replace(/^Improves\s+/i, "").trim();
    const persona = buildPersona("Best for teams improving", rest);
    if (persona) {
      return persona;
    }
  }

  if (/^Quick[-\s]?starts?\s+/i.test(withoutPeriod)) {
    const rest = withoutPeriod.replace(/^Quick[-\s]?starts?\s+/i, "").trim();
    const persona = buildPersona("Best for teams needing a quick start on", rest);
    if (persona) {
      return persona;
    }
  }

  if (/^Revamps\s+/i.test(withoutPeriod)) {
    const rest = withoutPeriod.replace(/^Revamps\s+/i, "").trim();
    const persona = buildPersona("Best for brands looking to revamp", rest);
    if (persona) {
      return persona;
    }
  }

  if (/^(The|This|An|A)\s+/i.test(withoutPeriod)) {
    const rest = withoutPeriod.replace(/^(The|This|An|A)\s+/i, "").trim();
    if (rest) {
      const persona = finalize(`Best for ${lowerCaseFirst(rest)}`);
      if (persona) {
        return persona;
      }
    }
  }

  const words = withoutPeriod.split(/\s+/);
  const shortened =
    words.length > 12 ? `${words.slice(0, 12).join(" ")}...` : withoutPeriod;

  return finalize(shortened);
};

const GRANT_BULLETS: Record<TRHLSOption["grantTag"], string> = {
  PSG: "You want to tap PSG funding for digital tools",
  EDG: "You want EDG support for transformation",
  NON_GRANT: "You prefer to move fast without grant dependencies"
};

const pushIfUnique = (arr: string[], value: string) => {
  if (!arr.includes(value)) {
    arr.push(value);
  }
};

export const buildSolutionSummary = (
  solution: TRHLSOption,
  winningMetrics: Set<string>,
  isOverallFit: boolean
): string[] => {
  const bullets: string[] = [];

  pushIfUnique(bullets, GRANT_BULLETS[solution.grantTag]);

  if (winningMetrics.has("Revenue Lift") || winningMetrics.has("New Leads / mo")) {
    pushIfUnique(bullets, "You're focused on driving topline and pipeline growth");
  }

  if (winningMetrics.has("CAC Change")) {
    pushIfUnique(bullets, "You need to improve acquisition efficiency and lower CAC");
  }

  if (winningMetrics.has("Time to First Lead")) {
    pushIfUnique(bullets, "You want to see results faster from activation to first lead");
  }

  const [minCost, maxCost] = solution.estCostBand || [0, 0];
  const avgCost = (Number(minCost) + Number(maxCost)) / 2;
  if (Number.isFinite(avgCost) && avgCost > 0) {
    if (avgCost >= 80000) {
      pushIfUnique(bullets, "You have runway for a larger-scale investment");
    } else if (avgCost <= 20000) {
      pushIfUnique(bullets, "You want to keep investment lean while scaling impact");
    }
  }

  if (isOverallFit) {
    pushIfUnique(bullets, "You want the most balanced impact across growth and efficiency");
  }

  if (bullets.length === 0) {
    pushIfUnique(bullets, GRANT_BULLETS[solution.grantTag] || "You want a practical path to execute");
  }

  return bullets.slice(0, 3);
};

export const clampSignals = (signals?: string[]): string[] => {
  if (!Array.isArray(signals)) {
    return [];
  }
  return signals
    .map(signal => signal?.trim())
    .filter((signal): signal is string => Boolean(signal))
    .slice(0, 4);
};

const formatImpactSnippet = (label: string, value?: number, suffix: string = "") => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return `${value}${suffix} ${label}`;
};

export const buildVerboseDescription = (solution: TRHLSOption): string => {
  const base = solution.whyFit?.trim() ?? "";
  const snippets: string[] = [];
  const impact = solution.businessImpact || {};

  const revenue = formatImpactSnippet("revenue lift", impact.revenueLiftPct, "%");
  const leads = formatImpactSnippet("new leads/mo", impact.leadDeltaPerMonth);
  const time = formatImpactSnippet("to first lead", impact.timeToFirstLeadWeeks, " wks");

  if (revenue) snippets.push(revenue);
  if (leads) snippets.push(leads);
  if (time) snippets.push(time);

  const impactCopy = snippets.length > 0 ? `Projected impact: ${snippets.join(", ")}.` : "";

  return [base, impactCopy].filter(Boolean).join(" ");
};

