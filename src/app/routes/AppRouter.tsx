import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Header } from '../../components/common/Header';
import { SmeDashboard } from '../../features/dashboard/sme/SmeDashboard';
import { VendorDashboard } from '../../features/dashboard/vendor/VendorDashboard';
import { ConsultantDashboard } from '../../features/dashboard/consultant/ConsultantDashboard';
import { VendorLeadInbox } from '../../features/leads/VendorLeadInbox';
import { ConsultantLeadInbox } from '../../features/leads/ConsultantLeadInbox';
import { Step1_GoalCapture } from '../../features/opportunityBuilder/sme/Step1_GoalCapture';
import { Step2_TRHLS } from '../../features/opportunityBuilder/sme/Step2_TRHLS';
import { Step3_PrivacyAndConsent } from '../../features/opportunityBuilder/sme/Step3_PrivacyAndConsent';
import { Step4_MatchingMode } from '../../features/opportunityBuilder/sme/Step4_MatchingMode';
import { Step5_PreviewDispatch } from '../../features/opportunityBuilder/sme/Step5_PreviewDispatch';
import { Step6_LiveMatchingDashboard } from '../../features/opportunityBuilder/sme/Step6_LiveMatchingDashboard';
import { ComparisonView } from '../../features/opportunityBuilder/comparison/ComparisonView';

const AppRouter: React.FC = () => {
  const { currentPersona } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);

  const handleStartNewOpportunity = () => {
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinish = () => {
    setCurrentStep(1);
  };

  const renderSMEBuilder = () => {
    switch (currentStep) {
      case 1:
        return <Step1_GoalCapture onNext={handleNextStep} onBack={handleFinish} />;
      case 2:
        return <Step2_TRHLS onNext={handleNextStep} onBack={handleBackStep} />;
      case 3:
        return <Step3_PrivacyAndConsent onNext={handleNextStep} onBack={handleBackStep} />;
      case 4:
        return <Step4_MatchingMode onNext={handleNextStep} onBack={handleBackStep} />;
      case 5:
        return <Step5_PreviewDispatch onNext={handleNextStep} onBack={handleBackStep} />;
      case 6:
        return <Step6_LiveMatchingDashboard onBack={handleBackStep} />;
      default:
        return <Step1_GoalCapture onNext={handleNextStep} onBack={handleFinish} />;
    }
  };

  const renderDashboard = () => {
    switch (currentPersona) {
      case 'SME':
        return <SmeDashboard onStartNewOpportunity={() => {}} />;
      case 'VENDOR':
        return <VendorDashboard onViewLead={(leadId) => console.log('View lead:', leadId)} />;
      case 'CONSULTANT':
        return <ConsultantDashboard onViewLead={(leadId) => console.log('View lead:', leadId)} />;
      default:
        return <SmeDashboard onStartNewOpportunity={() => {}} />;
    }
  };

  const renderLeadInbox = () => {
    switch (currentPersona) {
      case 'VENDOR':
        return <VendorLeadInbox />;
      case 'CONSULTANT':
        return <ConsultantLeadInbox />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <Router>
      <Header />
      <main className="p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={renderDashboard()} />
          <Route path="/leads" element={renderLeadInbox()} />
          <Route path="/sme/builder" element={renderSMEBuilder()} />
          <Route path="/comparison/:reqDocId" element={<ComparisonView reqDocId="reqdoc-1" onBack={() => window.history.back()} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
