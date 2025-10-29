import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface Step4_MatchingModeProps {
  onNext: () => void;
  onBack: () => void;
}

const ModeCard: React.FC<{
  mode: 'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED';
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ mode, title, description, pros, cons, isSelected, onSelect }) => (
  <Card 
    onClick={onSelect}
    className={`flex flex-col relative !p-0 border-2 ${
      isSelected 
        ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
        : 'border-slate-200 hover:border-slate-300'
    }`}
  >
    {isSelected && (
      <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1.5 shadow-md">
        <Check size={18} />
      </div>
    )}
    <div className="p-6">
      <h3 className="text-lg font-bold text-slate-900 pr-8">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{description}</p>
    </div>
    <div className="mt-auto bg-slate-50 p-6 rounded-b-xl border-t border-slate-200 space-y-4">
      <div>
        <h4 className="font-semibold text-emerald-600 mb-1">Pros:</h4>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          {pros.map(pro => <li key={pro}>{pro}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-red-600 mb-1">Cons:</h4>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          {cons.map(con => <li key={con}>{con}</li>)}
        </ul>
      </div>
    </div>
  </Card>
);

export const Step4_MatchingMode: React.FC<Step4_MatchingModeProps> = ({ onNext, onBack }) => {
  const { currentReqDocId } = useAppStore();
  const [selectedMode, setSelectedMode] = useState<'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED'>('CONSULTANT_MANAGED');

  const handleNext = async () => {
    if (currentReqDocId) {
      await mockApi.setMatchingMode(currentReqDocId, selectedMode);
    }
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft size={16} />Back to Privacy Settings
      </button>
      
      <PageHeader 
        title="Matching Setup" 
        subtitle="Step 4: Choose Your Workflow Mode. How would you like to manage this opportunity?" 
      />

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-3 mb-6">
        <Zap size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Recommendation:</span> Based on your project scope, we suggest <strong>Consultant-Managed</strong> for a guided experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModeCard
          mode="CONSULTANT_MANAGED"
          title="Consultant-Managed (Recommended)"
          description="A grant consultant will guide you, shortlist vendors, and manage the application."
          pros={["Expert guidance", "Higher success rate", "Less work for you"]}
          cons={["Consultant fees apply", "Less direct control"]}
          isSelected={selectedMode === 'CONSULTANT_MANAGED'}
          onSelect={() => setSelectedMode('CONSULTANT_MANAGED')}
        />
        <ModeCard
          mode="SME_SELF_MANAGED"
          title="SME Self-Managed"
          description="You manage the process, shortlist vendors, and prepare the application yourself."
          pros={["Full control", "No consultant fees"]}
          cons={["More time-consuming", "Higher risk of errors", "Requires grant knowledge"]}
          isSelected={selectedMode === 'SME_SELF_MANAGED'}
          onSelect={() => setSelectedMode('SME_SELF_MANAGED')}
        />
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={onBack} 
          className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto"
        >
          Continue with Selected Mode
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
