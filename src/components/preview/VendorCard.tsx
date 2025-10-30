import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Info, Zap, DollarSign, Clock, Tag } from 'lucide-react';
import { Vendor } from '../../state/preview/types';

interface VendorCardProps {
  vendor: Vendor;
  isRecommended: boolean;
  onToggle: (id: string) => void;
  onAdd?: (id: string) => void;
  onInfo?: (vendor: Vendor) => void;
}

const getMatchColor = (match: number) => {
  if (match >= 85) return 'from-green-500 to-emerald-500';
  if (match >= 70) return 'from-blue-500 to-indigo-500';
  return 'from-slate-400 to-slate-500';
};

const getMatchBadge = (match: number) => {
  if (match >= 85) return 'High AI Match';
  if (match >= 70) return 'Good Match';
  return 'Fair Match';
};

const getGrantBadge = (grantTag: string) => {
  switch (grantTag) {
    case 'PSG': return { text: 'PSG Pre-Approved', color: 'bg-blue-100 text-blue-700' };
    case 'EDG': return { text: 'EDG Eligible', color: 'bg-purple-100 text-purple-700' };
    default: return { text: 'Direct Purchase', color: 'bg-slate-100 text-slate-700' };
  }
};

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  isRecommended,
  onToggle,
  onAdd,
  onInfo
}) => {
  const grantBadge = getGrantBadge(vendor.grantTag);
  const matchColor = getMatchColor(vendor.match);
  const matchBadge = getMatchBadge(vendor.match);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${
        vendor.selected ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : 'bg-white'
      }`}
    >
      {/* Match % Gradient Bar */}
      <div className={`h-1 rounded-t-xl bg-gradient-to-r ${matchColor}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${grantBadge.color}`}>
                  {grantBadge.text}
                </span>
                <span className="text-xs text-slate-500">• {vendor.sector} Sector</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Zap size={14} className="text-indigo-600" />
              <span className="text-sm font-medium text-slate-900">{matchBadge}</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{vendor.match}%</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <p className="text-sm text-slate-600 mb-2">{vendor.product}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              <span>Est. Cost S$ {vendor.costRange[0].toLocaleString()}–{vendor.costRange[1].toLocaleString()}K</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{vendor.duration[0]}–{vendor.duration[1]} months</span>
            </div>
          </div>
        </div>

        {/* Match Reason */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Tag size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Matched because:</p>
              <p className="text-sm text-slate-700">"{vendor.reason}"</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {vendor.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onToggle(vendor.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                vendor.selected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check size={14} />
              {vendor.selected ? 'Selected' : 'Select'}
            </motion.button>

            {!isRecommended && onAdd && (
              <motion.button
                onClick={() => onAdd(vendor.id)}
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
              onClick={() => onInfo(vendor)}
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
