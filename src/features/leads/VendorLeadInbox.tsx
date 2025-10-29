import React, { useState } from 'react';
import { Wallet, Filter, ShoppingCart } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { useAppStore } from '../../state/store';
import { mockApi } from '../../mocks/api';

export const VendorLeadInbox: React.FC = () => {
  const { leads, wallets, currentPersona } = useAppStore();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  
  const vendorLeads = leads.filter(lead => lead.audience === 'VENDOR');
  const availableLeads = vendorLeads.filter(lead => !lead.acceptedByUserId);
  const acceptedLeads = vendorLeads.filter(lead => lead.acceptedByUserId);
  
  const wallet = wallets.find(w => w.userId === 'user-vendor-1') || { balance: 0 };

  const unlockContact = async (leadId: string) => {
    setUnlockingId(leadId);
    try {
      await mockApi.acceptLead(leadId, 'user-vendor-1');
    } catch (error) {
      console.error('Failed to accept lead:', error);
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Lead Marketplace" 
        subtitle="Purchase qualified leads to grow your business."
      >
        <div className="mt-4 md:mt-0 flex items-center gap-4 p-3 rounded-lg bg-green-100 dark:bg-green-500/20">
          <Wallet className="text-green-700 dark:text-green-300" />
          <span className="font-bold text-green-800 dark:text-green-200">
            {wallet.balance} Credits Available
          </span>
          <button className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700">
            +
          </button>
        </div>
      </PageHeader>
      
      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Filter size={18}/> Filters:
        </h3>
        <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600">
          <option>Sector: All</option>
          <option>F&B</option>
          <option>Logistics</option>
        </select>
        <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600">
          <option>Type: All</option>
          <option>Grant</option>
          <option>Non-grant</option>
        </select>
        <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600">
          <option>Budget: All</option>
          <option>$10k-20k</option>
          <option>$20k+</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableLeads.length > 0 ? availableLeads.map(lead => (
          <Card key={lead.id} className="flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  F&B Company Opportunity
                </h3>
                <LeadScoreBadge score={lead.qualificationScore} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Interest: {lead.maskedPreview.grantTag || 'General'}
              </p>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                {lead.maskedPreview.summary}
              </p>
              <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                <p>Budget: S${lead.maskedPreview.budgetBand[0].toLocaleString()} - S${lead.maskedPreview.budgetBand[1].toLocaleString()}</p>
                <p>Urgency: {lead.maskedPreview.urgency}</p>
              </div>
            </div>
            <button
              disabled={unlockingId === lead.id || wallet.balance < lead.priceCredits}
              onClick={() => unlockContact(lead.id)}
              className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                ${unlockingId === lead.id 
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-wait' 
                  : wallet.balance < lead.priceCredits
                  ? 'bg-red-300 dark:bg-red-700 text-red-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              <ShoppingCart size={18} />
              {unlockingId === lead.id 
                ? 'Processing…' 
                : wallet.balance < lead.priceCredits
                ? 'Insufficient Credits'
                : `Accept Lead (${lead.priceCredits} credit${lead.priceCredits > 1 ? 's' : ''})`
              }
            </button>
          </Card>
        )) : (
          <Card className="md:col-span-2 lg:col-span-3 text-center">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Leads Available</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Please check back later for new opportunities.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
