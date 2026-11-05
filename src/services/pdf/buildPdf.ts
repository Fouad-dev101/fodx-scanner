import { PDFDocument } from 'pdf-lib';

export type PageSize = 'a4' | 'letter' | 'original';

const SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792],
} as const;

const MARGIN = 0;

const isPng = (bytes: Uint8Array) =>
  bytes.length > 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;

/**
 * Builds a PDF from page images (relative storage paths), in order.
 * Pages are embedded one at a time so only one decoded image is read at once.
 * Fixed-size pages keep the image's aspect ratio and centre it; 'original'
 * makes each PDF page exactly the image's proportions.
 */
export async function buildPdfFromImages(
  imagePaths: string[],
  pageSize: PageSize,
  readBytes: (path: string) => Promise<Uint8Array>,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  for (const path of imagePaths) {
    const bytes = await readBytes(path);
    const image = isPng(bytes) ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    if (pageSize === 'original') {
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      continue;
    }
    const [pw, ph] = SIZES[pageSize];
    // Match page orientation to the image so a landscape scan is not squeezed into portrait.
    const landscape = image.width > image.height;
    const pageW = landscape ? ph : pw;
    const pageH = landscape ? pw : ph;
    const scale = Math.min((pageW - MARGIN * 2) / image.width, (pageH - MARGIN * 2) / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    const page = pdf.addPage([pageW, pageH]);
    page.drawImage(image, { x: (pageW - w) / 2, y: (pageH - h) / 2, width: w, height: h });
  }
  return pdf.save();
}

/** Reads the page count of a PDF, or throws if it is damaged or encrypted. */
export async function readPdfPageCount(bytes: Uint8Array): Promise<number> {
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: false });
  return pdf.getPageCount();
}
