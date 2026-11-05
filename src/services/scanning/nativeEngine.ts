import DocumentScanner, {
  ResponseType,
  ScanDocumentResponseStatus,
} from 'react-native-document-scanner-plugin';
import { ScanError, type ScannerEngine, type ScanOptions, type ScanResult } from './types';

/** Platform scanner: automatic edge detection, crop, perspective correction and multi-page capture. */
export const nativeScannerEngine: ScannerEngine = {
  id: 'native',
  async scan(options: ScanOptions = {}): Promise<ScanResult> {
    try {
      const response = await DocumentScanner.scanDocument({
        croppedImageQuality: 90,
        maxNumDocuments: options.maxPages,
        responseType: ResponseType.ImageFilePath,
      });
      if (response.status === ScanDocumentResponseStatus.Cancel) {
        return { status: 'cancelled' };
      }
      const pages = response.scannedImages ?? [];
      if (pages.length === 0) return { status: 'cancelled' };
      return { status: 'success', pages };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // The Android scanner reports a missing/unsupported Google Play services setup as an error.
      if (/play services|gms|not available|unavailable/i.test(message)) {
        throw new ScanError('unavailable', message);
      }
      throw new ScanError('failed', message);
    }
  },
};
