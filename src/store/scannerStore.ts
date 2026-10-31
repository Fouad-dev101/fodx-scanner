// src/store/scannerStore.ts
import { create } from 'zustand';

export interface ScannedPage {
  id: string;
  uri: string;
  filter: 'original' | 'bw' | 'grayscale' | 'enhanced';
  rotation: number;
}

interface ScannerState {
  pages: ScannedPage[];
  addPage: (uri: string) => void;
  removePage: (id: string) => void;
  updatePage: (id: string, updates: Partial<ScannedPage>) => void;
  clearSession: () => void;
  reorderPages: (newPages: ScannedPage[]) => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  pages: [],

  addPage: (uri) =>
    set((state) => ({
      pages: [
        ...state.pages,
        {
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          uri,
          filter: 'original',
          rotation: 0,
        },
      ],
    })),

  removePage: (id) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== id),
    })),

  updatePage: (id, updates) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  clearSession: () => set({ pages: [] }),

  reorderPages: (newPages) => set({ pages: newPages }),
}));