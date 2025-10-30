import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Timer,
  Users,
  Target
} from 'lucide-react';
import { MatchingStats, ResponseWindow } from '../../state/matching/types';

interface StatsOverviewProps {
  stats: MatchingStats;
  responseWindow: ResponseWindow;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({ icon, label, value, color, bgColor, trend }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`${bgColor} rounded-xl p-4 border border-slate-200`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </motion.div>
);

const ResponseWindowCard: React.FC<{ responseWindow: ResponseWindow }> = ({ responseWindow }) => {
  const getUrgencyColor = (hours: number) => {
    if (hours <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (hours <= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const urgencyConfig = getUrgencyColor(responseWindow.hoursRemaining);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${urgencyConfig.split(' ')[1]} border-2 ${urgencyConfig.split(' ')[2]} rounded-xl p-4`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Timer size={20} className={urgencyConfig.split(' ')[0]} />
        <span className={`font-semibold ${urgencyConfig.split(' ')[0]}`}>
          Response Window
        </span>
      </div>
      <div className="text-lg font-bold text-slate-900 mb-1">
        {responseWindow.hoursRemaining}h remaining
      </div>
      <div className="text-sm text-slate-600">
        {responseWindow.isUrgent ? 'Urgent - Responses closing soon' : 'Responses still being accepted'}
      </div>
    </motion.div>
  );
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, responseWindow }) => {
  const responseRate = stats.responseRate;
  const isGoodResponseRate = responseRate >= 70;
  const isUrgent = responseWindow.hoursRemaining <= 6;

  return (
    <div className="space-y-6">
      {/* Response Window Alert */}
      <ResponseWindowCard responseWindow={responseWindow} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle size={16} className="text-green-600" />}
          label="Accepted"
          value={stats.accepted}
          color="bg-green-100"
          bgColor="bg-white"
          trend={stats.accepted > 0 ? `+${stats.accepted}` : undefined}
        />
        
        <StatCard
          icon={<XCircle size={16} className="text-red-600" />}
          label="Declined"
          value={stats.declined}
          color="bg-red-100"
          bgColor="bg-white"
        />
        
        <StatCard
          icon={<Clock size={16} className="text-amber-600" />}
          label="Pending"
          value={stats.pending}
          color="bg-amber-100"
          bgColor="bg-white"
        />
        
        <StatCard
          icon={<AlertCircle size={16} className="text-slate-600" />}
          label="Expired"
          value={stats.expired}
          color="bg-slate-100"
          bgColor="bg-white"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-indigo-600" />
            <span className="font-semibold text-indigo-700">Response Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{responseRate}%</div>
          <div className="text-sm text-slate-600">
            {isGoodResponseRate ? 'Excellent response rate' : 'Good response rate'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Timer size={20} className="text-green-600" />
            <span className="font-semibold text-green-700">Avg Response Time</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{stats.avgResponseTime}h</div>
          <div className="text-sm text-slate-600">Average time to respond</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-purple-600" />
            <span className="font-semibold text-purple-700">Total Sent</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{stats.totalSent}</div>
          <div className="text-sm text-slate-600">Invitations dispatched</div>
        </motion.div>
      </div>
    </div>
  );
};
