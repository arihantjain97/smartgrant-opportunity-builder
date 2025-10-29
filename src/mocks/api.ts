import { useAppStore } from '../state/store';
import { ReqDoc, Lead, Proposal, Quotation } from '../state/types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // ReqDoc operations
  createReqDoc: async (reqDocData: Omit<ReqDoc, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(500);
    return useAppStore.getState().createReqDoc(reqDocData);
  },

  selectTRHLS: async (reqDocId: string, trhlsIds: string[]) => {
    await delay(300);
    useAppStore.getState().selectTRHLS(reqDocId, trhlsIds);
  },

  setVisibility: async (reqDocId: string, visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => {
    await delay(200);
    useAppStore.getState().setVisibility(reqDocId, visibility);
  },

  setMatchingMode: async (reqDocId: string, mode: 'SME_SELF_MANAGED' | 'CONSULTANT_MANAGED') => {
    await delay(200);
    useAppStore.getState().setMatchingMode(reqDocId, mode);
  },

  seedMatching: async (reqDocId: string) => {
    await delay(1000);
    useAppStore.getState().seedMatchingForReqDoc(reqDocId);
  },

  // Lead operations
  acceptLead: async (leadId: string, userId: string) => {
    await delay(800);
    useAppStore.getState().acceptLead(leadId, userId);
  },

  // Proposal/Quotation operations
  submitProposal: async (proposalData: Omit<Proposal, 'id' | 'createdAt'>) => {
    await delay(600);
    return useAppStore.getState().submitProposal(proposalData);
  },

  submitQuotation: async (quotationData: Omit<Quotation, 'id' | 'createdAt'>) => {
    await delay(600);
    return useAppStore.getState().submitQuotation(quotationData);
  },

  // Award operations
  finalizeIndicatives: async (reqDocId: string) => {
    await delay(400);
    useAppStore.getState().finalizeIndicatives(reqDocId);
  },

  awardVendor: async (reqDocId: string, vendorUserId: string) => {
    await delay(500);
    useAppStore.getState().awardVendor(reqDocId, vendorUserId);
  },

  awardConsultant: async (reqDocId: string, consultantUserId: string) => {
    await delay(500);
    useAppStore.getState().awardConsultant(reqDocId, consultantUserId);
  }
};
