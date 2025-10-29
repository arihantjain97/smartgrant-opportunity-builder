import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Target, TrendingUp, Globe, Zap } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { ChatWindow } from '../../../components/coach/ChatWindow';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';
import { COACH_CONFIG } from '../../../state/coach/coachConfig';
import { coachActions, initialCoachState, type CoachState } from '../../../state/coach/coachMachine';

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
      {score < 50 ? 'Low clarity — let\'s refine this together' : 
       score < 80 ? 'Good clarity — almost there' : 
       'Excellent clarity — ready for matching'}
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
              <Target size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export const Step1_GoalCapture: React.FC<Step1_GoalCaptureProps> = ({ onNext, onBack }) => {
  const [coachState, setCoachState] = useState<CoachState>(initialCoachState);

  const handleDiagnose = () => {
    const domain = detectDomain(coachState.input);
    if (domain) {
      setCoachState(prev => coachActions.diagnose(prev, domain));
    }
  };

  const handleChatAction = (actionId: string) => {
    switch (actionId) {
      case 'acquisition':
      case 'retention':
      case 'visibility':
        const label = getClarifierLabel(coachState.domain!, actionId);
        setCoachState(prev => coachActions.chooseClarifier(prev, actionId, label));
        break;
      case 'apply':
        const template = COACH_CONFIG.suggestionTemplates[coachState.domain! as keyof typeof COACH_CONFIG.suggestionTemplates];
        const categories = [...COACH_CONFIG.categoryMap[coachState.domain! as keyof typeof COACH_CONFIG.categoryMap]];
        setCoachState(prev => coachActions.applySuggestion(prev, template.text, categories));
        break;
      case 'back':
        setCoachState(prev => coachActions.backToClarifiers(prev));
        break;
    }
  };

  const handleShowPreview = () => {
    setCoachState(prev => coachActions.showPreview(prev));
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

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Textbox - Always visible at top */}
          <Card>
            <div className="space-y-4">
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

              {coachState.stage === "INPUT" && (
                <div className="text-right">
                  <button
                    onClick={handleDiagnose}
                    className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
                  >
                    Diagnose
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {coachState.stage === "INPUT" && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600">
                    Tell us your goal in plain language. We'll help refine it.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Window - Appears after Diagnose */}
          {coachState.stage !== "INPUT" && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Coach</h3>
              <ChatWindow 
                messages={coachState.messages} 
                onAction={handleChatAction}
              />
            </Card>
          )}

          {/* Preview Section - Shows when applied */}
          {coachState.stage === "PREVIEW_READY" && (
            <ReqDocPreview data={COACH_CONFIG.reqDocPreview} />
          )}
        </div>

        {/* Sidebar - Categories and Clarity */}
        <div className="space-y-6">
          {/* Identified Categories */}
          {coachState.categories.length > 0 && (
            <Card>
              <h4 className="font-semibold text-slate-900 mb-3">Identified Categories</h4>
              <div className="flex flex-wrap gap-2">
                {coachState.categories.map((category, index) => {
                  const iconMap = {
                    'Growth': TrendingUp,
                    'Marketing': Target,
                    'Digital Transformation': Zap
                  };
                  const colorMap = {
                    'Growth': 'green',
                    'Marketing': 'blue',
                    'Digital Transformation': 'purple'
                  };
                  const Icon = iconMap[category as keyof typeof iconMap] || Target;
                  const color = colorMap[category as keyof typeof colorMap] || 'blue';
                  
                  return (
                    <CategoryChip
                      key={index}
                      label={category}
                      icon={Icon}
                      color={color}
                    />
                  );
                })}
              </div>
            </Card>
          )}

          {/* Clarity Score */}
          <Card>
            <h4 className="font-semibold text-slate-900 mb-3">Clarity Score</h4>
            <ClarityMeter score={coachState.clarity} />
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        
        <div className="flex gap-3">
          {coachState.stage === "APPLIED" && (
            <button
              onClick={handleShowPreview}
              className="bg-slate-100 text-slate-700 font-medium px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Preview Structured Fields
            </button>
          )}
          
          {coachState.stage === "PREVIEW_READY" && (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Continue → SmartAI Recommends
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};