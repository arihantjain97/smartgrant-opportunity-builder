import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AppState, ReqDoc, Lead, Proposal, Quotation, Match } from './types';
import { mockCompanies, mockUsers, mockTRHLS, mockWallets } from '../mocks/seeds';

export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    // Initial state
    companies: mockCompanies,
    users: mockUsers,
    reqDocs: [],
    trhls: mockTRHLS,
    leads: [],
    proposals: [],
    quotations: [],
    matches: [],
    wallets: mockWallets,
    currentPersona: 'SME',
    currentReqDocId: undefined,

    // Actions
    setCurrentPersona: (persona) => {
      set((state) => {
        state.currentPersona = persona;
      });
    },

    createReqDoc: (reqDocData) => {
      const id = `reqdoc-${Date.now()}`;
      const now = new Date().toISOString();
      
      set((state) => {
        state.reqDocs.push({
          ...reqDocData,
          id,
          createdAt: now,
          updatedAt: now,
        });
        state.currentReqDocId = id;
      });
      
      return id;
    },

    selectTRHLS: (reqDocId, trhlsIds) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.trhlsSelectedIds = trhlsIds;
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    },

    setVisibility: (reqDocId, visibility) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.visibility = visibility;
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    },

    setMatchingMode: (reqDocId, mode) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.matchingMode = mode;
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    },

    seedMatchingForReqDoc: (reqDocId) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (!reqDoc) return;

        // Create match
        const matchId = `match-${Date.now()}`;
        const vendorUserIds = state.users.filter(u => u.persona === 'VENDOR').map(u => u.id);
        const consultantUserIds = state.users.filter(u => u.persona === 'CONSULTANT').map(u => u.id);
        
        state.matches.push({
          id: matchId,
          reqDocId,
          vendorUserIds,
          consultantUserIds,
          createdAt: new Date().toISOString()
        });

        // Create leads for vendors
        vendorUserIds.forEach((userId, index) => {
          const leadId = `lead-vendor-${reqDocId}-${index}`;
          state.leads.push({
            id: leadId,
            reqDocId,
            audience: 'VENDOR',
            maskedPreview: {
              summary: `F&B company seeking ${reqDoc.trhlsSelectedIds.length > 0 ? 'technology solution' : 'business solution'}`,
              budgetBand: reqDoc.budgetBand,
              urgency: reqDoc.complexity === 'HIGH' ? 'HIGH' : reqDoc.complexity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
              grantTag: reqDoc.grantRelevant ? (reqDoc.trhlsSelectedIds.includes('trhls-1') ? 'PSG' : 'EDG') : undefined
            },
            priceCredits: 1,
            qualificationScore: reqDoc.qualificationScore,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            createdAt: new Date().toISOString()
          });
        });

        // Create leads for consultants
        consultantUserIds.forEach((userId, index) => {
          const leadId = `lead-consultant-${reqDocId}-${index}`;
          state.leads.push({
            id: leadId,
            reqDocId,
            audience: 'CONSULTANT',
            maskedPreview: {
              summary: `F&B company seeking ${reqDoc.trhlsSelectedIds.length > 0 ? 'technology solution' : 'business solution'}`,
              budgetBand: reqDoc.budgetBand,
              urgency: reqDoc.complexity === 'HIGH' ? 'HIGH' : reqDoc.complexity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
              grantTag: reqDoc.grantRelevant ? (reqDoc.trhlsSelectedIds.includes('trhls-1') ? 'PSG' : 'EDG') : undefined
            },
            priceCredits: 1,
            qualificationScore: reqDoc.qualificationScore,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            createdAt: new Date().toISOString()
          });
        });

        // Update reqDoc status
        reqDoc.status = 'SHORTLISTED';
        reqDoc.updatedAt = new Date().toISOString();
      });
    },

    acceptLead: (leadId, userId) => {
      set((state) => {
        const lead = state.leads.find(l => l.id === leadId);
        const wallet = state.wallets.find(w => w.userId === userId);
        
        if (lead && wallet && wallet.balance >= lead.priceCredits) {
          lead.acceptedByUserId = userId;
          wallet.balance -= lead.priceCredits;
          
          // Update reqDoc status if needed
          const reqDoc = state.reqDocs.find(rd => rd.id === lead.reqDocId);
          if (reqDoc && reqDoc.status === 'SHORTLISTED') {
            reqDoc.status = 'PREVIEWED';
            reqDoc.updatedAt = new Date().toISOString();
          }
        }
      });
    },

    submitProposal: (proposalData) => {
      const id = `proposal-${Date.now()}`;
      
      set((state) => {
        state.proposals.push({
          ...proposalData,
          id,
          createdAt: new Date().toISOString()
        });
      });
      
      return id;
    },

    submitQuotation: (quotationData) => {
      const id = `quotation-${Date.now()}`;
      
      set((state) => {
        state.quotations.push({
          ...quotationData,
          id,
          createdAt: new Date().toISOString()
        });
      });
      
      return id;
    },

    finalizeIndicatives: (reqDocId) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.status = 'INDICATIVE';
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    },

    awardVendor: (reqDocId, vendorUserId) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.status = 'AWARDED';
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    },

    awardConsultant: (reqDocId, consultantUserId) => {
      set((state) => {
        const reqDoc = state.reqDocs.find(rd => rd.id === reqDocId);
        if (reqDoc) {
          reqDoc.status = 'AWARDED';
          reqDoc.updatedAt = new Date().toISOString();
        }
      });
    }
  }))
);
