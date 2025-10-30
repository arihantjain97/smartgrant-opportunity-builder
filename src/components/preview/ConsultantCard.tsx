import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Info, Star, Clock, Award, User } from 'lucide-react';
import { Consultant } from '../../state/preview/types';

interface ConsultantCardProps {
  consultant: Consultant;
  isRecommended: boolean;
  onToggle: (id: string) => void;
  onAdd?: (id: string) => void;
  onInfo?: (consultant: Consultant) => void;
}

const getMatchColor = (match: number) => {
  if (match >= 85) return 'from-green-500 to-emerald-500';
  if (match >= 70) return 'from-blue-500 to-indigo-500';
  return 'from-slate-400 to-slate-500';
};

const getMatchBadge = (match: number) => {
  if (match >= 85) return 'Top Match';
  if (match >= 70) return 'Good Match';
  return 'Fair Match';
};

const getHighlightBadges = (consultant: Consultant) => {
  const badges = [];
  if (consultant.match >= 85) badges.push('Top Match');
  if (consultant.avgTurnaround <= 14) badges.push('Fast Turnaround');
  if (consultant.successRate >= 90) badges.push('High Success Rate');
  return badges;
};

export const ConsultantCard: React.FC<ConsultantCardProps> = ({
  consultant,
  isRecommended,
  onToggle,
  onAdd,
  onInfo
}) => {
  const matchColor = getMatchColor(consultant.match);
  const matchBadge = getMatchBadge(consultant.match);
  const highlightBadges = getHighlightBadges(consultant);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${
        consultant.selected ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : 'bg-white'
      }`}
    >
      {/* Match % Gradient Bar */}
      <div className={`h-1 rounded-t-xl bg-gradient-to-r ${matchColor}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{consultant.name}</h3>
              <p className="text-sm text-slate-600 mt-1">
                "{consultant.specialty} · {consultant.experience} · {consultant.successRate}% win rate"
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Award size={14} className="text-indigo-600" />
              <span className="text-sm font-medium text-slate-900">{matchBadge}</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{consultant.match}%</span>
          </div>
        </div>

        {/* Core Focus */}
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 mb-2">Core Focus:</p>
          <div className="flex flex-wrap gap-1">
            {consultant.coreFocus.map((focus, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
              >
                {focus}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500" />
            <span>{consultant.rating} / 5</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Avg Turnaround: {consultant.avgTurnaround} days</span>
          </div>
        </div>

        {/* Highlight Badges */}
        {highlightBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {highlightBadges.map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onToggle(consultant.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                consultant.selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check size={14} />
              {consultant.selected ? 'Selected' : 'Select'}
            </motion.button>

            {!isRecommended && onAdd && (
              <motion.button
                onClick={() => onAdd(consultant.id)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={14} />
                Add
              </motion.button>
            )}
          </div>

          {onInfo && (
            <motion.button
              onClick={() => onInfo(consultant)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
