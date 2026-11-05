import { File } from 'expo-file-system';
import { documentsRepository } from '@/database/documentsRepository';
import {
  availableDiskSpace,
  ensureDocumentDir,
  exists,
  importFile,
  newId,
  readBytes,
  removeDocumentFiles,
  uriOf,
  writeBytes,
} from '@/services/filesystem/storage';
import { buildPdfFromImages, readPdfPageCount, type PageSize } from '@/services/pdf/buildPdf';
import type { PageRecord } from '@/types/document';

export class InsufficientStorageError extends Error {}
export class InvalidPdfError extends Error {}

/** Rough upper bound: page images plus a PDF about as large again, with headroom. */
const requiredBytes = (sources: string[]) =>
  sources.reduce((sum, uri) => {
    try {
      return sum + new File(uri).size * 2.5;
    } catch {
      return sum + 5_000_000;
    }
  }, 0);

async function createFromImages(
  name: string,
  sourceUris: string[],
  kind: 'scan' | 'image',
  pageSize: PageSize,
): Promise<string> {
  if (availableDiskSpace() < requiredBytes(sourceUris)) throw new InsufficientStorageError();

  const id = newId();
  try {
    ensureDocumentDir(id);
    const pages: Omit<PageRecord, 'documentId'>[] = [];
    for (let i = 0; i < sourceUris.length; i++) {
      const copied = await importFile(sourceUris[i], id, `page-${i + 1}.jpg`);
      pages.push({ id: newId(), pageNumber: i + 1, imagePath: copied.path, fileSize: copied.size });
    }
    const pdfBytes = await buildPdfFromImages(pages.map((p) => p.imagePath), pageSize, readBytes);
    const pdf = await writeBytes(id, 'document.pdf', pdfBytes);

    await documentsRepository.insert({
      id,
      name,
      kind,
      pdfPath: pdf.path,
      thumbnailPath: pages[0].imagePath,
      fileSize: pdf.size,
      pageCount: pages.length,
      pages,
    });
    return id;
  } catch (error) {
    // Never leave half-written files behind when a save fails.
    removeDocumentFiles(id);
    throw error;
  }
}

export const documentService = {
  /** Scanner output -> page images + PDF + database record. */
  saveScan(name: string, pageUris: string[], pageSize: PageSize = 'a4') {
    return createFromImages(name, pageUris, 'scan', pageSize);
  },

  /** Gallery or picker images -> one PDF document. */
  saveImages(name: string, imageUris: string[], kind: 'scan' | 'image' = 'image', pageSize: PageSize = 'a4') {
    return createFromImages(name, imageUris, kind, pageSize);
  },

  /** Imports an existing PDF after validating that it can be read. */
  async importPdf(name: string, sourceUri: string): Promise<string> {
    if (availableDiskSpace() < requiredBytes([sourceUri])) throw new InsufficientStorageError();

    let pageCount: number;
    try {
      const bytes = await new File(sourceUri).bytes();
      pageCount = await readPdfPageCount(bytes);
    } catch {
      throw new InvalidPdfError();
    }
    if (pageCount < 1) throw new InvalidPdfError();

    const id = newId();
    try {
      const copied = await importFile(sourceUri, id, 'document.pdf');
      await documentsRepository.insert({
        id,
        name,
        kind: 'pdf',
        pdfPath: copied.path,
        thumbnailPath: null,
        fileSize: copied.size,
        pageCount,
        pages: [],
      });
      return id;
    } catch (error) {
      removeDocumentFiles(id);
      throw error;
    }
  },

  /** Removes the record first, then the files, so a crash never leaves a record pointing at nothing. */
  async remove(id: string) {
    await documentsRepository.remove(id);
    removeDocumentFiles(id);
  },

  pdfUri(pdfPath: string | null): string | null {
    return pdfPath && exists(pdfPath) ? uriOf(pdfPath) : null;
  },

  readPdf: readBytes,
};
