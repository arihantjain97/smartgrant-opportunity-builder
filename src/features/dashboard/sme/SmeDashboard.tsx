import React from 'react';
import { CheckCircle, Circle, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/common/Card';
import { MetricTiles } from '../../../components/common/MetricTiles';
import { Pipeline } from '../../../components/common/Pipeline';
import { Launchpad } from '../../../components/common/Launchpad';

interface SmeDashboardProps {
  onStartNewOpportunity: () => void;
}

const ReadinessStep: React.FC<{ text: string; status: 'complete' | 'in_progress' | 'incomplete' }> = ({ text, status }) => {
  const statusMap = {
    complete: { icon: <CheckCircle size={16} className="text-emerald-500" /> },
    in_progress: { icon: <Circle size={16} className="text-amber-500 fill-amber-500" /> },
    incomplete: { icon: <Circle size={16} className="text-slate-400 fill-slate-400" /> },
  };
  
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      {statusMap[status].icon} {text}
    </div>
  );
};

export const SmeDashboard: React.FC<SmeDashboardProps> = ({ onStartNewOpportunity }) => {
  const navigate = useNavigate();
  
  const handleStartNewOpportunity = () => {
    navigate('/sme/builder');
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My Business Snapshot</h2>
        <MetricTiles />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tailored to your company's DNA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {name: "Enterprise Development Grant (EDG)", reason: "Your revenue band & industry qualify for 80% support."}, 
            {name: "Productivity Solutions Grant (PSG)", reason: "Pre-approved IT solutions match your sector."}, 
            {name: "Market Readiness Assistance (MRA)", reason: "Perfect for your planned overseas expansion."}
          ].map(opp => (
            <Card key={opp.name} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 hover:border-blue-300/50">
              <h3 className="font-semibold text-slate-900 text-sm">{opp.name}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{opp.reason}</p>
              <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors">
                Launch Opportunity <ArrowRight size={14}/>
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Launchpad onStartNewOpportunity={handleStartNewOpportunity} />
      </section>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <main className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Opportunity Pipeline</h2>
          <Pipeline />
        </main>
        
        <aside className="xl:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Tasks</h3>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Vendor A awaiting reply <span className="font-medium text-red-600">(2 days left)</span></p>
              <p className="text-sm text-slate-600">Consultant proposal ready for review</p>
              <p className="text-sm text-slate-600">Grant checklist 60% complete</p>
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline w-full text-left transition-colors">View All Tasks →</button>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Grant Readiness</h3>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{width: "60%"}}></div>
            </div>
            <div className="space-y-2">
              <ReadinessStep text="Company Profile" status="complete"/>
              <ReadinessStep text="Quotations" status="complete"/>
              <ReadinessStep text="Implementation Plan" status="in_progress"/>
              <ReadinessStep text="Evidence" status="incomplete"/>
            </div>
            <button className="mt-4 bg-slate-100 w-full py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition-colors">Open Checklist</button>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Credits & Plan</h3>
            <p className="text-slate-600"><span className="text-2xl font-bold text-slate-900">12</span> credits remaining</p>
            <p className="text-xs text-slate-500">Next renewal: Nov 30 2025</p>
            <button className="mt-4 bg-blue-50 w-full py-2 rounded-lg font-medium text-blue-700 hover:bg-blue-100 transition-colors">Buy More Credits</button>
          </Card>
        </aside>
      </div>
      
      <footer className="bg-slate-50 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/60">
        <div className="flex items-start gap-3">
          <BrainCircuit className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">SmartAI Insight:</span> Based on similar SMEs, projects between S$50K–100K saw 3× faster approval.
          </p>
        </div>
        <button className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline text-sm flex-shrink-0 transition-colors">View Insights</button>
      </footer>
    </div>
  );
};
