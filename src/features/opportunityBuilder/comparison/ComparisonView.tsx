import React, { useState } from 'react';
import { ArrowLeft, Check, Star, Award } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { useAppStore } from '../../../state/store';
import { mockApi } from '../../../mocks/api';

interface ComparisonViewProps {
  reqDocId: string;
  onBack: () => void;
}

const ProposalCard: React.FC<{
  proposal: any;
  isSelected: boolean;
  onSelect: () => void;
  onAward: () => void;
}> = ({ proposal, isSelected, onSelect, onAward }) => (
  <Card className={`cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'hover:border-slate-300 dark:hover:border-slate-600'}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{proposal.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{proposal.type}</p>
      </div>
      <div className="flex items-center gap-2">
        {proposal.isTopMatch && (
          <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-full">
            Top Match
          </span>
        )}
        {isSelected && (
          <div className="bg-indigo-600 text-white rounded-full p-1">
            <Check size={16} />
          </div>
        )}
      </div>
    </div>
    
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Scope Summary</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{proposal.summary}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-500 dark:text-slate-400">Timeline:</span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{proposal.timeline}</p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Price:</span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{proposal.price}</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 mt-1 space-y-1">
          {proposal.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <Check size={12} className="text-green-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onSelect}
          className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isSelected
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
        <button
          onClick={onAward}
          className="flex-1 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
        >
          <Award size={14} />
          Award
        </button>
      </div>
    </div>
  </Card>
);

export const ComparisonView: React.FC<ComparisonViewProps> = ({ reqDocId, onBack }) => {
  const { reqDocs, currentPersona } = useAppStore();
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  
  const reqDoc = reqDocs.find(rd => rd.id === reqDocId);
  
  // Mock data for comparison
  const mockProposals = [
    {
      id: 'prop-1',
      name: 'Acme ERP Solutions',
      type: 'Vendor Proposal',
      summary: 'Comprehensive cloud ERP implementation with 24/7 support and training.',
      timeline: '3-4 months',
      price: 'S$22,000 - S$25,000',
      features: ['PSG Pre-approved', 'F&B Industry Experience', '24/7 Support', 'Training Included'],
      isTopMatch: true
    },
    {
      id: 'prop-2',
      name: 'Nova Cloud Systems',
      type: 'Vendor Proposal',
      summary: 'Modern cloud-native ERP with advanced analytics and mobile access.',
      timeline: '2-3 months',
      price: 'S$18,000 - S$22,000',
      features: ['Cloud-Native', 'Advanced Analytics', 'Mobile App', 'API Integration'],
      isTopMatch: false
    },
    {
      id: 'prop-3',
      name: 'Carter Advisory',
      type: 'Consultant Proposal',
      summary: 'End-to-end grant application support with vendor management and compliance.',
      timeline: '4-6 months',
      price: 'S$8,000 - S$12,000',
      features: ['Grant Application', 'Vendor Management', 'Compliance Support', '92% Success Rate'],
      isTopMatch: true
    }
  ];

  const toggleProposal = (proposalId: string) => {
    setSelectedProposals(prev => 
      prev.includes(proposalId) 
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  const handleAward = async (proposalId: string) => {
    const proposal = mockProposals.find(p => p.id === proposalId);
    if (proposal) {
      if (proposal.type === 'Vendor Proposal') {
        await mockApi.awardVendor(reqDocId, 'user-vendor-1');
      } else {
        await mockApi.awardConsultant(reqDocId, 'user-consultant-1');
      }
    }
  };

  if (!reqDoc) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <Card className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Opportunity Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The requested opportunity could not be found.</p>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft size={16} />Back to Dashboard
      </button>
      
      <PageHeader 
        title="Compare Proposals" 
        subtitle={`Review and compare proposals for: ${reqDoc.goal}`}
      />

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <Star className="text-blue-600 dark:text-blue-400" size={20} />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Tip:</span> Compare proposals side-by-side and select the best match for your project. 
            You can select multiple proposals for detailed comparison.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockProposals.map(proposal => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            isSelected={selectedProposals.includes(proposal.id)}
            onSelect={() => toggleProposal(proposal.id)}
            onAward={() => handleAward(proposal.id)}
          />
        ))}
      </div>

      {selectedProposals.length > 0 && (
        <Card className="mt-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Selected for Comparison ({selectedProposals.length})
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            You have selected {selectedProposals.length} proposal(s) for detailed comparison. 
            Use the "Award" button on individual proposals to make your final decision.
          </p>
        </Card>
      )}
    </div>
  );
};
