import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  User
} from 'lucide-react';
import { LeadResponse } from '../../state/matching/types';

interface IndicativeSubmissionModalProps {
  response: LeadResponse | null;
  onClose: () => void;
}

export const IndicativeSubmissionModal: React.FC<IndicativeSubmissionModalProps> = ({ 
  response, 
  onClose 
}) => {
  if (!response || !response.indicativeSubmission) return null;

  const submission = response.indicativeSubmission;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{response.name}</h2>
                  <p className="text-indigo-100 text-sm">
                    {response.type === 'VENDOR' ? 'Vendor' : 'Consultant'} Submission
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-300" />
                <span className="text-sm font-medium">{response.qualificationScore}% Match</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-200" />
                <span className="text-sm">
                  Responded in {response.responseTime?.toFixed(1)}h
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{submission.title}</h3>
            
            {/* Summary */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-slate-700 leading-relaxed">{submission.summary}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="font-medium text-green-800">Estimated Cost</span>
                </div>
                <div className="text-xl font-bold text-green-900">
                  S$ {submission.estimatedCost[0].toLocaleString()}K - {submission.estimatedCost[1].toLocaleString()}K
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-800">Timeline</span>
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {submission.timeline[0]} - {submission.timeline[1]} months
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {submission.keyFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg"
                  >
                    <CheckCircle size={16} className="text-indigo-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h4>
              <div className="space-y-3">
                {submission.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                This is an indicative submission. Contact {response.name} for detailed discussions.
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact {response.name}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
