import React from 'react';
import { Card } from './Card';

interface LaunchpadProps {
  onStartNewOpportunity: () => void;
}

export const Launchpad: React.FC<LaunchpadProps> = ({ onStartNewOpportunity }) => {
  return (
    <Card className="text-center bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200/50">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">✨</span>
        <h2 className="text-xl font-semibold text-slate-900">Launchpad</h2>
      </div>
      <p className="text-slate-600 mb-6">Turn your business goals into a live project.</p>
      <button 
        onClick={onStartNewOpportunity}
        className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
      >
        Start New Opportunity
      </button>
    </Card>
  );
};
