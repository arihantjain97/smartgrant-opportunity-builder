import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, TrendingUp, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { TRHLSOption } from '../../../state/types';
import { formatImpact, getGrantBadgeColor, getImpactColor } from '../../../state/trhls/impact';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selected: TRHLSOption[];
  onProceed: () => void;
}

const ImpactMetric: React.FC<{ 
  label: string; 
  value: string; 
  icon: React.ElementType;
  color: string;
  index: number;
}> = ({ label, value, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-lg p-3 border border-slate-200"
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className={color} />
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
    <div className={`text-lg font-bold ${color}`}>{value}</div>
  </motion.div>
);

const SolutionCard: React.FC<{ 
  solution: TRHLSOption; 
  index: number;
}> = ({ solution, index }) => {
  const impactMetrics = formatImpact(solution);
  const grantBadgeColor = getGrantBadgeColor(solution.grantTag);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm leading-tight">{solution.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${grantBadgeColor}`}>
            {solution.grantTag === 'NON_GRANT' ? 'Self-Funded' : solution.grantTag}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3">{solution.whyFit}</p>
      </div>

      {/* Why Recommended */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-700 mb-2">Why you're seeing this:</h4>
        <div className="flex flex-wrap gap-1">
          {solution.rationaleSignals?.map((signal: string, idx: number) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
            >
              {signal}
            </motion.span>
          )) || []}
        </div>
      </div>

      {/* Business Impact */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-700 mb-3">Business Impact:</h4>
        <div className="grid grid-cols-2 gap-2">
          {impactMetrics.map((metric, idx) => {
            const iconMap = {
              'Revenue Lift': TrendingUp,
              'New Leads / mo': Users,
              'CAC Change': DollarSign,
              'Time to First Lead': Clock
            };
            const Icon = iconMap[metric.label as keyof typeof iconMap] || TrendingUp;
            const color = getImpactColor(
              parseFloat(metric.value.replace('%', '').replace(' wks', '')),
              metric.label.includes('CAC') ? 'cac' : 
              metric.label.includes('Time') ? 'time' :
              metric.label.includes('Revenue') ? 'revenue' : 'leads'
            );
            
            return (
              <ImpactMetric
                key={metric.label}
                label={metric.label}
                value={metric.value}
                icon={Icon}
                color={color}
                index={idx}
              />
            );
          })}
        </div>
      </div>

      {/* Grant Support */}
      {solution.grantTag !== 'NON_GRANT' && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <h4 className="text-xs font-medium text-blue-800 mb-1">Grant Support:</h4>
          <p className="text-xs text-blue-700">{solution.grantWhy}</p>
        </div>
      )}

      {/* Cost & Duration */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Cost: S${solution.estCostBand[0].toLocaleString()} - S${solution.estCostBand[1].toLocaleString()}</span>
          <span>Duration: {solution.estDurationMonths[0]}-{solution.estDurationMonths[1]} months</span>
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
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>Ready to proceed with selected solutions</span>
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
