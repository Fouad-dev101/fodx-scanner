import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { migrate } from './migrations';

let dbPromise: Promise<SQLiteDatabase> | null = null;

/** Opens (once) and migrates the database. Safe to call from anywhere. */
export function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await openDatabaseAsync('fodx-scanner.db');
      await migrate(db);
      return db;
    })().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}
