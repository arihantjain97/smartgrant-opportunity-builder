import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface Step2_TRHLSProps {
  onNext: () => void;
  onBack: () => void;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <span className="relative group">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
      {text}
    </span>
  </span>
);

const SolutionCard: React.FC<{
  rec: any;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ rec, onSelect, isSelected }) => (
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
      <h3 className="text-lg font-bold text-slate-900 pr-8">{rec.name}</h3>
      
      <div className="flex items-center gap-2 mt-2">
        <span className={`font-semibold ${rec.grantTag === 'PSG' || rec.grantTag === 'EDG' ? 'text-emerald-600' : 'text-slate-500'}`}>
          {rec.grantTag === 'PSG' ? '✅ PSG' : rec.grantTag === 'EDG' ? '✅ EDG' : '❌ Non-Grant'}
        </span>
        <Tooltip text={rec.grantWhy || 'No grant support available'}>
          <Info size={14} className="text-slate-500 cursor-help" />
        </Tooltip>
      </div>
      
      <p className="text-sm text-slate-600 mt-3 h-10">{rec.whyFit}</p>
    </div>
    
    <div className="mt-auto bg-slate-50 p-6 rounded-b-xl border-t border-slate-200">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-700">Est. Cost</span>
        <span className="font-bold text-slate-900">
          S${rec.estCostBand[0].toLocaleString()} - S${rec.estCostBand[1].toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm mt-2">
        <span className="font-medium text-slate-700">Est. Duration</span>
        <span className="font-bold text-slate-900">
          {rec.estDurationMonths[0]}-{rec.estDurationMonths[1]} mos
        </span>
      </div>
    </div>
  </Card>
);

export const Step2_TRHLS: React.FC<Step2_TRHLSProps> = ({ onNext, onBack }) => {
  const { trhls, currentReqDocId, selectTRHLS } = useAppStore();
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);

  const toggleSolution = (id: string) => {
    setSelectedSolutions(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (currentReqDocId) {
      await mockApi.selectTRHLS(currentReqDocId, selectedSolutions);
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft size={16} />Back to Goal Description
      </button>
      
      <PageHeader 
        title="AI Recommendations" 
        subtitle="Step 2: Review Tailored Solutions. Select one or two pathways that best fit your goal." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trhls.map(rec => (
          <SolutionCard 
            key={rec.id}
            rec={rec}
            onSelect={() => toggleSolution(rec.id)}
            isSelected={selectedSolutions.includes(rec.id)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={onBack} 
          className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Back
        </button>
        <button 
          disabled={selectedSolutions.length === 0}
          onClick={handleNext}
          className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Proceed to Matching Setup
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
