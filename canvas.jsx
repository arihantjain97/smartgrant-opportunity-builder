import React, { useState, useEffect } from 'react';
import { Briefcase, Sun, Moon, ArrowRight, User, Building, Award, UploadCloud, Eye, CheckCircle, Mail, Phone, Linkedin, ArrowLeft, Info, HelpCircle, Check, RotateCcw, FileText, DollarSign, Target, Users, FileSignature, Database, TrendingUp, ShoppingCart, Wallet, Paperclip, Send, Edit3, UserCheck, UserX, LayoutDashboard, ChevronRight, Zap, ShieldCheck, FilePlus, BarChartHorizontal, Filter, XCircle, PlusCircle, Bell, MessageSquare, CircleDollarSign, Rocket, Circle, BrainCircuit, Clock } from 'lucide-react';

// --- MOCK DATA ---
const mockSmeData = {
    applications: [
        { id: 1, grantName: "Productivity Solutions Grant (PSG)", status: "Approved", smeName: "Innovate Pte. Ltd.", grantType: "PSG" },
        { id: 2, grantName: "Enterprise Development Grant (EDG)", status: "In Review", smeName: "Innovate Pte. Ltd.", grantType: "EDG", probability: 75 },
        { id: 3, grantName: "Market Readiness Assistance (MRA) Grant", status: "Drafting", smeName: "Innovate Pte. Ltd.", grantType: "MRA", probability: 85 },
    ],
};
const initialConsultantData = {
    clients: [ 
        { id: 1, name: "Innovate Pte. Ltd.", grant: "EDG", status: "Proposal Review", deadline: "3 days", appId: 2, probability: 75 }, 
        { id: 2, name: "Global Exports Co.", grant: "MRA Grant", status: "Awaiting Docs", deadline: "5 days", appId: 4, probability: 45 }, 
    ],
    performance: { winRate: 92, avgTimeToSubmit: 14, totalFundingSecured: 1250000 }
};
const initialVendorData = {
    quoteRequests: [ { id: 1, sme: "Innovate Pte. Ltd.", grant: "EDG", service: "Digital Marketing Campaign", status: "Pending", amount: 15000, feedback: null }, { id: 2, sme: "Tech Solutions Inc.", grant: "EDG", service: "Digital Marketing Campaign", status: "Submitted", amount: 14500, feedback: null }, { id: 3, sme: "Creative Minds Agency", grant: "EDG", service: "Digital Marketing Campaign", status: "Accepted", amount: 15200, feedback: "Great value and clear deliverables." } ],
    performance: { engagementRate: 25, avgQuoteTime: 2, totalContractsValue: 250000 }
};
const mockAdminData = {
    users: [ { id: 'b1c2d3e4-0011-4011-8011-111111111111', name: "Innovate Pte. Ltd.", role: "SME", status: "Active", joined: "2024-03-12", email: "prakash@mai.com", isVerified: true }, { id: 'b1c2d3e4-0022-4022-8022-222222222222', name: "John Carter", role: "Consultant", status: "Active", joined: "2024-04-01", email: "john.carter@consultants.com", isVerified: true }, { id: 'b1c2d3e4-0044-4044-8044-444444444444', name: "New Ventures LLC", role: "SME", status: "Pending Approval", joined: "2024-07-10", email: "new@ventures.com", isVerified: false } ]
};
const mockLeads = [
    { id: 1, title: "SME in F&B Sector", grantInterest: "PSG", summary: "Looking for a pre-approved POS system.", price: 50, status: 'Available', qualityScore: 88 },
    { id: 2, title: "Logistics company", grantInterest: "EDG", summary: "Wants to expand into the Malaysian market.", price: 150, status: 'Available', qualityScore: 92 },
];

// --- HELPER COMPONENTS ---
const Card = ({ children, className = "", onClick }) => ( <div onClick={onClick} className={`bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4 sm:p-6 transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`}>{children}</div> );
const StatusBadge = ({ status, type = 'application' }) => {
    const styles = {
        application: { "Approved": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300", "In Review": "bg-yellow-100 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300", "Drafting": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300" },
        task: { "High": "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300", "Medium": "bg-yellow-100 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300", "Low": "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300" },
        quote: { "Pending": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300", "Submitted": "bg-yellow-100 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300", "Accepted": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300" },
        user: { "Active": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300", "Pending Approval": "bg-yellow-100 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300" },
    };
    const statusClass = styles[type]?.[status] || 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    return <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${statusClass}`}>{status}</span>;
};
const LeadScoreBadge = ({ score=68, statusText }) => {
  const status = statusText || (score >= 80 ? "Hot" : score >= 60 ? "Warm" : "Cold");
  const color = status === "Hot" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
    : status === "Warm" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
    : "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200";
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>{status}</span>
      <span className="text-xs text-slate-500">Score {score}</span>
    </div>
  );
};
const ConsentChip = ({ ok=true }) => (
  <span className={`px-2 py-0.5 text-[10px] rounded-full ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
    {ok ? 'Consent OK' : 'Anonymized'}
  </span>
);
const PageHeader = ({ title, subtitle, children }) => ( <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6"> <div> <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h2> {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>} </div> <div className="mt-4 lg:mt-0 w-full lg:w-auto">{children}</div> </div> );
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {children}
        </div>
        <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
);

// --- NEW SME DASHBOARD MOCKUP ---
const SmeDashboardMockup = ({ setView }) => {
    const KpiCard = ({ icon: Icon, title, value, gradient, iconColor }) => (
        <Card className={`relative overflow-hidden ${gradient}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{title}</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
                </div>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
        </Card>
    );

    const PipelineColumn = ({ title, children }) => (
        <div className="bg-slate-100/80 dark:bg-slate-900/50 p-3 rounded-xl min-w-[250px] flex-shrink-0">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 px-1">{title}</h4>
            <div className="space-y-3">{children}</div>
        </div>
    );
    
    const PipelineItemCard = ({ title, badge, vendors, consultants, budget }) => (
        <Card className="!p-4">
            <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 dark:text-slate-200 pr-2">{title}</p>
                {badge}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span><Users size={12} className="inline mr-1"/>{vendors}</span>
                <span><Briefcase size={12} className="inline mr-1"/>{consultants}</span>
                <span><DollarSign size={12} className="inline mr-1"/>{budget}</span>
            </div>
        </Card>
    );
    
    const ReadinessStep = ({ text, status }) => {
        const statusMap = {
            complete: { icon: <CheckCircle size={16} className="text-green-500" /> },
            in_progress: { icon: <Circle size={16} className="text-yellow-500 fill-yellow-500" /> },
            incomplete: { icon: <Circle size={16} className="text-red-500 fill-red-500" /> },
        };
        return <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">{statusMap[status].icon} {text}</div>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <section>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">My Business Snapshot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Eligibility Score" value="82 %" icon={ShieldCheck} gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50" iconColor="text-blue-500" />
                    <KpiCard title="Grants Matched" value="6" icon={Award} gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/50" iconColor="text-green-500" />
                    <KpiCard title="Funding Potential" value="S$ 250 K" icon={DollarSign} gradient="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/50" iconColor="text-yellow-500" />
                    <KpiCard title="Apps in Progress" value="2" icon={FileText} gradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50" iconColor="text-purple-500" />
                </div>
            </section>
            
            <section>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Tailored to your company’s DNA</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[{name: "Enterprise Development Grant (EDG)", reason: "Your revenue band & industry qualify for 80% support."}, {name: "Productivity Solutions Grant (PSG)", reason: "Pre-approved IT solutions match your sector."}, {name: "Market Readiness Assistance (MRA)", reason: "Perfect for your planned overseas expansion."}].map(opp => (
                        <Card key={opp.name} className="bg-yellow-50/50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20">
                            <h3 className="font-bold text-yellow-800 dark:text-yellow-200">{opp.name}</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">{opp.reason}</p>
                            <button className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">Launch Opportunity <ArrowRight size={14}/></button>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <Card className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/50">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">✨ Launchpad</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Turn your business goals into a live project.</p>
                    <button 
                        onClick={() => setView({ page: 'REQUIREMENT_CAPTURE_STEP_1' })}
                        className="mt-4 bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                    >
                        Start New Opportunity
                    </button>
                </Card>
            </section>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <main className="xl:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Opportunity Pipeline</h2>
                    <div className="flex gap-4 pb-4 overflow-x-auto">
                        <PipelineColumn title="Drafting">
                            <PipelineItemCard title="Upgrade ERP System" badge={<LeadScoreBadge score={85} />} vendors="3" consultants="2" budget="S$40k" />
                        </PipelineColumn>
                        <PipelineColumn title="In Matching">
                            <PipelineItemCard title="Marketing Automation Tool" badge={<LeadScoreBadge score={76} />} vendors="5" consultants="1" budget="S$25k" />
                        </PipelineColumn>
                        <PipelineColumn title="In Q&A">
                            <PipelineItemCard title="Cybersecurity Upgrade" badge={<LeadScoreBadge score={68} />} vendors="2" consultants="1" budget="S$30k" />
                        </PipelineColumn>
                        <PipelineColumn title="Decisioned">
                           <PipelineItemCard title="E-Commerce Revamp" badge={<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">Accepted ✔️</span>} vendors="1" consultants="1" budget="S$50k" />
                        </PipelineColumn>
                        <PipelineColumn title="In Delivery">
                            <PipelineItemCard title="POS System Installation" badge={<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">Ongoing 🚀</span>} vendors="1" consultants="0" budget="S$15k" />
                        </PipelineColumn>
                    </div>
                </main>
                
                <aside className="xl:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Active Tasks</h3>
                        <div className="space-y-3">
                            <p className="text-sm text-slate-700 dark:text-slate-300">Vendor A awaiting reply <span className="font-semibold text-red-500">(2 days left)</span></p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">Consultant proposal ready for review</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">Grant checklist 60% complete</p>
                        </div>
                        <button className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline w-full text-left">View All Tasks →</button>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Grant Readiness</h3>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: "60%"}}></div>
                        </div>
                        <div className="space-y-2">
                           <ReadinessStep text="Company Profile" status="complete"/>
                           <ReadinessStep text="Quotations" status="complete"/>
                           <ReadinessStep text="Implementation Plan" status="in_progress"/>
                           <ReadinessStep text="Evidence" status="incomplete"/>
                        </div>
                        <button className="mt-4 bg-slate-200 dark:bg-slate-700 w-full py-2 rounded-lg font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600">Open Checklist</button>
                    </Card>
                     <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Credits & Plan</h3>
                        <p className="text-slate-600 dark:text-slate-300"><span className="text-2xl font-bold text-slate-800 dark:text-slate-100">12</span> credits remaining</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Next renewal: Nov 30 2025</p>
                        <button className="mt-4 bg-indigo-100 dark:bg-indigo-500/20 w-full py-2 rounded-lg font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30">Buy More Credits</button>
                    </Card>
                </aside>
            </div>
            
            <footer className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <BrainCircuit className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-semibold text-slate-800 dark:text-slate-100">SmartAI Insight:</span> Based on similar SMEs, projects between S$50K–100K saw 3× faster approval.</p>
                </div>
                <button className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-sm flex-shrink-0">View Insights</button>
            </footer>
        </div>
    );
};

// --- NEW REQUIREMENT CAPTURE PAGE ---
const RequirementCaptureStep1 = ({ setView }) => {
    const [isGrantRelated, setIsGrantRelated] = useState(true);

    const FormRow = ({ icon: Icon, label, children }) => (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Icon size={16} className="text-slate-500" />
                {label}
            </label>
            {children}
        </div>
    );
    
    const Select = ({ children }) => (
        <select className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200">
            {children}
        </select>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button onClick={() => setView({ page: 'DASHBOARD', tab: 'DASHBOARD' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft size={16} />Back to Dashboard
            </button>
            
            <PageHeader title="Requirement Capture" subtitle="Step 1: Describe Your Goal. Capture your intent in plain language, avoiding grant jargon." />

            <Card className="space-y-6">
                <div>
                    <label htmlFor="goal-description" className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 block">
                        Describe what you’re trying to achieve
                    </label>
                    <textarea
                        id="goal-description"
                        rows="5"
                        className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="e.g., 'We want to upgrade our old accounting software to a cloud-based ERP system to automate invoicing and track inventory.' or 'We need to launch a digital marketing campaign to expand into Malaysia.'"
                    ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormRow icon={Briefcase} label="Industry">
                        <Select>
                            <option>Food & Beverage</option>
                            <option>Retail</option>
                            <option>Logistics</option>
                            <option>Manufacturing</option>
                            <option>IT & Communications</option>
                        </Select>
                    </FormRow>

                    <FormRow icon={DollarSign} label="Estimated Budget Band">
                        <Select>
                            <option>S$10,000 - S$25,000</option>
                            <option>S$25,001 - S$50,000</option>
                            <option>S$50,001 - S$100,000</option>
                            <option>S$100,000+</option>
                            <option>Unsure</option>
                        </Select>
                    </FormRow>

                    <FormRow icon={Clock} label="Estimated Timeline">
                        <Select>
                            <option>Within 3 months</option>
                            <option>3 - 6 months</option>
                            <option>6 - 12 months</option>
                            <option>Flexible</option>
                        </Select>
                    </FormRow>

                    <FormRow icon={Zap} label="Urgency">
                        <Select>
                            <option>High (ASAP)</option>
                            <option>Medium (This quarter)</option>
                            <option>Low (Planning for next year)</option>
                        </Select>
                    </FormRow>
                </div>

                <div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <label htmlFor="grant-toggle" className="font-medium text-slate-700 dark:text-slate-300">
                            Is this related to a government grant?
                        </label>
                        <button
                            id="grant-toggle"
                            role="switch"
                            aria-checked={isGrantRelated}
                            onClick={() => setIsGrantRelated(!isGrantRelated)}
                            className={`${isGrantRelated ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            <span
                                aria-hidden="true"
                                className={`${isGrantRelated ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                        </button>
                    </div>
                    {isGrantRelated && (
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-b-lg border border-t-0 border-indigo-200 dark:border-indigo-800">
                            <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                <span className="font-semibold">SmartAI Suggests:</span> Based on your goal, this might fit the <strong>Enterprise Development Grant (EDG)</strong>.
                            </p>
                        </div>
                    )}
                </div>

                <div className="text-right pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setView({ page: 'AI_RECOMMENDATIONS_STEP_2' })}
                        className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto"
                    >
                        Continue → SmartAI Recommends
                        <ArrowRight size={18} />
                    </button>
                </div>
            </Card>
        </div>
    );
};

// --- NEW AI RECOMMENDATIONS PAGE ---
const AiRecommendationsStep2 = ({ setView }) => {
    const [selectedSolutions, setSelectedSolutions] = useState([]);

    const toggleSolution = (id) => {
        setSelectedSolutions(prev => 
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const recommendations = [
        {
            id: 1,
            name: "Cloud ERP Implementation",
            grant: "✅ PSG",
            grantTooltip: "Productivity Solutions Grant (PSG) supports pre-approved IT solutions for SMEs.",
            whyFit: "Matches your F&B industry & budget for pre-approved systems.",
            cost: "S$20,000 - S$25,000",
            duration: "3-4 mos"
        },
        {
            id: 2,
            name: "Targeted Digital Marketing Campaign",
            grant: "✅ EDG",
            grantTooltip: "Enterprise Development Grant (EDG) supports projects that help you upgrade, innovate or expand overseas.",
            whyFit: "Ideal for your goal to expand into Malaysia (Market Access).",
            cost: "S$40,000 - S$50,000",
            duration: "6 mos"
        },
        {
            id: 3,
            name: "Custom Website Dev (Non-Grant)",
            grant: "❌ Non-Grant",
            grantTooltip: "Custom development without pre-approved templates typically does not qualify for PSG.",
            whyFit: "Full custom control, but not aligned with grant support.",
            cost: "S$15,000 - S$20,000",
            duration: "2-3 mos"
        }
    ];

    const Tooltip = ({ text, children }) => (
        <span className="relative group">
            {children}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {text}
            </span>
        </span>
    );

    const SolutionCard = ({ rec, onSelect, isSelected }) => (
        <Card 
            onClick={onSelect} 
            className={`flex flex-col relative !p-0 border-2 ${isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-800/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
        >
            {isSelected && (
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-1.5 shadow-md">
                    <Check size={18} />
                </div>
            )}
            
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-8">{rec.name}</h3>
                
                <div className="flex items-center gap-2 mt-2">
                    <span className={`font-semibold ${rec.grant.startsWith('✅') ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                        {rec.grant}
                    </span>
                    <Tooltip text={rec.grantTooltip}>
                        <Info size={14} className="text-slate-500 cursor-help" />
                    </Tooltip>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 h-10">{rec.whyFit}</p>
            </div>
            
            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Est. Cost</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rec.cost}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Est. Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rec.duration}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <button onClick={() => setView({ page: 'REQUIREMENT_CAPTURE_STEP_1' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft size={16} />Back to Goal Description
            </button>
            
            <PageHeader title="AI Recommendations" subtitle="Step 2: Review Tailored Solutions. Select one or two pathways that best fit your goal." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(rec => (
                    <SolutionCard 
                        key={rec.id}
                        rec={rec}
                        onSelect={() => toggleSolution(rec.id)}
                        isSelected={selectedSolutions.includes(rec.id)}
                    />
                ))}
            </div>

            {/* --- Other Settings section removed as requested --- */}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setView({ page: 'REQUIREMENT_CAPTURE_STEP_1' })} 
                    className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                    Back
                </button>
                <button 
                    disabled={selectedSolutions.length === 0}
                    onClick={() => setView({ page: 'MATCHING_SETUP_STEP_3' })}
                    className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                    Proceed to Matching Setup
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

// --- NEW MATCHING SETUP PAGE ---
const MatchingSetupStep3 = ({ setView }) => {
    const [selectedMode, setSelectedMode] = useState('Consultant-Managed');

    const ModeCard = ({ mode, title, description, pros, cons, isSelected, onSelect }) => (
        <Card 
            onClick={() => onSelect(mode)}
            className={`flex flex-col relative !p-0 border-2 ${isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-800/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
        >
             {isSelected && (
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-1.5 shadow-md">
                    <Check size={18} />
                </div>
            )}
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-8">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{description}</p>
            </div>
            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-b-xl border-t border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">Pros:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {pros.map(pro => <li key={pro}>{pro}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">Cons:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {cons.map(con => <li key={con}>{con}</li>)}
                    </ul>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button onClick={() => setView({ page: 'AI_RECOMMENDATIONS_STEP_2' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft size={16} />Back to Recommendations
            </button>
            
            <PageHeader title="Matching Setup" subtitle="Step 3: Choose Your Workflow Mode. How would you like to manage this opportunity?" />

            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-3 mb-6">
                <Zap size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Recommendation:</span> Based on your project scope, we suggest <strong>Consultant-Managed</strong> for a guided experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModeCard
                    mode="Consultant-Managed"
                    title="Consultant-Managed (Recommended)"
                    description="A grant consultant will guide you, shortlist vendors, and manage the application."
                    pros={["Expert guidance", "Higher success rate", "Less work for you"]}
                    cons={["Consultant fees apply", "Less direct control"]}
                    isSelected={selectedMode === 'Consultant-Managed'}
                    onSelect={setSelectedMode}
                />
                <ModeCard
                    mode="SME Self-Managed"
                    title="SME Self-Managed"
                    description="You manage the process, shortlist vendors, and prepare the application yourself."
                    pros={["Full control", "No consultant fees"]}
                    cons={["More time-consuming", "Higher risk of errors", "Requires grant knowledge"]}
                    isSelected={selectedMode === 'SME Self-Managed'}
                    onSelect={setSelectedMode}
                />
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setView({ page: 'AI_RECOMMENDATIONS_STEP_2' })} 
                    className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                    Back
                </button>
                <button 
                    // Add next step logic here
                    // onClick={() => setView({ page: 'NEXT_STEP' })}
                    className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ml-auto"
                >
                    Continue with Selected Mode
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};


// --- OTHER DASHBOARDS (UNCHANGED) ---
const ConsultantDashboard = ({ setView, consultantData, addConsultantLead }) => {
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    return (
        <>
        {showAddLeadModal && <AddLeadModal onAddLead={addConsultantLead} onClose={() => setShowAddLeadModal(false)} />}
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            <PageHeader title="Consultant Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Active Clients</h3><Users className="text-purple-500" /></div><p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-4">{consultantData.clients.length}</p></Card>
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Win Rate</h3><Award className="text-teal-500" /></div><p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mt-4">{consultantData.performance.winRate}%</p></Card>
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Lead Credits</h3><Wallet className="text-green-500" /></div><p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">12</p></Card>
                <Card onClick={() => setView({page: 'DASHBOARD', tab: 'MARKETPLACE'})} className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-blue-800 dark:text-blue-200">Lead Marketplace</h3><ShoppingCart className="text-blue-500" /></div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-4">{mockLeads.filter(l => l.status === 'Available').length}</p>
                    <p className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-1">New Leads Available →</p>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Client Pipeline</h3>
                        <button onClick={() => setShowAddLeadModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                            <PlusCircle size={16} /> Add Lead
                        </button>
                    </div>
                    <div className="space-y-2">{consultantData.clients.map(client => (<div key={client.id} onClick={() => setView({ page: 'CONSULTANT_APP_DETAIL', itemId: client.appId })} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><p className="font-semibold text-slate-700 dark:text-slate-200">{client.name} ({client.grant})</p><div className="mt-1"><LeadScoreBadge score={client.probability ?? 55} /></div></div><div className="flex items-center gap-4"><span className="text-sm font-medium text-red-500">{client.deadline || 'N/A'}</span><button className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Manage</button></div></div>))}</div>
                </Card>
                <Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">My Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center"><p className="text-slate-600 dark:text-slate-300">Avg. Time to Submit</p><p className="font-bold text-slate-800 dark:text-slate-100">{consultantData.performance.avgTimeToSubmit} days</p></div>
                        <div className="flex justify-between items-center"><p className="text-slate-600 dark:text-slate-300">Total Funding Secured</p><p className="font-bold text-slate-800 dark:text-slate-100">${consultantData.performance.totalFundingSecured.toLocaleString()}</p></div>
                    </div>
                </Card>
            </div>
        </div>
        </>
    );
};
const VendorDashboard = ({ setView, vendorData, addVendorLead }) => {
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    return (
        <>
        {showAddLeadModal && <AddLeadModal onAddLead={addVendorLead} onClose={() => setShowAddLeadModal(false)} isVendor={true} />}
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            <PageHeader title="Vendor Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Quote Requests</h3><FileSignature className="text-green-500" /></div><p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">{vendorData.quoteRequests.length}</p></Card>
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Engagement Rate</h3><Award className="text-teal-500" /></div><p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mt-4">{vendorData.performance.engagementRate}%</p></Card>
                <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Lead Credits</h3><Wallet className="text-green-500" /></div><p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">5</p></Card>
                <Card onClick={() => setView({page: 'DASHBOARD', tab: 'MARKETPLACE'})} className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-blue-800 dark:text-blue-200">Lead Marketplace</h3><ShoppingCart className="text-blue-500" /></div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-4">{mockLeads.filter(l => l.status === 'Available').length}</p>
                    <p className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-1">New Leads Available →</p>
                </Card>
            </div>
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Quote Pipeline</h3>
                    <button onClick={() => setShowAddLeadModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                        <PlusCircle size={16} /> Add Lead
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50"><tr><th className="px-4 py-3 font-medium">SME</th><th className="px-4 py-3 font-medium">Service</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Feedback</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
                        <tbody>
                            {vendorData.quoteRequests.map(req => (
                                <tr key={req.id} className="border-b border-slate-200 dark:border-slate-700">
                                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{req.sme}</td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{req.service}</td>
                                    <td className="px-4 py-3"><StatusBadge status={req.status} type="quote"/></td>
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">{req.feedback || 'N/A'}</td>
                                    <td className="px-4 py-3"><button onClick={() => setView({ page: 'QUOTE_DETAIL', itemId: req.id })} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
        </>
    );
};
const AdminDashboard = ({ setView }) => ( <div className="space-y-6 md:space-y-8 animate-fade-in"> <PageHeader title="System Administration" /> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Total Users</h3><Users className="text-slate-500" /></div><p className="text-4xl font-bold text-slate-800 dark:text-slate-200 mt-4">{mockAdminData.users.length}</p></Card> <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Active Grants</h3><Database className="text-blue-500" /></div><p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-4">3</p></Card> <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Monthly Revenue</h3><TrendingUp className="text-green-500" /></div><p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-4">$12,450</p></Card> <Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-600 dark:text-slate-300">Lead Sales</h3><DollarSign className="text-yellow-500" /></div><p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-4">$1,250</p></Card> </div> <Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">User Management</h3><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody>{mockAdminData.users.map(user => (<tr key={user.id} className="border-b border-slate-200 dark:border-slate-700"><td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{user.name}</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.role}</td><td className="px-4 py-3"><StatusBadge status={user.status} type="user"/></td><td className="px-4 py-3"><button onClick={() => setView({ page: 'USER_DETAIL', itemId: user.id })} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Manage</button></td></tr>))}</tbody></table></div></Card> </div> );
const LeadMarketplace = ({ role }) => {
    const [unlockingId, setUnlockingId] = useState(null);

    async function unlockContact(id) {
      setUnlockingId(id);
      // TODO: call backend to create Stripe checkout session
      await new Promise(r => setTimeout(r, 1200)); // mock
      setUnlockingId(null);
      alert("Contact unlocked (mock).");
    }

    return ( 
    <div className="animate-fade-in"> 
        <PageHeader title="Lead Marketplace" subtitle="Purchase qualified leads to grow your business."> 
            <div className="mt-4 md:mt-0 flex items-center gap-4 p-3 rounded-lg bg-green-100 dark:bg-green-500/20"><Wallet className="text-green-700 dark:text-green-300" /><span className="font-bold text-green-800 dark:text-green-200">{role === 'CONSULTANT' ? 12 : 5} Credits Available</span><button className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700">+</button></div> 
        </PageHeader>
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"><Filter size={18}/> Filters:</h3>
            <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600"><option>Sector: All</option><option>F&B</option><option>Logistics</option></select>
            <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600"><option>Type: All</option><option>Grant</option><option>Non-grant</option></select>
            <select className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md text-sm border border-slate-200 dark:border-slate-600"><option>Budget: All</option><option>$10k-20k</option><option>$20k+</option></select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {mockLeads.filter(l => l.status === 'Available').length > 0 ? mockLeads.filter(l => l.status === 'Available').map(lead => (
                <Card key={lead.id} className="flex flex-col">
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{lead.title}</h3>
                            <LeadScoreBadge score={lead.qualityScore} />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Interest: {lead.grantInterest}</p>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">{lead.summary}</p>
                    </div>
                    <button
                      disabled={unlockingId === lead.id}
                      onClick={() => unlockContact(lead.id)}
                      className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                        ${unlockingId===lead.id ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-wait' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      <ShoppingCart size={18} />
                      {unlockingId===lead.id ? 'Processing…' : `Unlock Contact ($${lead.price})`}
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
)};

// --- DRILL-DOWN VIEWS ---
const ApplicationDetailView = ({ app, setView, role = 'SME' }) => {
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const timelineSteps = [
        { name: 'Drafting', status: 'complete' },
        { name: 'Verification', status: app.status === 'Drafting' ? 'current' : 'complete' },
        { name: 'Submitted', status: app.status === 'In Review' || app.status === 'Approved' ? 'complete' : 'upcoming' },
        { name: 'In Review', status: app.status === 'In Review' || app.status === 'Approved' ? 'complete' : 'upcoming' },
        { name: 'Approved', status: app.status === 'Approved' ? 'complete' : 'upcoming' },
    ];
    return (
        <div className="animate-fade-in">
            {showProposalModal && <AIProposalModal onClose={() => setShowProposalModal(false)} />}
            {showCompareModal && <QuoteCompareModal onClose={() => setShowCompareModal(false)} />}
            <button onClick={() => setView({ page: 'DASHBOARD', itemId: null })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><ArrowLeft size={16} />Back to Dashboard</button>
            <PageHeader title={app.grantName} subtitle={`Application for: ${app.smeName}`}><StatusBadge status={app.status} /></PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Progress Timeline</h3>
                        <div className="flex justify-between items-start text-center">
                            {timelineSteps.map((step, index) => (
                                <div key={step.name} className="flex-1 relative px-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.status === 'complete' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}>
                                            {step.status === 'complete' ? <Check size={20} /> : <div className="w-2 h-2 bg-slate-400 rounded-full"></div>}
                                        </div>
                                        <p className="text-xs mt-2 font-semibold text-slate-700 dark:text-slate-300 leading-tight">{step.name}</p>
                                    </div>
                                    {index < timelineSteps.length - 1 && <div className={`absolute top-4 left-1/2 w-full h-0.5 ${step.status === 'complete' && timelineSteps[index+1].status !== 'upcoming' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-600'}`}></div>}
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{app.status === 'In Review' ? 'Official Correspondence' : 'Team Communication'}</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {app.status === 'In Review' ? (
                                <div className="bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Information Request from Grant Officer</p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">"Please provide a more detailed breakdown of the project costs for the marketing campaign."</p>
                                            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-300 mt-2 hover:underline">Respond to Request</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                <div className="flex gap-3"><img src="https://i.pravatar.cc/40?u=consultant" className="w-10 h-10 rounded-full" /><div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg rounded-tl-none"><p className="text-sm text-slate-800 dark:text-slate-200">Hi team, please upload the latest financial statements.</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">John Carter - 2 days ago</p></div></div>
                                <div className="flex gap-3 flex-row-reverse"><img src="https://i.pravatar.cc/40?u=SME" className="w-10 h-10 rounded-full" /><div className="bg-indigo-100 dark:bg-indigo-500/30 p-3 rounded-lg rounded-tr-none"><p className="text-sm text-slate-800 dark:text-slate-200">Sure, will get it done by today.</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">You - 2 days ago</p></div></div>
                                </>
                            )}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input type="text" placeholder="Type your message..." className="flex-grow bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                            <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Send size={20}/></button>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Action Center</h3>
                        <div className="space-y-2">
                             <button onClick={() => setShowProposalModal(true)} className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"><FilePlus className="text-indigo-500"/><div><p className="font-semibold text-slate-700 dark:text-slate-300">AI Proposal Builder</p><p className="text-xs text-slate-500 dark:text-slate-400">Generate a draft</p></div></button>
                             <button onClick={() => setShowCompareModal(true)} className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"><BarChartHorizontal className="text-indigo-500"/><div><p className="font-semibold text-slate-700 dark:text-slate-300">Compare Quotes</p><p className="text-xs text-slate-500 dark:text-slate-400">Review vendor proposals</p></div></button>
                        </div>
                    </Card>
                    <Card>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Top-3 Matches</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Acme ERP", fit: 92, notes: "PSG pre-approved • 3 case studies in F&B" },
                          { name: "Nova Cloud", fit: 88, notes: "Fast deployment • Good SG/MY support" },
                          { name: "Aegis Cyber", fit: 83, notes: "Meets ISO 27001 • Strong SME pricing" },
                        ].map((m,i) => (
                          <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">{m.name}</p>
                              <span className="text-xs font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">{m.fit}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.notes}</p>
                            <button className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View Profile</button>
                          </div>
                        ))}
                      </div>
                    </Card>
                    {role === 'CONSULTANT' && <Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Private Notes</h3><textarea placeholder="Add internal notes here..." className="w-full h-24 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"></textarea><button className="w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">Save Note</button></Card>}
                </div>
            </div>
        </div>
    );
};
const UserDetailView = ({ user, setView }) => (
    <div className="animate-fade-in">
        <button onClick={() => setView({ page: 'DASHBOARD' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><ArrowLeft size={16} />Back to User Management</button>
        <PageHeader title={user.name} subtitle={`Role: ${user.role}`}> <StatusBadge status={user.status} type="user"/> </PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Contact Information</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-500 dark:text-slate-400">{user.email}</span>
                        <ConsentChip ok={user.isVerified} />
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">User Activity</h3>
                    <p className="text-slate-500">Activity log would be displayed here...</p>
                </Card>
            </div>
            <div><Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Actions</h3><div className="space-y-2">
                {!user.isVerified && <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"><UserCheck size={18}/>Verify User</button>}
                <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600"><UserX size={18}/>Suspend User</button>
            </div></Card></div>
        </div>
    </div>
);
const UserDetailView = ({ user, setView }) => (
const QuoteDetailView = ({ quote, setView }) => (
     <div className="animate-fade-in">
        <button onClick={() => setView({ page: 'DASHBOARD' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><ArrowLeft size={16} />Back to Quote Pipeline</button>
        <PageHeader title={`Quote Request: ${quote.service}`} subtitle={`For: ${quote.sme} - ${quote.grant}`}><StatusBadge status={quote.status} type="quote"/></PageHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Project Brief</h3><p className="text-slate-500 dark:text-slate-400">The SME is looking for a comprehensive digital marketing campaign to support their expansion into the Malaysian market under the EDG. Key deliverables include market research, a new brand strategy, and a 6-month social media and SEM campaign.</p></Card></div>
            <div className="lg:col-span-1"><Card><h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Submit Your Quote</h3><div className="space-y-4">
                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-400">Quotation Amount (SGD)</label><input type="number" placeholder="e.g., 15000" className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/></div>
                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-400">Upload PDF Quote</label><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md"><div className="space-y-1 text-center"><UploadCloud className="mx-auto h-12 w-12 text-slate-400"/><p className="text-sm text-slate-500 dark:text-slate-400">Click to upload or drag and drop</p></div></div></div>
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"><Send size={18} className="inline mr-2"/>Submit Quote</button>
            </div></Card></div>
        </div>
    </div>
);
const QuoteDetailView = ({ quote, setView }) => (
     <div className="animate-fade-in">
        <button onClick={() => setView({ page: 'DASHBOARD' })} className="flex items-center gap-2 mb-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><ArrowLeft size={16} />Back to Quote Pipeline</button>
            </div></Card></div>
        </div>
    </div>
);

// --- MODAL COMPONENTS ---
const AddLeadModal = ({ onClose, onAddLead, isVendor = false }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newLead = {
            id: Date.now(),
            name: formData.get('smeName'),
            sme: formData.get('smeName'), // for vendor compatibility
            grant: formData.get('grantInterest'),
            service: "New Lead", // for vendor
            status: "Drafting", // for consultant
            deadline: null,
            probability: parseInt(formData.get('probability'), 10) || 50,
        };
        onAddLead(newLead);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><PlusCircle size={20} className="text-indigo-500"/>Add External Lead</h3>
                </div>
    </div>
);
const AIProposalModal = ({ onClose }) => (
    <Modal onClose={onClose}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Zap size={20} className="text-indigo-500"/>AI-Generated Proposal Draft</h3>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm space-y-4">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">1. Eligibility Summary</h4>
                <p className="text-slate-600 dark:text-slate-400">Innovate Pte. Ltd. (UEN: ...) meets the EDG criteria with {'>'}30% local shareholding and a project focused on overseas market expansion.</p>
                <h4 className="font-bold text-slate-700 dark:text-slate-300">2. Justification</h4>
                <p className="text-slate-600 dark:text-slate-400">This TaaS platform project aligns with Singapore's digital economy goals by creating a new, scalable export service. It addresses a clear market need in India and has high potential for revenue growth.</p>
                <h4 className="font-bold text-slate-700 dark:text-slate-300">3. Document Checklist</h4>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400"><li>[✓] ACRA BizFile</li><li>[✓] Project Proposal</li><li>[Pending] Financial Statements</li></ul>
                <h4 className="font-bold text-slate-700 dark:text-slate-300">4. Risk Warnings</h4>
                <p className="text-slate-600 dark:text-slate-400">Ensure financial projections are detailed and clearly justify the requested funding amount to avoid rejection.</p>
            </div>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">Accept & Edit</button>
        </div>
    </Modal>
);
const QuoteCompareModal = ({ onClose }) => (
    <Modal onClose={onClose}>
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><BarChartHorizontal size={20} className="text-indigo-500"/>Quote Comparison</h3>
            <div className="space-y-4 md:hidden">
                {initialVendorData.quoteRequests.map(q => (
                    <div key={q.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{q.sme}</h4>
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Amount:</span> <span className="font-semibold">${q.amount.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-sm mt-1"><span className="text-slate-500">Status:</span> <StatusBadge status={q.status} type="quote"/></div>
                    </div>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-4 gap-4 text-center items-center">
                <div></div>
                {initialVendorData.quoteRequests.map(q => <h4 key={q.id} className="font-bold text-slate-700 dark:text-slate-300">{q.sme}</h4>)}
                <div className="font-semibold text-slate-600 dark:text-slate-400 text-left">Amount</div>
                {initialVendorData.quoteRequests.map(q => <div key={q.id} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md">${q.amount.toLocaleString()}</div>)}
                <div className="font-semibold text-slate-600 dark:text-slate-400 text-left">Status</div>
                {initialVendorData.quoteRequests.map(q => <div key={q.id}><StatusBadge status={q.status} type="quote"/></div>)}
                <div className="font-semibold text-slate-600 dark:text-slate-400 text-left">Recommendation</div>
                <div></div>
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-md"><span className="font-bold text-green-700 dark:text-green-300">✅ Best Value</span></div>
                <div></div>
            </div>
             <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">Accept Recommendation</button>
            </div>
        </div>
    </Modal>
);

const SmartGrantLogo = () => (
    <svg width="28" height="28" viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27 51.5L0.5 0.5H53.5L27 51.5Z" fill="black" stroke="#FBBF24"/>
        <path d="M27 51.5L0.5 0.5H27V51.5Z" fill="#FBBF24"/>
        <path d="M27 26L53.5 0.5H27V26Z" fill="#D97706"/>
        <path d="M13.5 26L27 0.5H0.5L13.5 26Z" fill="#111827"/>
        <path d="M40.5 26L27 51.5L53.5 0.5L40.5 26Z" fill="#111827"/>
    </svg>
);


// --- MAIN APP ---
export default function App() {
    const [activeRole, setActiveRole] = useState('SME');
    const [view, setView] = useState({ page: 'DASHBOARD', itemId: null, tab: 'DASHBOARD' });
    const [consultantData, setConsultantData] = useState(initialConsultantData);
    const [vendorData, setVendorData] = useState(initialVendorData);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try { return localStorage.getItem('darkMode') === 'true'; } catch (e) { return false; }
    });

    useEffect(() => { 
        document.documentElement.classList.toggle('dark', isDarkMode);
        try { localStorage.setItem('darkMode', isDarkMode); } catch (e) { console.error("Failed to save dark mode preference."); }
    }, [isDarkMode]);
    useEffect(() => { setView({ page: 'DASHBOARD', tab: 'DASHBOARD' }); }, [activeRole]);
    
    const addConsultantLead = (newLead) => {
        setConsultantData(prevData => ({
            ...prevData,
            clients: [newLead, ...prevData.clients]
        }));
    };

    const addVendorLead = (newLead) => {
        setVendorData(prevData => ({
            ...prevData,
            quoteRequests: [newLead, ...prevData.quoteRequests]
        }));
    };

    const renderContent = () => {
        if (view.page === 'SME_APP_DETAIL') {
            const selectedApp = mockSmeData.applications.find(app => app.id === view.itemId);
            return <ApplicationDetailView app={selectedApp} setView={setView} role="SME"/>;
        }
        if (view.page === 'CONSULTANT_APP_DETAIL') {
            const selectedApp = mockSmeData.applications.find(app => app.id === view.itemId) || mockSmeData.applications[1];
            return <ApplicationDetailView app={selectedApp} setView={setView} role="CONSULTANT"/>;
        }
        if (view.page === 'REQUIREMENT_CAPTURE_STEP_1') {
            return <RequirementCaptureStep1 setView={setView} />;
        }
        if (view.page === 'AI_RECOMMENDATIONS_STEP_2') {
            return <AiRecommendationsStep2 setView={setView} />;
        }
        if (view.page === 'MATCHING_SETUP_STEP_3') {
            return <MatchingSetupStep3 setView={setView} />;
        }
        if (view.page === 'USER_DETAIL') {
            const selectedUser = mockAdminData.users.find(user => user.id === view.itemId);
            return <UserDetailView user={selectedUser} setView={setView} />;
        }
        if (view.page === 'QUOTE_DETAIL') {
            const selectedQuote = vendorData.quoteRequests.find(q => q.id === view.itemId);
            return <QuoteDetailView quote={selectedQuote} setView={setView} />;
        }

        if (view.tab === 'MARKETPLACE') {
            return <LeadMarketplace role={activeRole} />;
        }
        switch (activeRole) {
            case 'SME': return <SmeDashboardMockup setView={setView} />;
            case 'CONSULTANT': return <ConsultantDashboard setView={setView} consultantData={consultantData} addConsultantLead={addConsultantLead} />;
            case 'VENDOR': return <VendorDashboard setView={setView} vendorData={vendorData} addVendorLead={addVendorLead} />;
            case 'ADMIN': return <AdminDashboard setView={setView} />;
            default: return <SmeDashboardMockup setView={setView} />;
        }
    };

    const NavTab = ({ tabId, label, icon: Icon }) => (
        <button onClick={() => setView({ page: 'DASHBOARD', tab: tabId })} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${view.tab === tabId ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
            <Icon size={16} />
            {label}
        </button>
    );
     const RoleButton = ({ role }) => (
        <button onClick={() => setActiveRole(role)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${activeRole === role ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
            {role.charAt(0) + role.slice(1).toLowerCase()}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); body { font-family: 'Inter', sans-serif; } .animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <header className="bg-white dark:bg-slate-900 sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <SmartGrantLogo />
                    <h1 className="hidden sm:block text-xl font-bold text-slate-800 dark:text-slate-100">SmartGrant.ai</h1>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <RoleButton role="SME" /><RoleButton role="CONSULTANT" /><RoleButton role="VENDOR" /><RoleButton role="ADMIN" />
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                    <button className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><Bell size={20}/></button>
                    <button className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><MessageSquare size={20}/></button>
                    <button className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><CircleDollarSign size={20}/></button>
                    <img src={`https://i.pravatar.cc/40?u=${activeRole}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-500" />
                </div>
            </header>
            <main className="p-4 md:p-6">
                {view.page === 'DASHBOARD' && (
                    <div className="flex items-center border-b border-slate-200 dark:border-slate-700 mb-6">
                        <NavTab tabId="DASHBOARD" label="Dashboard" icon={LayoutDashboard} />
                        {(activeRole === 'CONSULTANT' || activeRole === 'VENDOR') && <NavTab tabId="MARKETPLACE" label="Lead Marketplace" icon={ShoppingCart} />}
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
}









