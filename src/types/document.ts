export type DocumentKind = 'scan' | 'pdf' | 'image';

export interface DocumentRecord {
  id: string;
  name: string;
  kind: DocumentKind;
  /** Paths are relative to the FODX storage root so they survive app updates. */
  pdfPath: string | null;
  thumbnailPath: string | null;
  fileSize: number;
  pageCount: number;
  folderId: string | null;
  isFavorite: boolean;
  ocrStatus: 'none' | 'done';
  createdAt: number;
  updatedAt: number;
}

export interface PageRecord {
  id: string;
  documentId: string;
  pageNumber: number;
  imagePath: string;
  fileSize: number;
}

export interface LibraryStats {
  totalDocuments: number;
  totalPdfs: number;
  storageBytes: number;
}

export type SortKey = 'newest' | 'oldest' | 'az' | 'za' | 'largest' | 'smallest';
export type FilterKey = 'all' | 'pdf' | 'images' | 'favorites' | 'recent';
