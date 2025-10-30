import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Zap, Info } from 'lucide-react';
import { PageHeader } from '../../../components/common/PageHeader';
import { ModeCard } from '../../../components/common/ModeCard';
import { getSmartRecommendation } from '../../../state/matching/recommendation';
import { useAppStore } from '../../../state/store';

interface Step4_MatchingModeProps {
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
        {currentStep === 4 && 'Matching Setup'}
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

const RecommendationBanner: React.FC<{ 
  recommended: 'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED';
  bannerText: string;
  tooltipText: string;
  isMobile?: boolean;
}> = ({ recommended, bannerText, tooltipText, isMobile = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-xl border border-indigo-200 p-4 mb-6"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Zap size={16} className="text-indigo-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            Recommended
          </span>
          <div className="group relative">
            <Info size={14} className="text-slate-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {tooltipText}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        </div>
        <p className={`text-slate-700 ${isMobile ? 'text-sm' : 'text-sm'}`}>
          {bannerText}
        </p>
      </div>
    </div>
  </motion.div>
);

const MobileFooter: React.FC<{
  onBack: () => void;
  onContinue: () => void;
  hasSelection: boolean;
  selectedMode: string;
}> = ({ onBack, onContinue, hasSelection, selectedMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-40 md:hidden"
  >
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
      >
        ◀ Back
      </button>
      
      <motion.button
        onClick={onContinue}
        disabled={!hasSelection}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
          hasSelection
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
        whileHover={hasSelection ? { scale: 1.02 } : {}}
        whileTap={hasSelection ? { scale: 0.98 } : {}}
        aria-label={`Continue with ${selectedMode === 'CONSULTANT_MANAGED' ? 'Consultant-Managed' : 'Self-Managed'} Mode`}
      >
        Continue {selectedMode === 'CONSULTANT_MANAGED' ? 'with Consultant-Managed' : 'with Self-Managed'} →
      </motion.button>
    </div>
  </motion.div>
);

const DesktopFooter: React.FC<{
  onBack: () => void;
  onContinue: () => void;
  hasSelection: boolean;
  selectedMode: string;
}> = ({ onBack, onContinue, hasSelection, selectedMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="hidden md:flex items-center justify-between mt-8 pt-6 border-t border-slate-200"
  >
    <motion.button
      onClick={onBack}
      className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Back
    </motion.button>
    
    <motion.button
      onClick={onContinue}
      disabled={!hasSelection}
      className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
        hasSelection
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
      }`}
      whileHover={hasSelection ? { scale: 1.02 } : {}}
      whileTap={hasSelection ? { scale: 0.98 } : {}}
      aria-label={`Continue with ${selectedMode === 'CONSULTANT_MANAGED' ? 'Consultant-Managed' : 'Self-Managed'} Mode`}
    >
      Continue {selectedMode === 'CONSULTANT_MANAGED' ? 'with Consultant-Managed' : 'with Self-Managed'} Mode
      <ArrowRight size={18} />
    </motion.button>
  </motion.div>
);

export const Step4_MatchingMode: React.FC<Step4_MatchingModeProps> = ({ onNext, onBack }) => {
  const { reqDocs } = useAppStore();
  const [selectedMode, setSelectedMode] = useState<'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get the most recent ReqDoc (in a real app, this would be the current one)
  const currentReqDoc = reqDocs[reqDocs.length - 1] || null;
  const recommendation = getSmartRecommendation(currentReqDoc);

  useEffect(() => {
    // Set default selection to recommended mode
    setSelectedMode(recommendation.recommended);
  }, [recommendation.recommended]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModeSelect = (mode: 'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED') => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (selectedMode) {
      // In a real app, you'd update the ReqDoc with the selected matching mode
      console.log('Selected matching mode:', selectedMode);
      onNext();
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-0">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Recommendations
      </button>
      
      <PageHeader 
        title="Matching Setup" 
        subtitle="Choose your workflow. You can switch before invitations go out." 
      />

      <ProgressBar currentStep={4} totalSteps={4} />

      {/* Recommendation Banner */}
      <RecommendationBanner
        recommended={recommendation.recommended}
        bannerText={recommendation.bannerText}
        tooltipText={recommendation.tooltipText}
        isMobile={isMobile}
      />

      {/* Mode Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ModeCard
          mode="CONSULTANT_MANAGED"
          isSelected={selectedMode === 'CONSULTANT_MANAGED'}
          onSelect={() => handleModeSelect('CONSULTANT_MANAGED')}
          isMobile={isMobile}
        />
        
        <ModeCard
          mode="SME_SELF_MANAGED"
          isSelected={selectedMode === 'SME_SELF_MANAGED'}
          onSelect={() => handleModeSelect('SME_SELF_MANAGED')}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile Footer */}
      <MobileFooter
        onBack={onBack}
        onContinue={handleContinue}
        hasSelection={!!selectedMode}
        selectedMode={selectedMode || ''}
      />

      {/* Desktop Footer */}
      <DesktopFooter
        onBack={onBack}
        onContinue={handleContinue}
        hasSelection={!!selectedMode}
        selectedMode={selectedMode || ''}
      />
    </div>
  );
};