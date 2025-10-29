import React from 'react';

interface LeadScoreBadgeProps {
  score?: number;
  statusText?: string;
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ score = 68, statusText }) => {
  const status = statusText || (score >= 80 ? "Hot" : score >= 60 ? "Warm" : "Cold");
  const color = status === "Hot" 
    ? "bg-red-50 text-red-700 border border-red-200"
    : status === "Warm" 
    ? "bg-amber-50 text-amber-700 border border-amber-200"
    : "bg-slate-50 text-slate-600 border border-slate-200";
    
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>
        {status}
      </span>
      <span className="text-xs text-slate-500 font-medium">Score {score}</span>
    </div>
  );
};
