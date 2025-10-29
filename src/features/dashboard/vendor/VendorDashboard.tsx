import React, { useState } from 'react';
import { Users, Award, Wallet, ShoppingCart, PlusCircle } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useAppStore } from '../../../state/store';

interface VendorDashboardProps {
  onViewLead: (leadId: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onViewLead }) => {
  const { leads, wallets, currentPersona } = useAppStore();
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  
  const vendorLeads = leads.filter(lead => lead.audience === 'VENDOR');
  const availableLeads = vendorLeads.filter(lead => !lead.acceptedByUserId);
  const acceptedLeads = vendorLeads.filter(lead => lead.acceptedByUserId);
  
  const wallet = wallets.find(w => w.userId === 'user-vendor-1') || { balance: 0 };
  
  const mockQuoteRequests = [
    { id: 1, sme: "Innovate Pte. Ltd.", grant: "EDG", service: "Digital Marketing Campaign", status: "Pending", amount: 15000, feedback: null },
    { id: 2, sme: "Tech Solutions Inc.", grant: "EDG", service: "Digital Marketing Campaign", status: "Submitted", amount: 14500, feedback: null },
    { id: 3, sme: "Creative Minds Agency", grant: "EDG", service: "Digital Marketing Campaign", status: "Accepted", amount: 15200, feedback: "Great value and clear deliverables." }
  ];

  const performance = { 
    engagementRate: 25, 
    avgQuoteTime: 2, 
    totalContractsValue: 250000 
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <PageHeader title="Vendor Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">Quote Requests</h3>
            <Users className="text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">
            {mockQuoteRequests.length}
          </p>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">Engagement Rate</h3>
            <Award className="text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mt-4">
            {performance.engagementRate}%
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Quote Pipeline</h3>
            <button 
              onClick={() => setShowAddLeadModal(true)} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              <PlusCircle size={16} /> Add Lead
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 font-medium">SME</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Feedback</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockQuoteRequests.map(req => (
                  <tr key={req.id} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                      {req.sme}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {req.service}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} type="quote"/>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">
                      {req.feedback || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => onViewLead(req.id.toString())} 
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">My Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-slate-600 dark:text-slate-300">Avg. Quote Time</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {performance.avgQuoteTime} days
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-600 dark:text-slate-300">Total Contracts Value</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                ${performance.totalContractsValue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
