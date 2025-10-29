import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Target, TrendingUp, Globe, Zap, Users, Shield, Brain, Eye } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';
import { COACH_CONFIG } from '../../../state/coach/coachConfig';
import { coachActions, type CoachState, type CoachStage } from '../../../state/coach/coachMachine';

interface Step1_GoalCaptureProps {
  onNext: () => void;
  onBack: () => void;
}

// Helper function to detect domain from input
const detectDomain = (input: string): "GROWTH" | "OPERATIONS" | "CAPABILITY" | "SUPPLY" | null => {
  const lowerInput = input.toLowerCase();
  for (const mapping of COACH_CONFIG.keywordMap) {
    if (mapping.keys.some(keyword => lowerInput.includes(keyword))) {
      return mapping.domain as any;
    }
  }
  return null;
};

// Helper function to get clarifier label
const getClarifierLabel = (domain: string, clarifierId: string): string => {
  const clarifiers = COACH_CONFIG.clarifiers[domain as keyof typeof COACH_CONFIG.clarifiers];
  return clarifiers?.find(c => c.id === clarifierId)?.label || clarifierId;
};

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
      <span className="text-sm text-slate-500">
        {currentStep === 1 && 'Describe Your Goal'}
        {currentStep === 2 && 'Add Context & Constraints'}
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

const CoachCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-lg ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
        <Brain size={16} className="text-white" />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  </div>
);

const ClarifierChip: React.FC<{ 
  label: string; 
  isSelected: boolean; 
  onClick: () => void 
}> = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isSelected 
        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-md' 
        : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-200'
    }`}
  >
    {label}
  </button>
);

const CategoryChip: React.FC<{ 
  label: string; 
  icon: React.ElementType; 
  color: string 
}> = ({ label, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
      <Icon size={14} />
      {label}
    </div>
  );
};

const ClarityMeter: React.FC<{ score: number }> = ({ score }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-slate-700">Clarity Score</span>
      <span className="text-sm font-semibold text-blue-600">{score}/100</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
    <p className="text-xs text-slate-500">
      Clarity {score}/100 – great foundation for accurate matching.
    </p>
  </div>
);

const ReqDocPreview: React.FC<{ data: typeof COACH_CONFIG.reqDocPreview }> = ({ data }) => (
  <Card className="bg-slate-50 border-slate-200">
    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
      <Target size={16} />
      SmartGrant will normalise your input like this (ReqDoc v1).
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium text-slate-600">Problem:</span>
        <p className="text-slate-800 mt-1">{data.problem}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Goal:</span>
        <p className="text-slate-800 mt-1">{data.goal}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Domain:</span>
        <p className="text-slate-800 mt-1">{data.domain}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Complexity:</span>
        <p className="text-slate-800 mt-1">{data.complexity}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Industry:</span>
        <p className="text-slate-800 mt-1">{data.industry}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Budget Band:</span>
        <p className="text-slate-800 mt-1">S${data.budgetBand[0].toLocaleString()} - S${data.budgetBand[1].toLocaleString()}</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Timeline:</span>
        <p className="text-slate-800 mt-1">{data.timelineMonths[0]}-{data.timelineMonths[1]} months</p>
      </div>
      <div>
        <span className="font-medium text-slate-600">Qualification Score:</span>
        <p className="text-slate-800 mt-1">{data.qualificationScore}%</p>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h5 className="font-medium text-slate-700 mb-2">Grant Predictions:</h5>
      <div className="space-y-2">
        {data.grantPredictions.map((prediction, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{prediction.grant}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {Math.round(prediction.confidence * 100)}% match
              </span>
            </div>
            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title={prediction.reason}>
              <Info size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export const Step1_GoalCapture: React.FC<Step1_GoalCaptureProps> = ({ onNext, onBack }) => {
  const [coachState, setCoachState] = useState<CoachState>({
    stage: "INPUT",
    input: "I want to increase customers for my business"
  });

  const handleDiagnose = () => {
    const domain = detectDomain(coachState.input);
    if (domain) {
      setCoachState(prev => coachActions.diagnose(prev, domain));
    }
  };

  const handleChooseClarifier = (clarifierId: string) => {
    setCoachState(prev => coachActions.chooseClarifier(prev, clarifierId));
  };

  const handleShowSuggestion = () => {
    if (coachState.domain) {
      const template = COACH_CONFIG.suggestionTemplates[coachState.domain];
      setCoachState(prev => coachActions.showSuggestion(prev, template.text));
    }
  };

  const handleApplySuggestion = () => {
    setCoachState(prev => coachActions.applySuggestion(prev));
  };

  const handleShowPreview = () => {
    setCoachState(prev => coachActions.showPreview(prev));
  };

  const handleBackToClarifiers = () => {
    setCoachState(prev => ({ ...prev, stage: "DIAGNOSED" }));
  };

  const handleSubmit = async () => {
    const reqDocId = await mockApi.createReqDoc({
      companyId: 'sme-001',
      problem: COACH_CONFIG.reqDocPreview.problem,
      goal: COACH_CONFIG.reqDocPreview.goal,
      domain: COACH_CONFIG.reqDocPreview.domain,
      complexity: 'LOW',
      budgetBand: COACH_CONFIG.reqDocPreview.budgetBand as [number, number],
      timelineMonths: COACH_CONFIG.reqDocPreview.timelineMonths as [number, number],
      grantRelevant: true,
      trhlsSelectedIds: [],
      visibility: 'PUBLIC',
      qualificationScore: COACH_CONFIG.reqDocPreview.qualificationScore,
      status: 'NEW'
    });
    
    onNext();
  };

  const renderStage = () => {
    switch (coachState.stage) {
      case "INPUT":
        return (
          <div className="space-y-6">
            <div>
              <label className="text-lg font-semibold text-slate-900 mb-2 block">
                Describe what you're trying to achieve
              </label>
              <div className="relative">
                <textarea
                  value={coachState.input}
                  readOnly
                  className="goal-textarea w-full p-4 rounded-xl text-slate-900 resize-none"
                  rows={4}
                />
                <div className="character-counter absolute top-2 right-2 text-xs text-slate-400 bg-white px-2 py-1 rounded-full shadow-sm">
                  {coachState.input.length} characters
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600">
                Tell us your goal in plain language. We'll help refine it.
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={handleDiagnose}
                className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
              >
                Diagnose
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case "DIAGNOSED":
        return (
          <div className="space-y-6">
            <CoachCard>
              <p className="text-sm text-blue-800 font-medium">
                It sounds like a marketing or sales growth issue. Which best fits?
              </p>
            </CoachCard>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {COACH_CONFIG.clarifiers.GROWTH.map(clarifier => (
                  <ClarifierChip
                    key={clarifier.id}
                    label={clarifier.label}
                    isSelected={coachState.clarifierId === clarifier.id}
                    onClick={() => handleChooseClarifier(clarifier.id)}
                  />
                ))}
              </div>

              {coachState.clarifierId && (
                <div className="text-right">
                  <button
                    onClick={handleShowSuggestion}
                    className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
                  >
                    Next: See Coach Suggestion
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "ELABORATED":
        return (
          <div className="space-y-6">
            <CoachCard>
              <p className="text-sm text-blue-800 font-medium">
                Thanks — focusing on {getClarifierLabel(coachState.domain!, coachState.clarifierId!)}.
              </p>
            </CoachCard>

            <div className="text-right">
              <button
                onClick={handleShowSuggestion}
                className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
              >
                Show Coach Suggestion
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case "STRUCTURED":
        const template = COACH_CONFIG.suggestionTemplates[coachState.domain!];
        return (
          <div className="space-y-6">
            <CoachCard>
              <div className="space-y-4">
                <p className="text-sm text-blue-800 font-bold">
                  {template.coachLine}
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-slate-800 font-medium mb-2">Suggested improvement:</p>
                  <p className="text-sm text-slate-700 italic">"{template.text}"</p>
                </div>
                <p className="text-xs text-slate-600">
                  {template.rationale}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleApplySuggestion}
                    className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Apply Suggestion
                  </button>
                  <button
                    onClick={handleBackToClarifiers}
                    className="bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Back to Clarifiers
                  </button>
                </div>
              </div>
            </CoachCard>
          </div>
        );

      case "APPLIED":
        return (
          <div className="space-y-6">
            <div>
              <label className="text-lg font-semibold text-slate-900 mb-2 block">
                Refined Goal
              </label>
              <div className="relative">
                <textarea
                  value={coachState.input}
                  readOnly
                  className="goal-textarea w-full p-4 rounded-xl text-slate-900 resize-none"
                  rows={4}
                />
                <div className="character-counter absolute top-2 right-2 text-xs text-slate-400 bg-white px-2 py-1 rounded-full shadow-sm">
                  {coachState.input.length} characters
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  <CategoryChip label="Growth" icon={TrendingUp} color="green" />
                  <CategoryChip label="Marketing" icon={Target} color="blue" />
                  <CategoryChip label="Digital Transformation" icon={Zap} color="purple" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <ClarityMeter score={82} />
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleShowPreview}
                className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
              >
                Preview Structured Fields
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case "PREVIEW_READY":
        return (
          <div className="space-y-6">
            <ReqDocPreview data={COACH_CONFIG.reqDocPreview} />
            
            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
              >
                Continue → SmartAI Recommends
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Dashboard
      </button>
      
      <PageHeader 
        title="Requirement Capture" 
        subtitle="Help us understand your business goals so we can find the perfect solutions and grants for you." 
      />

      <ProgressBar currentStep={1} totalSteps={3} />

      <Card className="space-y-6">
        {renderStage()}
      </Card>
    </div>
  );
};