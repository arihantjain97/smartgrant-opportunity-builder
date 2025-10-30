import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  ListChecks,
  FileCheck2,
  Hand, 
  Send,
  Users,
  UsersRound,
  ClipboardCheck,
  Layers,
  Store,
  Inbox,
  Heart,
  CheckCircle
} from 'lucide-react';
import { Card } from './Card';
import { MATCHING_MODES } from '../../state/matching/modes';

interface ModeCardProps {
  mode: keyof typeof MATCHING_MODES;
  isSelected: boolean;
  onSelect: () => void;
  isMobile?: boolean;
}

const iconMap = {
  UserCheck,
  ListChecks,
  FileCheck2,
  Hand,
  Send,
  Users,
  UsersRound,
  ClipboardCheck,
  Layers,
  Store,
  Inbox,
  Heart
};

const getIcon = (iconName: string) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent || UserCheck;
};

const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}> = ({ children, variant = 'default', className = "" }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-indigo-100 text-indigo-700",
    secondary: "bg-slate-100 text-slate-700",
    outline: "bg-emerald-50 text-emerald-700 border border-emerald-200"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const ModeCard: React.FC<ModeCardProps> = ({ 
  mode, 
  isSelected, 
  onSelect, 
  isMobile = false 
}) => {
  const modeData = MATCHING_MODES[mode];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${
        isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : 'bg-white'
      }`}>
        {/* Selection Badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle size={14} className="text-white" />
          </motion.div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 text-lg">{modeData.title}</h3>
          {modeData.recommended && (
            <Badge variant="outline">Recommended</Badge>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {modeData.badges.map((badge: string) => (
            <Badge key={badge} variant="secondary">{badge}</Badge>
          ))}
        </div>

        {/* Flow Row - Iconic */}
        <div className="mb-6">
          <div className="flex justify-between">
            {modeData.roles.map((role: any, index: number) => {
              const Icon = getIcon(role.icon);
              return (
                <motion.div
                  key={role.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <Icon size={18} className="text-indigo-600" />
                  </div>
                  <span className="text-xs text-slate-600 text-center leading-tight">
                    {role.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Outcome Strip */}
        <div className="py-3 border-t border-slate-200 mb-4">
          <p className="text-sm text-slate-600 text-center">{modeData.outcome}</p>
        </div>

        {/* Preview Next Step - Inline Timeline */}
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 mb-3 text-center">Preview next step</p>
          {isMobile ? (
            // Mobile: Horizontal scroll
            <div className="flex gap-4 overflow-x-auto pb-2">
              {modeData.timeline.map((step: any, index: number) => {
                const Icon = getIcon(step.icon);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex flex-col items-center flex-shrink-0 min-w-[80px]"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <Icon size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] text-center text-slate-600 leading-tight">
                      {step.step}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Desktop: Full timeline
            <div className="flex justify-between">
              {modeData.timeline.map((step: any, index: number) => {
                const Icon = getIcon(step.icon);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                      <Icon size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] text-center text-slate-600 leading-tight">
                      {step.step}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};