import { Directory, File, Paths } from 'expo-file-system';

/**
 * All document files live under <documentDirectory>/fodx/documents/<id>/.
 * The database stores paths RELATIVE to the `fodx` root, because the absolute
 * app container path can change between app updates (notably on iOS).
 */
const root = () => new Directory(Paths.document, 'fodx');

export function newId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}${rand}`;
}

export function documentDir(id: string): Directory {
  return new Directory(root(), 'documents', id);
}

export function resolve(relativePath: string): File {
  return new File(root(), relativePath);
}

export function exists(relativePath: string | null): boolean {
  if (!relativePath) return false;
  try {
    return resolve(relativePath).exists;
  } catch {
    return false;
  }
}

export function relativeDocPath(id: string, fileName: string): string {
  return `documents/${id}/${fileName}`;
}

export function ensureDocumentDir(id: string): Directory {
  const dir = documentDir(id);
  dir.create({ intermediates: true, idempotent: true });
  return dir;
}

/** Copies a file (e.g. scanner output in cache) into the document folder. Never overwrites. */
export async function importFile(sourceUri: string, id: string, fileName: string): Promise<{ path: string; size: number }> {
  const dir = ensureDocumentDir(id);
  const target = new File(dir, fileName);
  await new File(sourceUri).copy(target, { overwrite: false });
  return { path: relativeDocPath(id, fileName), size: target.size };
}

export async function writeBytes(id: string, fileName: string, bytes: Uint8Array): Promise<{ path: string; size: number }> {
  const dir = ensureDocumentDir(id);
  const target = new File(dir, fileName);
  target.create({ overwrite: true });
  await target.write(bytes);
  return { path: relativeDocPath(id, fileName), size: target.size };
}

export async function readBytes(relativePath: string): Promise<Uint8Array> {
  return resolve(relativePath).bytes();
}

export function removeDocumentFiles(id: string): void {
  const dir = documentDir(id);
  if (dir.exists) dir.delete();
}

export function uriOf(relativePath: string): string {
  return resolve(relativePath).uri;
}

/** Empties the cache directory (scanner and picker temp output). Returns bytes freed, best effort. */
export function clearTemporaryFiles(): number {
  let freed = 0;
  for (const entry of Paths.cache.list()) {
    try {
      if (entry instanceof File) freed += entry.size;
      entry.delete();
    } catch {
      // A file in use can fail to delete; the rest are still cleared.
    }
  }
  return freed;
}

export function availableDiskSpace(): number {
  return Paths.availableDiskSpace;
}
