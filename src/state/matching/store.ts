import { create } from 'zustand';
import { LeadResponse, MatchingStats, ResponseWindow } from './types';
import { MOCK_LEAD_RESPONSES, MOCK_MATCHING_STATS, MOCK_RESPONSE_WINDOW } from '../../mocks/matching.seeds';

interface MatchingStore {
  responses: LeadResponse[];
  stats: MatchingStats;
  responseWindow: ResponseWindow;
  selectedResponse: LeadResponse | null;
  setSelectedResponse: (response: LeadResponse | null) => void;
  updateResponseStatus: (responseId: string, status: LeadResponse['status']) => void;
  refreshData: () => void;
}

export const useMatchingStore = create<MatchingStore>((set, get) => ({
  responses: MOCK_LEAD_RESPONSES,
  stats: MOCK_MATCHING_STATS,
  responseWindow: MOCK_RESPONSE_WINDOW,
  selectedResponse: null,

  setSelectedResponse: (response: LeadResponse | null) => {
    set({ selectedResponse: response });
  },

  updateResponseStatus: (responseId: string, status: LeadResponse['status']) => {
    set((state) => {
      const responses = state.responses.map(response =>
        response.id === responseId ? { ...response, status } : response
      );
      
      // Recalculate stats
      const accepted = responses.filter(r => r.status === 'ACCEPTED').length;
      const declined = responses.filter(r => r.status === 'DECLINED').length;
      const pending = responses.filter(r => r.status === 'PENDING').length;
      const expired = responses.filter(r => r.status === 'EXPIRED').length;
      const totalSent = responses.length;
      
      const stats: MatchingStats = {
        totalSent,
        accepted,
        declined,
        pending,
        expired,
        responseRate: totalSent > 0 ? Math.round(((accepted + declined) / totalSent) * 100) : 0,
        avgResponseTime: 2.7 // Mock value
      };

      return { responses, stats };
    });
  },

  refreshData: () => {
    // In a real app, this would fetch fresh data from the API
    set({
      responses: MOCK_LEAD_RESPONSES,
      stats: MOCK_MATCHING_STATS,
      responseWindow: MOCK_RESPONSE_WINDOW
    });
  }
}));
