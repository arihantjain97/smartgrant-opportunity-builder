import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, TrendingUp, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { TRHLSOption } from '../../../state/types';
import { 
  computeImpactWinners, 
  findBestOverallSolutionId, 
  formatImpact, 
  getGrantBadgeColor, 
  getImpactColor, 
  MetricWinnerMap 
} from '../../../state/trhls/impact';
import { LeadResponse } from '../../../state/matching/types';
import { buildSolutionSummary, clampSignals, derivePersonaLine, buildVerboseDescription } from './compareHelpers';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selected: TRHLSOption[];
  onProceed: () => void;
}

const metricOrder = [
  {
    key: 'revenueLiftPct' as const,
    label: 'Revenue Lift',
    icon: TrendingUp,
    type: 'revenue' as const,
    badge: 'Best Revenue Lift',
    subLabel: 'Estimated lift over the next 6–12 months'
  },
  {
    key: 'leadDeltaPerMonth' as const,
    label: 'New Leads / mo',
    icon: Users,
    type: 'leads' as const,
    badge: 'Most Leads Generated',
    subLabel: 'Average net-new leads each month'
  },
  {
    key: 'cacChangePct' as const,
    label: 'CAC Change',
    icon: DollarSign,
    type: 'cac' as const,
    badge: 'Best CAC Savings',
    subLabel: 'Estimated change in acquisition cost'
  },
  {
    key: 'timeToFirstLeadWeeks' as const,
    label: 'Time to First Lead',
    icon: Clock,
    type: 'time' as const,
    badge: 'Fastest to Leads',
    subLabel: 'Weeks from kickoff to first lead'
  }
] as const;

interface ImpactMetricProps { 
  label: string; 
  value: string; 
  icon: React.ElementType;
  color: string;
  index: number;
  subLabel: string;
  isWinner: boolean;
  winnerBadge?: string;
}

const ImpactMetric: React.FC<ImpactMetricProps> = ({
  label,
  value,
  icon: Icon,
  color,
  index,
  subLabel,
  isWinner,
  winnerBadge
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`rounded-lg p-3 border transition-colors ${
      isWinner ? 'border-indigo-300 bg-indigo-50/70 shadow-sm' : 'border-slate-200 bg-white'
    }`}
  >
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className={isWinner ? 'text-indigo-500' : 'text-slate-400'} />
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      {isWinner && winnerBadge && (
        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {winnerBadge}
        </span>
      )}
    </div>
    <div className={`text-2xl font-semibold leading-tight ${color}`}>{value}</div>
    <div className="text-[11px] text-slate-500 mt-1">{subLabel}</div>
  </motion.div>
);

interface SolutionCardProps {
  solution: TRHLSOption;
  index: number;
  metricWinners: MetricWinnerMap;
  showWinners: boolean;
  overallBestId: string | null;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, index, metricWinners, showWinners, overallBestId }) => {
  const impactMetrics = new Map(formatImpact(solution).map(metric => [metric.label, metric.value]));
  const grantBadgeColor = getGrantBadgeColor(solution.grantTag);
  const personaLine = derivePersonaLine(solution);
  const description = buildVerboseDescription(solution);
  const signals = clampSignals(solution.rationaleSignals);
  const winningMetrics = new Set(
    Object.values(metricWinners)
      .filter(info => info.winnerIds.includes(solution.id))
      .map(info => info.label)
  );
  const summaryBullets = buildSolutionSummary(solution, winningMetrics, overallBestId === solution.id);
  const isRecommended = overallBestId === solution.id && showWinners;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white rounded-xl border ${
        isRecommended ? 'border-indigo-300 shadow-lg' : 'border-slate-200 shadow-sm'
      } p-6`}
    >
      {isRecommended && (
        <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          Recommended
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm leading-tight">{solution.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${grantBadgeColor}`}>
            {solution.grantTag === 'NON_GRANT' ? 'Self-Funded' : solution.grantTag}
          </span>
        </div>
        {personaLine && (
          <p className="text-xs font-semibold text-indigo-600 mb-1">{personaLine}</p>
        )}
        <p className="text-xs text-slate-600">{description}</p>
      </div>

      {/* Why Recommended */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-700 mb-2">Why you're seeing this</h4>
        <div className="flex flex-wrap gap-1">
          {signals.map((signal: string, idx: number) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-[11px] rounded-full"
            >
              {signal}
            </motion.span>
          ))}
          {signals.length === 0 && (
            <span className="text-[11px] text-slate-400">Signals not available</span>
          )}
        </div>
      </div>

      {/* Business Impact */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-700 mb-3">Business Impact</h4>
        <div className="grid grid-cols-2 gap-3">
          {metricOrder.map((metric, idx) => {
            const displayValue = impactMetrics.get(metric.label) ?? '—';
            const rawValue = solution.businessImpact[metric.key];
            const hasValue = typeof rawValue === 'number' && !Number.isNaN(rawValue);
            const color = hasValue ? getImpactColor(rawValue, metric.type) : 'text-slate-400';
            const isWinner = showWinners && winningMetrics.has(metric.label) && hasValue;

            return (
              <ImpactMetric
                key={metric.label}
                label={metric.label}
                value={displayValue}
                icon={metric.icon}
                color={color}
                index={idx}
                subLabel={metric.subLabel}
                isWinner={isWinner}
                winnerBadge={isWinner ? metric.badge : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Grant Support */}
      {solution.grantTag !== 'NON_GRANT' && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
          <h4 className="text-xs font-medium text-blue-800 mb-1">Grant Support</h4>
          <p className="text-xs text-blue-700">{solution.grantWhy}</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Best if you...</h4>
        <ul className="list-disc list-inside space-y-1">
          {summaryBullets.map((bullet, idx) => (
            <li key={idx} className="text-[11px] text-slate-600 leading-snug">
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Cost & Duration */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex justify-between text-xs text-slate-600">
          <span>
            Cost: S${solution.estCostBand[0].toLocaleString()} - S${solution.estCostBand[1].toLocaleString()}
          </span>
          <span>
            Duration: {solution.estDurationMonths[0]}-{solution.estDurationMonths[1]} months
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ 
  isOpen, 
  onClose, 
  selected, 
  onProceed 
}) => {
  const metricWinners = React.useMemo(() => computeImpactWinners(selected), [selected]);
  const overallBestId = React.useMemo(() => findBestOverallSolutionId(selected), [selected]);
  const hasCompetition = selected.length > 1;
  const showWinners = hasCompetition && Object.keys(metricWinners).length > 0;

  const getGridCols = () => {
    if (selected.length === 1) return 'grid-cols-1';
    if (selected.length === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Compare Solutions</h2>
                  <p className="text-sm text-slate-600">
                    {selected.length} solution{selected.length > 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className={`grid ${getGridCols()} gap-6`}>
                {selected.map((solution, index) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    index={index}
                    metricWinners={metricWinners}
                    showWinners={showWinners}
                    overallBestId={overallBestId}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>
                    You've selected {selected.length} solution{selected.length !== 1 ? 's' : ''}. Choose the one that best matches how you want to grow.
                  </span>
                </div>
                <motion.button
                  onClick={onProceed}
                  className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Use these for my ReqDoc
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface Step6CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selected: LeadResponse[];
  onProceed: () => void;
}

export const Step6CompareDrawer: React.FC<Step6CompareDrawerProps> = ({ isOpen, onClose, selected, onProceed }) => {
  // Identify types
  const isVendor = selected.every(s => s.type === 'VENDOR');
  const isConsultant = selected.every(s => s.type === 'CONSULTANT');
  const isMixed = !isVendor && !isConsultant;
  const [roleTab, setRoleTab] = React.useState<'VENDOR' | 'CONSULTANT'>(isVendor ? 'VENDOR' : 'CONSULTANT');

  // Content helper: render row for each attribute/field
  // ... content functions (omitted for brevity; see original spec for field breakdown by type) ...

  // Placeholder/empty column helpers
  // ... placeholderCol ...

  // Top row with badges, etc.
  // ... badgeRow ...

  // CTA: Ready for clarification
  // ... buttonRow ...

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[92vh] overflow-hidden animate-fadeUp"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Compare: {selected.length} selected</h2>
              {isMixed && (
                <div className="mt-2 flex gap-2">
                  <button className={`chip ${roleTab === 'VENDOR' ? 'chip-active' : ''}`} onClick={() => setRoleTab('VENDOR')}>Vendor</button>
                  <button className={`chip ${roleTab === 'CONSULTANT' ? 'chip-active' : ''}`} onClick={() => setRoleTab('CONSULTANT')}>Consultant</button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          {/* Content: Grid/Rows */}
          <div className="p-6 overflow-y-auto">
            {/* Table with rows for attributes: role-specific or mixed/placeholder */}
            {/* ... implement row rendering for each content group based on role spec ... */}
          </div>
          {/* Footer CTA */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end">
            <button
              onClick={onProceed}
              className="bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-150 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Ready for clarification
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
