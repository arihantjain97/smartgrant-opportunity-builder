import React from 'react';
import { Users, Briefcase, DollarSign } from 'lucide-react';
import { Card } from './Card';
import { LeadScoreBadge } from './LeadScoreBadge';

interface PipelineColumnProps {
  title: string;
  children: React.ReactNode;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ title, children }) => (
  <div className="bg-slate-50 p-4 rounded-xl min-w-[250px] flex-shrink-0 border border-slate-200/60">
    <h4 className="font-medium text-slate-700 mb-4 px-1 text-sm uppercase tracking-wide">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

interface PipelineItemCardProps {
  title: string;
  badge: React.ReactNode;
  vendors: string;
  consultants: string;
  budget: string;
}

const PipelineItemCard: React.FC<PipelineItemCardProps> = ({ title, badge, vendors, consultants, budget }) => (
  <Card className="!p-4 !bg-white border-slate-200/60">
    <div className="flex justify-between items-start mb-3">
      <p className="font-medium text-slate-900 pr-2 text-sm">{title}</p>
      {badge}
    </div>
    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
      <span className="flex items-center gap-1"><Users size={12}/>{vendors}</span>
      <span className="flex items-center gap-1"><Briefcase size={12}/>{consultants}</span>
      <span className="flex items-center gap-1"><DollarSign size={12}/>{budget}</span>
    </div>
  </Card>
);

export const Pipeline: React.FC = () => {
  return (
    <div className="flex gap-4 pb-4 overflow-x-auto">
      <PipelineColumn title="Drafting">
        <PipelineItemCard 
          title="Upgrade ERP System" 
          badge={<LeadScoreBadge score={85} />} 
          vendors="3" 
          consultants="2" 
          budget="S$40k" 
        />
      </PipelineColumn>
      <PipelineColumn title="In Matching">
        <PipelineItemCard 
          title="Marketing Automation Tool" 
          badge={<LeadScoreBadge score={76} />} 
          vendors="5" 
          consultants="1" 
          budget="S$25k" 
        />
      </PipelineColumn>
      <PipelineColumn title="In Q&A">
        <PipelineItemCard 
          title="Cybersecurity Upgrade" 
          badge={<LeadScoreBadge score={68} />} 
          vendors="2" 
          consultants="1" 
          budget="S$30k" 
        />
      </PipelineColumn>
      <PipelineColumn title="Decisioned">
        <PipelineItemCard 
          title="E-Commerce Revamp" 
          badge={
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
              Accepted ✔️
            </span>
          } 
          vendors="1" 
          consultants="1" 
          budget="S$50k" 
        />
      </PipelineColumn>
      <PipelineColumn title="In Delivery">
        <PipelineItemCard 
          title="POS System Installation" 
          badge={
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              Ongoing 🚀
            </span>
          } 
          vendors="1" 
          consultants="0" 
          budget="S$15k" 
        />
      </PipelineColumn>
    </div>
  );
};
