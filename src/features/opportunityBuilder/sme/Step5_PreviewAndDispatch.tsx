import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Users, Briefcase } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface Step5_PreviewAndDispatchProps {
  onNext: () => void;
  onBack: () => void;
}

const ShortlistCard: React.FC<{
  name: string;
  type: 'vendor' | 'consultant';
  badges: string[];
  whyMatched: string;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ name, type, badges, whyMatched, isSelected, onToggle }) => (
  <Card 
    onClick={onToggle}
    className={`cursor-pointer transition-all ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'hover:border-slate-300'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {type === 'vendor' ? <Users size={16} className="text-blue-500" /> : <Briefcase size={16} className="text-green-500" />}
          <h4 className="font-semibold text-slate-900">{name}</h4>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {badges.map((badge, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700"
            >
              {badge}
            </span>
          ))}
        </div>
        <p className="text-sm text-slate-600">{whyMatched}</p>
      </div>
      {isSelected && (
        <div className="ml-4 bg-indigo-600 text-white rounded-full p-1">
          <Check size={16} />
        </div>
      )}
    </div>
  </Card>
);

export const Step5_PreviewAndDispatch: React.FC<Step5_PreviewAndDispatchProps> = ({ onNext, onBack }) => {
  const { currentReqDocId } = useAppStore();
  const [selectedVendors, setSelectedVendors] = useState<string[]>(['Acme ERP', 'Nova Cloud']);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>(['Carter Advisory']);

  const vendors = [
    {
      name: 'Acme ERP',
      badges: ['Top Match', 'Budget Fit'],
      whyMatched: 'PSG pre-approved • 3 case studies in F&B • Fast deployment'
    },
    {
      name: 'Nova Cloud',
      badges: ['Fastest Deploy', 'Good Support'],
      whyMatched: 'Cloud-native solution • Strong SG/MY support • Competitive pricing'
    },
    {
      name: 'TechFlow Systems',
      badges: ['Enterprise Grade'],
      whyMatched: 'Large-scale implementations • 24/7 support • Custom integrations'
    }
  ];

  const consultants = [
    {
      name: 'Carter Advisory',
      badges: ['Top Match', 'High Success Rate'],
      whyMatched: '92% win rate • 3 years F&B experience • EDG specialist'
    },
    {
      name: 'Aegis Partners',
      badges: ['Fast Turnaround'],
      whyMatched: '14-day avg submission • Grant optimization expert • Local market knowledge'
    }
  ];

  const toggleVendor = (name: string) => {
    setSelectedVendors(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const toggleConsultant = (name: string) => {
    setSelectedConsultants(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleDispatch = async () => {
    if (currentReqDocId) {
      await mockApi.seedMatching(currentReqDocId);
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Matching Mode
      </button>
      
      <PageHeader 
        title="Preview & Dispatch" 
        subtitle="Step 5: Review Your Shortlist. Select the vendors and consultants you'd like to invite to your opportunity." 
      />

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            Recommended Vendors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map(vendor => (
              <ShortlistCard
                key={vendor.name}
                name={vendor.name}
                type="vendor"
                badges={vendor.badges}
                whyMatched={vendor.whyMatched}
                isSelected={selectedVendors.includes(vendor.name)}
                onToggle={() => toggleVendor(vendor.name)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="text-green-500" size={20} />
            Recommended Consultants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultants.map(consultant => (
              <ShortlistCard
                key={consultant.name}
                name={consultant.name}
                type="consultant"
                badges={consultant.badges}
                whyMatched={consultant.whyMatched}
                isSelected={selectedConsultants.includes(consultant.name)}
                onToggle={() => toggleConsultant(consultant.name)}
              />
            ))}
          </div>
        </div>

        <Card className="bg-emerald-50 border-emerald-200">
          <h4 className="font-semibold text-emerald-800 mb-2">Ready to Dispatch</h4>
          <p className="text-sm text-emerald-700">
            You've selected {selectedVendors.length} vendor(s) and {selectedConsultants.length} consultant(s). 
            They will receive masked lead previews and can choose to accept for 1 credit each.
          </p>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={onBack} 
          className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Back
        </button>
        <button 
          onClick={handleDispatch}
          disabled={selectedVendors.length === 0 && selectedConsultants.length === 0}
          className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Dispatch Invitations
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
