import { create } from 'zustand';

/** Holds scanner output between the scanner and the review screen. Pages are temp file URIs. */
interface ScanSessionState {
  pages: string[];
  setPages: (pages: string[]) => void;
  appendPages: (pages: string[]) => void;
  removePage: (index: number) => void;
  clear: () => void;
}

export const useScanSessionStore = create<ScanSessionState>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  appendPages: (pages) => set((s) => ({ pages: [...s.pages, ...pages] })),
  removePage: (index) => set((s) => ({ pages: s.pages.filter((_, i) => i !== index) })),
  clear: () => set({ pages: [] }),
}));
