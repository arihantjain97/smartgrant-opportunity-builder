import { create } from 'zustand';
import { Vendor, Consultant, PreviewState } from './types';
import { MOCK_VENDORS, MOCK_CONSULTANTS } from '../../mocks/preview.seeds';

interface PreviewStore extends PreviewState {
  toggleVendor: (id: string) => void;
  toggleConsultant: (id: string) => void;
  setVisibility: (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => void;
  addVendor: (id: string) => void;
  addConsultant: (id: string) => void;
  reset: () => void;
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  vendors: MOCK_VENDORS,
  consultants: MOCK_CONSULTANTS,
  visibility: 'LIMITED',
  totalSelected: 0,
  vendorCount: 0,
  consultantCount: 0,

  toggleVendor: (id: string) => {
    set((state) => {
      const vendors = state.vendors.map(vendor =>
        vendor.id === id ? { ...vendor, selected: !vendor.selected } : vendor
      );
      const vendorCount = vendors.filter(v => v.selected).length;
      const consultantCount = state.consultants.filter(c => c.selected).length;
      
      return {
        vendors,
        vendorCount,
        consultantCount,
        totalSelected: vendorCount + consultantCount
      };
    });
  },

  toggleConsultant: (id: string) => {
    set((state) => {
      const consultants = state.consultants.map(consultant =>
        consultant.id === id ? { ...consultant, selected: !consultant.selected } : consultant
      );
      const vendorCount = state.vendors.filter(v => v.selected).length;
      const consultantCount = consultants.filter(c => c.selected).length;
      
      return {
        consultants,
        vendorCount,
        consultantCount,
        totalSelected: vendorCount + consultantCount
      };
    });
  },

  addVendor: (id: string) => {
    set((state) => {
      const vendors = state.vendors.map(vendor =>
        vendor.id === id ? { ...vendor, selected: true } : vendor
      );
      const vendorCount = vendors.filter(v => v.selected).length;
      const consultantCount = state.consultants.filter(c => c.selected).length;
      
      return {
        vendors,
        vendorCount,
        consultantCount,
        totalSelected: vendorCount + consultantCount
      };
    });
  },

  addConsultant: (id: string) => {
    set((state) => {
      const consultants = state.consultants.map(consultant =>
        consultant.id === id ? { ...consultant, selected: true } : consultant
      );
      const vendorCount = state.vendors.filter(v => v.selected).length;
      const consultantCount = consultants.filter(c => c.selected).length;
      
      return {
        consultants,
        vendorCount,
        consultantCount,
        totalSelected: vendorCount + consultantCount
      };
    });
  },

  setVisibility: (visibility: 'PRIVATE' | 'LIMITED' | 'PUBLIC') => {
    set({ visibility });
  },

  reset: () => {
    set({
      vendors: MOCK_VENDORS,
      consultants: MOCK_CONSULTANTS,
      visibility: 'LIMITED',
      totalSelected: 0,
      vendorCount: 0,
      consultantCount: 0
    });
  }
}));
