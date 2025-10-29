import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'application' | 'task' | 'quote' | 'user';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'application' }) => {
  const styles = {
    application: { 
      "Approved": "bg-emerald-50 text-emerald-700 border border-emerald-200", 
      "In Review": "bg-amber-50 text-amber-700 border border-amber-200", 
      "Drafting": "bg-blue-50 text-blue-700 border border-blue-200" 
    },
    task: { 
      "High": "bg-red-50 text-red-700 border border-red-200", 
      "Medium": "bg-amber-50 text-amber-700 border border-amber-200", 
      "Low": "bg-slate-50 text-slate-600 border border-slate-200" 
    },
    quote: { 
      "Pending": "bg-blue-50 text-blue-700 border border-blue-200", 
      "Submitted": "bg-amber-50 text-amber-700 border border-amber-200", 
      "Accepted": "bg-emerald-50 text-emerald-700 border border-emerald-200" 
    },
    user: { 
      "Active": "bg-emerald-50 text-emerald-700 border border-emerald-200", 
      "Pending Approval": "bg-amber-50 text-amber-700 border border-amber-200" 
    },
  };
  
  const statusClass = (styles[type] as any)?.[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
  
  return (
    <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${statusClass}`}>
      {status}
    </span>
  );
};
