/**
 * The scanner is behind an interface so the engine can change without touching
 * screens. Today: the platform scanner (ML Kit on Android, VisionKit on iOS).
 * Later: a FODX camera with its own detection, if testing shows it is needed.
 */
export interface ScanOptions {
  maxPages?: number;
}

export type ScanResult =
  | { status: 'success'; pages: string[] }
  | { status: 'cancelled' };

export type ScanErrorCode = 'unavailable' | 'failed';

export class ScanError extends Error {
  constructor(public code: ScanErrorCode, message: string) {
    super(message);
    this.name = 'ScanError';
  }
}

export interface ScannerEngine {
  readonly id: string;
  scan(options?: ScanOptions): Promise<ScanResult>;
}
