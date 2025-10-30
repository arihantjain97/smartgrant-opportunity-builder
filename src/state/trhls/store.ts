import { create } from "zustand";
import { TRHLSOption } from "../types";
import { TRHLS_FOR_MARKETING_VISIBILITY } from "../../mocks/seeds.trhls";

interface TRHLSState {
  all: TRHLSOption[];
  selected: TRHLSOption[];
  toggleSelect: (id: string) => void;
  clear: () => void;
}

export const useTrhlsStore = create<TRHLSState>((set, get) => ({
  all: TRHLS_FOR_MARKETING_VISIBILITY,
  selected: [],
  toggleSelect: (id) => {
    const { selected, all } = get();
    const exists = selected.find((s) => s.id === id);
    if (exists) {
      set({ selected: selected.filter((s) => s.id !== id) });
    } else if (selected.length < 3) {
      const newSel = all.find((s) => s.id === id);
      if (newSel) set({ selected: [...selected, newSel] });
    }
  },
  clear: () => set({ selected: [] })
}));
