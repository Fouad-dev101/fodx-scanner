import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Each migration runs once, in order, inside a transaction.
 * The applied version is stored in PRAGMA user_version.
 * Never edit a shipped migration: add a new one.
 */
const migrations: ((db: SQLiteDatabase) => Promise<void>)[] = [
  async (db) => {
    await db.execAsync(`
      CREATE TABLE folders (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      CREATE TABLE documents (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('scan','pdf','image')),
        pdfPath TEXT,
        thumbnailPath TEXT,
        fileSize INTEGER NOT NULL DEFAULT 0,
        pageCount INTEGER NOT NULL DEFAULT 0,
        folderId TEXT REFERENCES folders(id) ON DELETE SET NULL,
        isFavorite INTEGER NOT NULL DEFAULT 0,
        ocrStatus TEXT NOT NULL DEFAULT 'none',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      CREATE INDEX idx_documents_created ON documents(createdAt DESC);
      CREATE INDEX idx_documents_folder ON documents(folderId);
      CREATE TABLE pages (
        id TEXT PRIMARY KEY NOT NULL,
        documentId TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        pageNumber INTEGER NOT NULL,
        imagePath TEXT NOT NULL,
        fileSize INTEGER NOT NULL DEFAULT 0,
        UNIQUE (documentId, pageNumber)
      );
      CREATE TABLE ocr_results (
        id TEXT PRIMARY KEY NOT NULL,
        documentId TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        pageNumber INTEGER NOT NULL,
        extractedText TEXT NOT NULL,
        language TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
      CREATE TABLE settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
  },
];

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < migrations.length) {
    const next = version + 1;
    await db.withTransactionAsync(async () => {
      await migrations[version](db);
      await db.execAsync(`PRAGMA user_version = ${next}`);
    });
    version = next;
  }
}
