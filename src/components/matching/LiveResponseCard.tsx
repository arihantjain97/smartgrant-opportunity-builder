import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Eye,
  Star,
  ArrowRight,
  Building2,
  Users
} from 'lucide-react';
import { LeadResponse } from '../../state/matching/types';

interface LiveResponseCardProps {
  response: LeadResponse;
  onViewSubmission: (response: LeadResponse) => void;
}

const getStatusConfig = (status: LeadResponse['status']) => {
  switch (status) {
    case 'ACCEPTED':
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: 'Accepted',
        dotColor: 'bg-green-500'
      };
    case 'PENDING':
      return {
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        label: 'Pending',
        dotColor: 'bg-amber-500'
      };
    default:
      return {
        icon: Clock,
        color: 'text-slate-600',
        bgColor: 'bg-slate-50',
        label: status,
        dotColor: 'bg-slate-500'
      };
  }
};

const getTypeConfig = (type: LeadResponse['type']) => {
  switch (type) {
    case 'VENDOR':
      return {
        icon: Building2,
        label: 'Vendor',
        color: 'text-blue-600'
      };
    case 'CONSULTANT':
      return {
        icon: Users,
        label: 'Consultant',
        color: 'text-purple-600'
      };
  }
};

export const LiveResponseCard: React.FC<LiveResponseCardProps> = ({ 
  response, 
  onViewSubmission 
}) => {
  const statusConfig = getStatusConfig(response.status);
  const typeConfig = getTypeConfig(response.type);
  const StatusIcon = statusConfig.icon;

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Expired';
    }
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return null;
    if (responseTime < 1) {
      return `${Math.round(responseTime * 60)}m`;
    }
    return `${responseTime.toFixed(1)}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <typeConfig.icon size={18} className={typeConfig.color} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{response.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">{typeConfig.label}</span>
              <span className="text-xs text-slate-400">•</span>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-500" />
                <span className="text-xs font-medium text-slate-600">
                  {response.qualificationScore}% match
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
          <span className="text-sm font-medium text-slate-700">{statusConfig.label}</span>
        </div>
      </div>

      {/* Response Info */}
      {response.responseTime && (
        <div className="text-sm text-slate-600 mb-3">
          Responded in {formatResponseTime(response.responseTime)}
        </div>
      )}

      {/* Time Remaining */}
      <div className="text-sm text-slate-500 mb-4">
        {response.status === 'PENDING' 
          ? `Response due in ${formatTimeRemaining(response.expiresAt)}`
          : `Expires in ${formatTimeRemaining(response.expiresAt)}`
        }
      </div>

      {/* Action Button */}
      {response.status === 'ACCEPTED' && response.indicativeSubmission && (
        <motion.button
          onClick={() => onViewSubmission(response)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye size={16} />
          View Indicative Submission
          <ArrowRight size={14} />
        </motion.button>
      )}

      {response.status === 'PENDING' && (
        <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium">
          <Clock size={16} />
          Awaiting Response
        </div>
      )}
    </motion.div>
  );
};
