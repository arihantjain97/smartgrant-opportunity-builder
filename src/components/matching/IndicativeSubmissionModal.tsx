import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  User,
  Building2,
  BadgePercent,
  FileCheck2,
  Settings,
  Search
} from 'lucide-react';
import { LeadResponse } from '../../state/matching/types';

interface IndicativeSubmissionModalProps {
  response: LeadResponse | null;
  onClose: () => void;
}

export const IndicativeSubmissionModal: React.FC<IndicativeSubmissionModalProps> = ({ 
  response, 
  onClose 
}) => {
  if (!response || !response.indicativeSubmission) return null;

  const submission = response.indicativeSubmission;
  const isConsultant = response.type === 'CONSULTANT';

  const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }>
    = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-lg font-semibold text-slate-900">{title}</span>
          <span className="text-sm text-slate-500">{open ? 'Hide' : 'Show'}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-3"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{response.name}</h2>
                  <p className="text-indigo-100 text-sm">
                    {response.type === 'VENDOR' ? 'Vendor' : 'Consultant'} Submission
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-300" />
                <span className="text-sm font-medium">{response.qualificationScore}% Match</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-200" />
                <span className="text-sm">
                  Responded in {response.responseTime?.toFixed(1)}h
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Header Summary strip */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {response.type === 'VENDOR' ? (
                <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200 flex items-center gap-1">
                  <Building2 size={14} /> Grant-Applicable
                </div>
              ) : (
                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 flex items-center gap-1">
                  <BadgePercent size={14} /> Grant Fit
                </div>
              )}
              <div className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full flex items-center gap-1">
                <Star size={12} className="text-amber-500" /> {response.qualificationScore}% Match
              </div>
              {submission.tags?.map((t) => (
                <span key={t} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">{t}</span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{submission.title}</h3>
            <p className="text-slate-600 mb-4">{submission.summary}</p>
            
            {/* Consultant vs Vendor sections */}
            {isConsultant ? (
              <>
                {submission.understanding && (
                  <Section title="Understanding of Your Goal">
                    <p className="text-slate-700">{submission.understanding}</p>
                  </Section>
                )}

                {submission.approachPhases && submission.approachPhases.length > 0 && (
                  <Section title="Proposed Approach">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {submission.approachPhases.map((p, idx) => (
                        <div key={idx} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="flex items-center gap-2 mb-1">
                            {p.icon === 'Search' && <Search size={14} className="text-indigo-600" />}
                            {p.icon === 'Settings' && <Settings size={14} className="text-indigo-600" />}
                            {p.icon === 'FileCheck2' && <FileCheck2 size={14} className="text-indigo-600" />}
                            <span className="font-medium text-slate-900">{p.label}</span>
                          </div>
                          <div className="text-xs text-slate-600">{p.weeks}</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                <Section title="Estimated Timeline & Effort">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-800">Timeline</span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        {submission.timeline[0]} - {submission.timeline[1]} months
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-medium text-green-800">Indicative Fee Band</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        S$ {submission.estimatedCost[0].toLocaleString()}K - {submission.estimatedCost[1].toLocaleString()}K
                      </div>
                      <div className="text-xs text-green-700 mt-1">Advisory + Grant Paperwork</div>
                    </div>
                  </div>
                </Section>

                {submission.team && submission.team.length > 0 && (
                  <Section title="Consultant Team">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {submission.team.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                            {m.name.split(' ').map(s=>s[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-600">{m.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {submission.similarProjects && submission.similarProjects.length > 0 && (
                  <Section title="Similar Projects Delivered">
                    <div className="space-y-2">
                      {submission.similarProjects.map((sp, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                          <span className="font-medium">{sp.sector}</span> — {sp.result}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {submission.assumptions && submission.assumptions.length > 0 && (
                  <Section title="Dependencies & Assumptions">
                    <ul className="list-disc ml-5 text-slate-700 space-y-1">
                      {submission.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </Section>
                )}
              </>
            ) : (
              <>
                <Section title="Solution Overview">
                  <p className="text-slate-700">{submission.summary}</p>
                </Section>

                {submission.keyFeatures?.length > 0 && (
                  <Section title="Why This Fits Your Goal">
                    <div className="flex flex-wrap gap-2">
                      {submission.keyFeatures.slice(0,4).map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">{f}</span>
                      ))}
                    </div>
                  </Section>
                )}

                {submission.breakdown && (
                  <Section title="Product / Service Breakdown">
                    <div className="space-y-2">
                      {submission.breakdown.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{b.item}</span>
                          {b.costBand && (
                            <span className="text-sm font-medium text-slate-900">S$ {b.costBand[0].toLocaleString()}K - {b.costBand[1].toLocaleString()}K</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                <Section title="Indicative Cost & Timeline">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-medium text-green-800">Total Cost (non-binding)</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        S$ {submission.estimatedCost[0].toLocaleString()}K - {submission.estimatedCost[1].toLocaleString()}K
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-800">Implementation Timeline</span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        {submission.timeline[0]} - {submission.timeline[1]} months
                      </div>
                    </div>
                  </div>
                </Section>

                {(submission.grantEligible || submission.grantTag) && (
                  <Section title="Grant Eligibility / Status">
                    <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg inline-flex items-center gap-2 text-green-700">
                      <Building2 size={14} />
                      <span>
                        {submission.grantEligible ? 'Eligible' : 'Potentially eligible'} {submission.grantTag ? `(${submission.grantTag})` : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Eligible for up to 50% support, subject to approval.</p>
                  </Section>
                )}

                {(submission.support || submission.addOns) && (
                  <Section title="Support & Add-Ons">
                    {submission.support && (
                      <p className="text-slate-700 mb-2">{submission.support}</p>
                    )}
                    {submission.addOns && (
                      <div className="flex flex-wrap gap-2">
                        {submission.addOns.map((a, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">{a}</span>
                        ))}
                      </div>
                    )}
                  </Section>
                )}
              </>
            )}

            {/* Next Steps (shared) */}
            {submission.nextSteps?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h4>
                <div className="space-y-3">
                  {submission.nextSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with sticky mobile CTA */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 sticky bottom-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                This is an indicative submission. Contact {response.name} for detailed discussions.
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact {response.name}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
