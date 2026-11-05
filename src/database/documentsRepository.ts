import { getDb } from './db';
import type {
  DocumentKind,
  DocumentRecord,
  LibraryStats,
  PageRecord,
} from '@/types/document';

interface DocumentRow {
  id: string;
  name: string;
  kind: DocumentKind;
  pdfPath: string | null;
  thumbnailPath: string | null;
  fileSize: number;
  pageCount: number;
  folderId: string | null;
  isFavorite: number;
  ocrStatus: 'none' | 'done';
  createdAt: number;
  updatedAt: number;
}

const toRecord = (row: DocumentRow): DocumentRecord => ({
  ...row,
  isFavorite: row.isFavorite === 1,
});

export interface NewDocument {
  id: string;
  name: string;
  kind: DocumentKind;
  pdfPath: string | null;
  thumbnailPath: string | null;
  fileSize: number;
  pageCount: number;
  pages: Omit<PageRecord, 'documentId'>[];
}

export const documentsRepository = {
  /** Inserts the document and its pages atomically. */
  async insert(doc: NewDocument): Promise<void> {
    const db = await getDb();
    const now = Date.now();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO documents
           (id, name, kind, pdfPath, thumbnailPath, fileSize, pageCount, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [doc.id, doc.name, doc.kind, doc.pdfPath, doc.thumbnailPath, doc.fileSize, doc.pageCount, now, now],
      );
      for (const page of doc.pages) {
        await db.runAsync(
          `INSERT INTO pages (id, documentId, pageNumber, imagePath, fileSize) VALUES (?, ?, ?, ?, ?)`,
          [page.id, doc.id, page.pageNumber, page.imagePath, page.fileSize],
        );
      }
    });
  },

  async list(): Promise<DocumentRecord[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<DocumentRow>('SELECT * FROM documents ORDER BY createdAt DESC');
    return rows.map(toRecord);
  },

  async get(id: string): Promise<DocumentRecord | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<DocumentRow>('SELECT * FROM documents WHERE id = ?', [id]);
    return row ? toRecord(row) : null;
  },

  async pages(documentId: string): Promise<PageRecord[]> {
    const db = await getDb();
    return db.getAllAsync<PageRecord>(
      'SELECT * FROM pages WHERE documentId = ? ORDER BY pageNumber ASC',
      [documentId],
    );
  },

  async rename(id: string, name: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE documents SET name = ?, updatedAt = ? WHERE id = ?', [name, Date.now(), id]);
  },

  async setFavorite(id: string, isFavorite: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE documents SET isFavorite = ? WHERE id = ?', [isFavorite ? 1 : 0, id]);
  },

  async remove(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM documents WHERE id = ?', [id]);
  },

  async stats(): Promise<LibraryStats> {
    const db = await getDb();
    const counts = await db.getFirstAsync<{ total: number; pdfs: number; docBytes: number }>(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN kind IN ('scan','pdf') THEN 1 ELSE 0 END), 0) AS pdfs,
              COALESCE(SUM(fileSize), 0) AS docBytes
         FROM documents`,
    );
    const pageBytes = await db.getFirstAsync<{ bytes: number }>(
      'SELECT COALESCE(SUM(fileSize), 0) AS bytes FROM pages',
    );
    return {
      totalDocuments: counts?.total ?? 0,
      totalPdfs: counts?.pdfs ?? 0,
      storageBytes: (counts?.docBytes ?? 0) + (pageBytes?.bytes ?? 0),
    };
  },

  async getSetting(key: string): Promise<string | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
    return row?.value ?? null;
  },

  async setSetting(key: string, value: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      [key, value],
    );
  },
};
