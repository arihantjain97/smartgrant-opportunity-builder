import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface DispatchSummaryProps {
  vendorCount: number;
  consultantCount: number;
  visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC';
  onVisibilityChange: (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => void;
}

const getVisibilityText = (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => {
  switch (visibility) {
    case 'PRIVATE': return 'Private (Only you can see)';
    case 'LIMITED': return 'Limited (Only matched vendors/consultants can view lead preview)';
    case 'PUBLIC': return 'Public (Visible to all SmartGrant users)';
  }
};

const getVisibilityColor = (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => {
  switch (visibility) {
    case 'PRIVATE': return 'text-slate-600';
    case 'LIMITED': return 'text-blue-600';
    case 'PUBLIC': return 'text-green-600';
  }
};

export const DispatchSummary: React.FC<DispatchSummaryProps> = ({
  vendorCount,
  consultantCount,
  visibility,
  onVisibilityChange
}) => {
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  const totalSelected = vendorCount + consultantCount;
  const canDispatch = vendorCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle size={16} className="text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-1">Ready to Dispatch</h3>
          <p className="text-sm text-green-700">
            You've selected {vendorCount} vendor{vendorCount !== 1 ? 's' : ''} and {consultantCount} consultant{consultantCount !== 1 ? 's' : ''}.<br />
            They'll receive masked lead previews (valid 72h) and can accept for 1 credit each.
          </p>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="border-t border-green-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Visibility:</span>
            <span className={`text-sm ${getVisibilityColor(visibility)}`}>
              {getVisibilityText(visibility)}
            </span>
          </div>
          
          <motion.button
            onClick={() => setShowVisibilityOptions(!showVisibilityOptions)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Change visibility</span>
            {showVisibilityOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {showVisibilityOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {[
                { value: 'PRIVATE', label: 'Private', desc: 'Only you can see this lead' },
                { value: 'LIMITED', label: 'Limited', desc: 'Only matched vendors/consultants' },
                { value: 'PUBLIC', label: 'Public', desc: 'Visible to all SmartGrant users' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onVisibilityChange(option.value as 'PRIVATE' | 'LIMITED' | 'PUBLIC');
                    setShowVisibilityOptions(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    visibility === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-600">{option.desc}</div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning Messages */}
      {!canDispatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            Select at least 1 vendor to proceed.
          </p>
        </motion.div>
      )}

      {vendorCount > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
        >
          <p className="text-sm text-orange-800">
            SmartGrant suggests ≤ 5 vendors for optimal response rates.
          </p>
        </motion.div>
      )}

      {consultantCount > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
        >
          <p className="text-sm text-orange-800">
            SmartGrant suggests ≤ 3 consultants for optimal response rates.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
