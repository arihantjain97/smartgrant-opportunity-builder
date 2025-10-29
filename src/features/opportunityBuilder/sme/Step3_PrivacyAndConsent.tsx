import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface Step3_PrivacyAndConsentProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step3_PrivacyAndConsent: React.FC<Step3_PrivacyAndConsentProps> = ({ onNext, onBack }) => {
  const { currentReqDocId } = useAppStore();
  const [visibility, setVisibility] = useState<'PRIVATE' | 'LIMITED' | 'PUBLIC'>('PRIVATE');
  const [allowMatching, setAllowMatching] = useState(false);

  const handleNext = async () => {
    if (currentReqDocId) {
      await mockApi.setVisibility(currentReqDocId, visibility);
    }
    onNext();
  };

  const visibilityOptions = [
    {
      value: 'PRIVATE' as const,
      title: 'Private',
      description: 'Only you can see this opportunity',
      details: 'Perfect for confidential projects or when you want to work with specific partners only.'
    },
    {
      value: 'LIMITED' as const,
      title: 'Limited',
      description: 'Visible to pre-qualified partners',
      details: 'SmartGrant will match you with verified vendors and consultants based on your criteria.'
    },
    {
      value: 'PUBLIC' as const,
      title: 'Public',
      description: 'Visible to all registered partners',
      details: 'Maximum visibility for competitive bidding and finding the best match for your project.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Recommendations
      </button>
      
      <PageHeader 
        title="Privacy & Consent" 
        subtitle="Step 3: Set Your Visibility Preferences. Choose how much information to share with potential partners." 
      />

      <Card className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Visibility Level</h3>
          <div className="space-y-4">
            {visibilityOptions.map(option => (
              <div
                key={option.value}
                onClick={() => setVisibility(option.value)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  visibility === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{option.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                    <p className="text-xs text-slate-500 mt-2">{option.details}</p>
                  </div>
                  {visibility === option.value && (
                    <div className="ml-4 bg-blue-600 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label htmlFor="matching-toggle" className="font-medium text-slate-700">
                Allow Smart Matching
              </label>
              <p className="text-sm text-slate-500 mt-1">
                Let SmartGrant automatically match you with suitable vendors and consultants
              </p>
            </div>
            <button
              id="matching-toggle"
              type="button"
              role="switch"
              aria-checked={allowMatching}
              onClick={() => setAllowMatching(!allowMatching)}
              className={`${allowMatching ? 'bg-blue-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${allowMatching ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        <div className="text-right pt-4 border-t border-slate-200">
          <button
            onClick={handleNext}
            disabled={!allowMatching}
            className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            Continue to Matching Mode
            <ArrowRight size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
};
