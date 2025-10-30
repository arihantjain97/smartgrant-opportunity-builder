import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, Users, DollarSign, Clock, BarChart3 } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { CompareDrawer } from './CompareDrawer';
import { useTrhlsStore } from '../../../state/trhls/store';
import { getGrantBadgeColor, getImpactColor } from '../../../state/trhls/impact';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface Step2_TRHLSProps {
  onNext: () => void;
  onBack: () => void;
}

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
      <span className="text-sm text-slate-500">
        {currentStep === 1 && 'Describe Your Goal'}
        {currentStep === 2 && 'AI Recommendations'}
        {currentStep === 3 && 'Grant Relevance & Confidence'}
      </span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="progress-bar h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);

const SolutionCard: React.FC<{ 
  solution: any; 
  isSelected: boolean; 
  onToggle: () => void;
  index: number;
}> = ({ solution, isSelected, onToggle, index }) => {
  const grantBadgeColor = getGrantBadgeColor(solution.grantTag);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative cursor-pointer group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onToggle}
    >
      <Card className={`h-full transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-50 border-blue-200 shadow-lg' 
          : 'hover:shadow-md hover:scale-[1.02]'
      }`}>
        {/* Selection Badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle size={14} className="text-white" />
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-slate-900 text-lg leading-tight">{solution.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${grantBadgeColor}`}>
              {solution.grantTag === 'NON_GRANT' ? 'Self-Funded' : solution.grantTag}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-3">{solution.whyFit}</p>
        </div>

        {/* Business Impact Preview */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
            <BarChart3 size={12} />
            Expected Impact
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className={`text-lg font-bold ${getImpactColor(solution.businessImpact.revenueLiftPct, 'revenue')}`}>
                +{solution.businessImpact.revenueLiftPct}%
              </div>
              <div className="text-xs text-slate-600">Revenue Lift</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className={`text-lg font-bold ${getImpactColor(solution.businessImpact.leadDeltaPerMonth, 'leads')}`}>
                +{solution.businessImpact.leadDeltaPerMonth}
              </div>
              <div className="text-xs text-slate-600">Leads/mo</div>
            </div>
          </div>
        </div>

        {/* Cost & Duration */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Cost: S${solution.estCostBand[0].toLocaleString()}</span>
            <span>{solution.estDurationMonths[0]}-{solution.estDurationMonths[1]} months</span>
          </div>
          <div className="text-xs text-slate-500">
            {solution.grantTag !== 'NON_GRANT' ? 'Grant-supported' : 'Self-funded'}
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        />
      </Card>
    </motion.div>
  );
};

const CompareBar: React.FC<{ 
  selectedCount: number; 
  onCompare: () => void;
  onClear: () => void;
}> = ({ selectedCount, onCompare, onClear }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
  >
    <Card className="bg-white shadow-xl border border-slate-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-slate-700">
            {selectedCount} solution{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onCompare}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Compare Solutions
          </button>
          <button
            onClick={onClear}
            className="bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    </Card>
  </motion.div>
);

export const Step2_TRHLS: React.FC<Step2_TRHLSProps> = ({ onNext, onBack }) => {
  const { all, selected, toggleSelect, clear } = useTrhlsStore();
  const [showCompare, setShowCompare] = useState(false);

  const handleToggle = (id: string) => {
    toggleSelect(id);
  };

  const handleCompare = () => {
    setShowCompare(true);
  };

  const handleProceed = async () => {
    // Update ReqDoc with selected TRHLS IDs
    const selectedIds = selected.map(s => s.id);
    
    // For now, we'll just proceed to next step
    // In a real app, you'd update the ReqDoc with the selected TRHLS IDs
    console.log('Selected TRHLS IDs:', selectedIds);
    
    onNext();
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Goal Capture
      </button>
      
      <PageHeader 
        title="AI Recommendations" 
        subtitle="Based on your goal, here are 5 tailored solutions that could help improve your online visibility and customer acquisition." 
      />

      <ProgressBar currentStep={2} totalSteps={3} />

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {all.map((solution, index) => (
          <SolutionCard
            key={solution.id}
            solution={solution}
            isSelected={selected.some(s => s.id === solution.id)}
            onToggle={() => handleToggle(solution.id)}
            index={index}
          />
        ))}
      </div>

      {/* Selection Instructions */}
      <Card className="bg-blue-50 border-blue-200 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How to proceed</h3>
            <p className="text-sm text-blue-800">
              Select 1-3 solutions that interest you. You can compare them side-by-side to see detailed impact metrics and grant support information.
            </p>
          </div>
        </div>
      </Card>

      {/* Compare Bar */}
      <AnimatePresence>
        {selected.length > 0 && (
          <CompareBar
            selectedCount={selected.length}
            onCompare={handleCompare}
            onClear={handleClear}
          />
        )}
      </AnimatePresence>

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        selected={selected}
        onProceed={handleProceed}
      />

      {/* Footer Actions */}
      <motion.div 
        className="mt-8 flex justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.button
          onClick={onBack}
          className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        
        <div className="flex gap-3">
          <AnimatePresence>
            {selected.length > 0 && (
              <motion.button
                key="continue"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={handleProceed}
                className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue with Selected Solutions
                <ArrowRight size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};