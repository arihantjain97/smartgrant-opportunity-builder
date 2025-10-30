import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../../components/common/PageHeader';
import { LiveResponseCard } from '../../../components/matching/LiveResponseCard';
import { IndicativeSubmissionModal } from '../../../components/matching/IndicativeSubmissionModal';
import { useMatchingStore } from '../../../state/matching/store';
import { LeadResponse } from '../../../state/matching/types';

interface Step6_LiveMatchingDashboardProps {
  onBack: () => void;
}

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
      <span className="text-sm text-slate-500">Live Matching Dashboard</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);

const ResponseWindowHeader: React.FC<{
  totalSent: number;
  accepted: number;
  pending: number;
  hoursRemaining: number;
  isUrgent: boolean;
}> = ({ totalSent, accepted, pending, hoursRemaining, isUrgent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 mb-8"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isUrgent ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Clock size={20} className={isUrgent ? 'text-red-600' : 'text-blue-600'} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Response Window</h2>
          <p className="text-sm text-slate-600">
            {isUrgent ? 'Responses closing soon' : 'Responses still being accepted'}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`text-2xl font-bold ${
          isUrgent ? 'text-red-600' : 'text-blue-600'
        }`}>
          {hoursRemaining}h left
        </div>
        <div className="text-sm text-slate-500">remaining</div>
      </div>
    </div>

    {/* Progress Summary */}
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {accepted} of {totalSent} responses received
        </span>
        <span className="text-slate-500">
          {pending} pending
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(accepted / totalSent) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  </motion.div>
);

const LiveSyncIndicator: React.FC<{ isRefreshing: boolean }> = ({ isRefreshing }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 text-sm text-slate-500 mb-6"
  >
    <motion.div
      animate={{ rotate: isRefreshing ? 360 : 0 }}
      transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
    >
      <RefreshCw size={14} />
    </motion.div>
    <span>Live syncing…</span>
    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
  </motion.div>
);

const ResponseFeed: React.FC<{
  responses: LeadResponse[];
  onViewSubmission: (response: LeadResponse) => void;
}> = ({ responses, onViewSubmission }) => {
  // Only show accepted and pending responses
  const activeResponses = responses.filter(r => r.status === 'ACCEPTED' || r.status === 'PENDING');
  
  if (activeResponses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Awaiting Responses
        </h3>
        <p className="text-slate-600">
          Responses will appear here as vendors and consultants reply to your invitations.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {activeResponses.map((response, index) => (
        <motion.div
          key={response.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <LiveResponseCard
            response={response}
            onViewSubmission={onViewSubmission}
          />
        </motion.div>
      ))}
    </div>
  );
};

const FooterSummary: React.FC<{
  accepted: number;
  totalSent: number;
  pending: number;
}> = ({ accepted, totalSent, pending }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <CheckCircle size={16} className="text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            {accepted} of {totalSent} responses received
          </h3>
          <p className="text-sm text-slate-600">
            {pending > 0 
              ? `SmartGrant will notify you when all ${pending} remaining responses are in.`
              : 'All responses have been received.'
            }
          </p>
        </div>
      </div>
      
      <motion.button
        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Export results"
      >
        <Download size={18} />
      </motion.button>
    </div>
  </motion.div>
);

export const Step6_LiveMatchingDashboard: React.FC<Step6_LiveMatchingDashboardProps> = ({ onBack }) => {
  const {
    responses,
    stats,
    responseWindow,
    selectedResponse,
    setSelectedResponse,
    refreshData
  } = useMatchingStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewSubmission = (response: LeadResponse) => {
    setSelectedResponse(response);
  };

  const handleCloseModal = () => {
    setSelectedResponse(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const accepted = stats.accepted;
  const pending = stats.pending;
  const totalSent = stats.totalSent;
  const hoursRemaining = responseWindow.hoursRemaining;
  const isUrgent = hoursRemaining <= 6;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20 md:pb-0">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Preview & Dispatch
      </button>
      
      <PageHeader 
        title="Live Matching Dashboard" 
        subtitle="Monitor responses from vendors and consultants in real-time" 
      />

      <ProgressBar currentStep={6} totalSteps={6} />

      {/* Response Window Header */}
      <ResponseWindowHeader
        totalSent={totalSent}
        accepted={accepted}
        pending={pending}
        hoursRemaining={hoursRemaining}
        isUrgent={isUrgent}
      />

      {/* Live Sync Indicator */}
      <LiveSyncIndicator isRefreshing={isRefreshing} />

      {/* AI Assist Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm text-slate-500 mb-6"
      >
        Responses are auto-ranked for quality and speed.
      </motion.div>

      {/* Response Feed */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Active Responses
        </h2>
        <ResponseFeed
          responses={responses}
          onViewSubmission={handleViewSubmission}
        />
      </div>

      {/* Indicative Submission Modal */}
      <IndicativeSubmissionModal
        response={selectedResponse}
        onClose={handleCloseModal}
      />

      {/* Footer Summary */}
      <FooterSummary
        accepted={accepted}
        totalSent={totalSent}
        pending={pending}
      />
    </div>
  );
};