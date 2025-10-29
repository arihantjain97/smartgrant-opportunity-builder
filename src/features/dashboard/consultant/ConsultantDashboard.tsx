import React, { useState } from 'react';
import { Users, Award, Wallet, ShoppingCart, PlusCircle } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { LeadScoreBadge } from '../../../components/common/LeadScoreBadge';
import { useAppStore } from '../../../state/store';

interface ConsultantDashboardProps {
  onViewLead: (leadId: string) => void;
}

export const ConsultantDashboard: React.FC<ConsultantDashboardProps> = ({ onViewLead }) => {
  const { leads, wallets } = useAppStore();
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  
  const consultantLeads = leads.filter(lead => lead.audience === 'CONSULTANT');
  const availableLeads = consultantLeads.filter(lead => !lead.acceptedByUserId);
  const acceptedLeads = consultantLeads.filter(lead => lead.acceptedByUserId);
  
  const wallet = wallets.find(w => w.userId === 'user-consultant-1') || { balance: 0 };
  
  const mockClients = [ 
    { id: 1, name: "Innovate Pte. Ltd.", grant: "EDG", status: "Proposal Review", deadline: "3 days", appId: 2, probability: 75 }, 
    { id: 2, name: "Global Exports Co.", grant: "MRA Grant", status: "Awaiting Docs", deadline: "5 days", appId: 4, probability: 45 }, 
  ];

  const performance = { 
    winRate: 92, 
    avgTimeToSubmit: 14, 
    totalFundingSecured: 1250000 
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <PageHeader title="Consultant Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">Active Clients</h3>
            <Users className="text-purple-500" />
          </div>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-4">
            {mockClients.length}
          </p>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">Win Rate</h3>
            <Award className="text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mt-4">
            {performance.winRate}%
          </p>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">Lead Credits</h3>
            <Wallet className="text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">
            {wallet.balance}
          </p>
        </Card>
        
        <Card 
          onClick={() => onViewLead('marketplace')} 
          className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-800 dark:text-blue-200">Lead Marketplace</h3>
            <ShoppingCart className="text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-4">
            {availableLeads.length}
          </p>
          <p className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-1">
            New Leads Available →
          </p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Client Pipeline</h3>
            <button 
              onClick={() => setShowAddLeadModal(true)} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              <PlusCircle size={16} /> Add Lead
            </button>
          </div>
          <div className="space-y-2">
            {mockClients.map(client => (
              <div 
                key={client.id} 
                onClick={() => onViewLead(client.appId.toString())} 
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {client.name} ({client.grant})
                  </p>
                  <div className="mt-1">
                    <LeadScoreBadge score={client.probability ?? 55} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-red-500">
                    {client.deadline || 'N/A'}
                  </span>
                  <button className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">My Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-slate-600 dark:text-slate-300">Avg. Time to Submit</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {performance.avgTimeToSubmit} days
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-600 dark:text-slate-300">Total Funding Secured</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                ${performance.totalFundingSecured.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
