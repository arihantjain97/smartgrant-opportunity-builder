import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, FileText, CheckCircle, ArrowRight } from 'lucide-react';

interface PeekNextStepProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: 'CONSULTANT_MANAGED' | 'SME_SELF_MANAGED';
}

const StepCard: React.FC<{ 
  step: number; 
  title: string; 
  description: string; 
  icon: React.ElementType;
  index: number;
}> = ({ step, title, description, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
  >
    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-indigo-600">{step}</span>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-slate-600" />
        <h4 className="font-medium text-slate-900 text-sm">{title}</h4>
      </div>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  </motion.div>
);

export const PeekNextStep: React.FC<PeekNextStepProps> = ({ 
  isOpen, 
  onClose, 
  selectedMode 
}) => {
  const isConsultant = selectedMode === 'CONSULTANT_MANAGED';

  const consultantSteps = [
    {
      step: 1,
      title: "We invite top consultants",
      description: "SmartGrant identifies and invites 3-5 qualified consultants based on your project scope and grant requirements.",
      icon: Users
    },
    {
      step: 2,
      title: "You review proposals",
      description: "Consultants submit detailed proposals with vendor recommendations, timelines, and grant application strategies.",
      icon: FileText
    },
    {
      step: 3,
      title: "Consultant shortlists vendors",
      description: "Your chosen consultant creates a curated shortlist of vendors and manages the invitation process.",
      icon: CheckCircle
    }
  ];

  const selfManagedSteps = [
    {
      step: 1,
      title: "We invite top vendors",
      description: "SmartGrant identifies and invites 5-8 qualified vendors based on your TRHLS selections and requirements.",
      icon: Users
    },
    {
      step: 2,
      title: "You review quotations",
      description: "Vendors submit detailed quotations with pricing, timelines, and implementation plans for your review.",
      icon: FileText
    },
    {
      step: 3,
      title: "We invite consultants (optional)",
      description: "If you need grant support, we can connect you with consultants to assist with applications.",
      icon: CheckCircle
    }
  ];

  const steps = isConsultant ? consultantSteps : selfManagedSteps;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-sky-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">What happens next</h2>
              <p className="text-sm text-slate-600">
                {isConsultant ? 'Consultant-Managed' : 'SME Self-Managed'} workflow
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
                index={index}
              />
            ))}
          </div>

          {/* Reassurance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <p className="text-sm text-emerald-800">
                You can switch modes before invitations are sent out.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Ready to proceed with {isConsultant ? 'consultant-guided' : 'self-managed'} workflow?
            </p>
            <motion.button
              onClick={onClose}
              className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Got it
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
