import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Star,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { LeadResponse } from '../../state/matching/types';

interface StatusCardProps {
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
        borderColor: 'border-green-200',
        label: 'Accepted',
        labelColor: 'text-green-700'
      };
    case 'DECLINED':
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Declined',
        labelColor: 'text-red-700'
      };
    case 'PENDING':
      return {
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'Pending',
        labelColor: 'text-amber-700'
      };
    case 'EXPIRED':
      return {
        icon: AlertCircle,
        color: 'text-slate-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
        label: 'Expired',
        labelColor: 'text-slate-700'
      };
  }
};

const getTypeConfig = (type: LeadResponse['type']) => {
  switch (type) {
    case 'VENDOR':
      return {
        icon: '🏢',
        label: 'Vendor',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    case 'CONSULTANT':
      return {
        icon: '👥',
        label: 'Consultant',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      };
  }
};

export const StatusCard: React.FC<StatusCardProps> = ({ response, onViewSubmission }) => {
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
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white rounded-xl border-2 ${statusConfig.borderColor} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {/* Status Badge */}
      <div className={`absolute -top-2 -right-2 w-8 h-8 ${statusConfig.bgColor} rounded-full flex items-center justify-center shadow-lg`}>
        <StatusIcon size={16} className={statusConfig.color} />
      </div>

      {/* Qualification Score */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
          <Star size={12} className="text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">{response.qualificationScore}%</span>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl">
            {typeConfig.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">{response.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.labelColor}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        {response.responseTime && (
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
            <Clock size={14} />
            <span>Responded in {formatResponseTime(response.responseTime)}</span>
          </div>
        )}

        {/* Time Remaining */}
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
          <Calendar size={14} />
          <span>
            {response.status === 'PENDING' 
              ? `Response due in ${formatTimeRemaining(response.expiresAt)}`
              : `Expires in ${formatTimeRemaining(response.expiresAt)}`
            }
          </span>
        </div>

        {/* Indicative Submission Preview */}
        {response.indicativeSubmission && (
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-slate-900 mb-2 text-sm">
              {response.indicativeSubmission.title}
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              {response.indicativeSubmission.summary}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-1">
                <DollarSign size={12} className="text-green-600" />
                <span className="text-xs text-slate-700">
                  S$ {response.indicativeSubmission.estimatedCost[0].toLocaleString()}K - {response.indicativeSubmission.estimatedCost[1].toLocaleString()}K
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-blue-600" />
                <span className="text-xs text-slate-700">
                  {response.indicativeSubmission.timeline[0]} - {response.indicativeSubmission.timeline[1]} months
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {response.indicativeSubmission.keyFeatures.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {response.indicativeSubmission.keyFeatures.length > 2 && (
                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                  +{response.indicativeSubmission.keyFeatures.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {response.status === 'ACCEPTED' && response.indicativeSubmission && (
          <motion.button
            onClick={() => onViewSubmission(response)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={16} />
            View Indicative Submission
            <ArrowRight size={14} />
          </motion.button>
        )}

        {response.status === 'PENDING' && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
            <Clock size={16} />
            Awaiting Response
          </div>
        )}

        {response.status === 'DECLINED' && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            <XCircle size={16} />
            Declined
          </div>
        )}

        {response.status === 'EXPIRED' && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium">
            <AlertCircle size={16} />
            Response Window Closed
          </div>
        )}
      </div>
    </motion.div>
  );
};
