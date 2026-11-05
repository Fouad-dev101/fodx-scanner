import { nativeScannerEngine } from './nativeEngine';
import type { ScannerEngine } from './types';

export * from './types';

/** The active engine. Swap here when a second engine exists. */
export const scanner: ScannerEngine = nativeScannerEngine;
