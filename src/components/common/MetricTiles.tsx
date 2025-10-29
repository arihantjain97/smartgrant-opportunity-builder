import React from 'react';
import { LucideIcon, ShieldCheck, Award, DollarSign, FileText } from 'lucide-react';
import { Card } from './Card';

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  gradient: string;
  iconColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, title, value, gradient, iconColor }) => (
  <Card className={`relative overflow-hidden ${gradient} border-0 shadow-sm`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="font-medium text-slate-600 text-sm">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${iconColor} opacity-80`} />
    </div>
  </Card>
);

export const MetricTiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Eligibility Score" 
        value="82%" 
        icon={ShieldCheck} 
        gradient="bg-gradient-to-br from-emerald-50 to-emerald-100" 
        iconColor="text-emerald-600" 
      />
      <KpiCard 
        title="Grants Matched" 
        value="6" 
        icon={Award} 
        gradient="bg-gradient-to-br from-blue-50 to-blue-100" 
        iconColor="text-blue-600" 
      />
      <KpiCard 
        title="Funding Potential" 
        value="S$ 250K" 
        icon={DollarSign} 
        gradient="bg-gradient-to-br from-amber-50 to-amber-100" 
        iconColor="text-amber-600" 
      />
      <KpiCard 
        title="Apps in Progress" 
        value="2" 
        icon={FileText} 
        gradient="bg-gradient-to-br from-violet-50 to-violet-100" 
        iconColor="text-violet-600" 
      />
    </div>
  );
};
