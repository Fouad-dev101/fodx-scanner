import { create } from 'zustand';
import { documentsRepository } from '@/database/documentsRepository';
import type { DocumentRecord, LibraryStats } from '@/types/document';

interface LibraryState {
  documents: DocumentRecord[];
  stats: LibraryStats;
  loaded: boolean;
  refresh: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  documents: [],
  stats: { totalDocuments: 0, totalPdfs: 0, storageBytes: 0 },
  loaded: false,
  async refresh() {
    const [documents, stats] = await Promise.all([documentsRepository.list(), documentsRepository.stats()]);
    set({ documents, stats, loaded: true });
  },
}));
