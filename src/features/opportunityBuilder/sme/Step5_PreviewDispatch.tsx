import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Users, Briefcase, Star, Clock, DollarSign, Shield, Eye, EyeOff, Settings } from 'lucide-react';
import { PageHeader } from '../../../components/common/PageHeader';
import { usePreviewStore } from '../../../state/preview/store';
import { Vendor, Consultant } from '../../../state/preview/types';

interface Step5_PreviewDispatchProps {
  onNext: () => void;
  onBack: () => void;
}

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
      <span className="text-sm text-slate-500">Preview & Dispatch</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);

const SummaryCard: React.FC<{
  vendorCount: number;
  consultantCount: number;
  totalSelected: number;
}> = ({ vendorCount, consultantCount, totalSelected }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 mb-8"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <CheckCircle size={24} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ready to Send Invitations</h3>
          <p className="text-slate-600">Review your selections before dispatching</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-indigo-600">{totalSelected}</div>
        <div className="text-sm text-slate-500">Total Selected</div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Vendors</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{vendorCount}</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-slate-700">Consultants</span>
        </div>
        <div className="text-2xl font-bold text-purple-600">{consultantCount}</div>
      </div>
    </div>
  </motion.div>
);

const VendorCard: React.FC<{
  vendor: Vendor;
  onToggle: (id: string) => void;
}> = ({ vendor, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer ${
      vendor.selected 
        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg' 
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}
    onClick={() => onToggle(vendor.id)}
  >
    {/* Selection Indicator */}
    {vendor.selected && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
        <CheckCircle size={14} className="text-white" />
      </div>
    )}

    {/* Match Badge */}
    <div className="absolute top-4 right-4">
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
        vendor.match >= 85 ? 'bg-green-100 text-green-700' :
        vendor.match >= 70 ? 'bg-blue-100 text-blue-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {vendor.match}% Match
      </div>
    </div>

    <div className="p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          {vendor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{vendor.name}</h3>
          <p className="text-slate-600 text-sm">{vendor.product}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              {vendor.grantTag} Approved
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              {vendor.sector} Sector
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <div>
            <div className="text-sm font-medium text-slate-900">
              S$ {vendor.costRange[0].toLocaleString()}K - {vendor.costRange[1].toLocaleString()}K
            </div>
            <div className="text-xs text-slate-500">Estimated Cost</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <div>
            <div className="text-sm font-medium text-slate-900">
              {vendor.duration[0]} - {vendor.duration[1]} months
            </div>
            <div className="text-xs text-slate-500">Timeline</div>
          </div>
        </div>
      </div>

      {/* Match Reason */}
      <div className="bg-slate-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-slate-700">
          <span className="font-medium">Why matched:</span> {vendor.reason}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {vendor.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const ConsultantCard: React.FC<{
  consultant: Consultant;
  onToggle: (id: string) => void;
}> = ({ consultant, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer ${
      consultant.selected 
        ? 'border-purple-500 bg-purple-50/50 shadow-lg' 
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}
    onClick={() => onToggle(consultant.id)}
  >
    {/* Selection Indicator */}
    {consultant.selected && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <CheckCircle size={14} className="text-white" />
      </div>
    )}

    {/* Match Badge */}
    <div className="absolute top-4 right-4">
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
        consultant.match >= 85 ? 'bg-green-100 text-green-700' :
        consultant.match >= 70 ? 'bg-blue-100 text-blue-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {consultant.match}% Match
      </div>
    </div>

    <div className="p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          {consultant.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{consultant.name}</h3>
          <p className="text-slate-600 text-sm">{consultant.specialty}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              {consultant.experience}
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              {consultant.successRate}% Success Rate
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-500" />
          <div>
            <div className="text-sm font-medium text-slate-900">{consultant.rating} / 5</div>
            <div className="text-xs text-slate-500">Rating</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-purple-600" />
          <div>
            <div className="text-sm font-medium text-slate-900">{consultant.avgTurnaround} days</div>
            <div className="text-xs text-slate-500">Avg Turnaround</div>
          </div>
        </div>
      </div>

      {/* Core Focus */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 mb-2">Core Focus:</p>
        <div className="flex flex-wrap gap-1">
          {consultant.coreFocus.map((focus, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const VisibilitySettings: React.FC<{
  visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC';
  onVisibilityChange: (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => void;
}> = ({ visibility, onVisibilityChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      value: 'PRIVATE' as const,
      label: 'Private',
      description: 'Only you can see this lead',
      icon: Shield
    },
    {
      value: 'LIMITED' as const,
      label: 'Limited',
      description: 'Only matched vendors/consultants',
      icon: Eye
    },
    {
      value: 'PUBLIC' as const,
      label: 'Public',
      description: 'Visible to all SmartGrant users',
      icon: EyeOff
    }
  ];

  const currentOption = options.find(opt => opt.value === visibility);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Settings size={16} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">
          Visibility: {currentOption?.label}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
          >
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onVisibilityChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    visibility === option.value ? 'bg-indigo-50' : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <Icon size={16} className="text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Step5_PreviewDispatch: React.FC<Step5_PreviewDispatchProps> = ({ onNext, onBack }) => {
  const {
    vendors,
    consultants,
    visibility,
    vendorCount,
    consultantCount,
    toggleVendor,
    toggleConsultant,
    setVisibility
  } = usePreviewStore();

  const totalSelected = vendorCount + consultantCount;
  const canDispatch = vendorCount > 0;

  // Filter by match percentage
  const recommendedVendors = vendors.filter(v => v.match >= 80);
  const otherVendors = vendors.filter(v => v.match < 80);
  const recommendedConsultants = consultants.filter(c => c.match >= 80);
  const otherConsultants = consultants.filter(c => c.match < 80);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 md:pb-0">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
      >
        <ArrowLeft size={16} />Back to Matching Mode
      </button>
      
      <PageHeader 
        title="Preview & Dispatch" 
        subtitle="Review your selected vendors and consultants before sending invitations" 
      />

      <ProgressBar currentStep={5} totalSteps={5} />

      {/* Summary Card */}
      <SummaryCard
        vendorCount={vendorCount}
        consultantCount={consultantCount}
        totalSelected={totalSelected}
      />

      {/* Vendors Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Vendors</h2>
            <p className="text-slate-600">Select vendors for your project</p>
          </div>
          <div className="text-sm text-slate-500">
            {vendorCount} of {vendors.length} selected
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onToggle={toggleVendor}
            />
          ))}
        </div>

        {otherVendors.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Other Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onToggle={toggleVendor}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Consultants Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Consultants</h2>
            <p className="text-slate-600">Select consultants for advisory support</p>
          </div>
          <div className="text-sm text-slate-500">
            {consultantCount} of {consultants.length} selected
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedConsultants.map((consultant) => (
            <ConsultantCard
              key={consultant.id}
              consultant={consultant}
              onToggle={toggleConsultant}
            />
          ))}
        </div>

        {otherConsultants.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Other Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherConsultants.map((consultant) => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onToggle={toggleConsultant}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border-t border-slate-200 p-6 rounded-t-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <VisibilitySettings
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
            {!canDispatch && (
              <div className="text-sm text-amber-600">
                Select at least 1 vendor to proceed
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={onNext}
              disabled={!canDispatch}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                canDispatch
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              whileHover={canDispatch ? { scale: 1.02 } : {}}
              whileTap={canDispatch ? { scale: 0.98 } : {}}
            >
              Send Invitations
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};