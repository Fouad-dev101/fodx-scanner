// src/services/pdfService.ts
import * as Print from 'expo-print';
import { File, Directory, Paths } from 'expo-file-system'; // <-- NEW API
import { ScannedPage } from '../store/scannerStore';

export async function generatePdfFromPages(
  pages: ScannedPage[],
  documentName: string
): Promise<string> {
  try {
    // 1. Convert images to base64 using the new File API
    const htmlImages = await Promise.all(
      pages.map(async (page) => {
        const file = new File(page.uri);
        const base64 = await file.base64(); // <-- NEW METHOD
        return `<div class="page"><img src="data:image/jpeg;base64,${base64}" /></div>`;
      })
    );

    // 2. Build the HTML document
    const html = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
            .page { 
              page-break-after: always; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              width: 100vw; 
              height: 100vh; 
            }
            img { 
              max-width: 100%; 
              max-height: 100%; 
              object-fit: contain; 
            }
          </style>
        </head>
        <body>
          ${htmlImages.join('')}
        </body>
      </html>
    `;

    // 3. Generate the PDF to a temporary cache file
    const { uri } = await Print.printToFileAsync({ html });

    // 4. Create a permanent folder for FODX documents using the new Directory class
    const docDir = new Directory(Paths.document, 'fodx_documents'); // <-- NEW DIRECTORY API
    if (!docDir.exists) {
      docDir.create();
    }

    // 5. Move the file from cache to permanent storage
    const safeName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const permanentFile = new File(docDir, `${safeName}_${Date.now()}.pdf`);
    
    // Move the file using the new File API
    const tempFile = new File(uri);
    tempFile.move(permanentFile);

    return permanentFile.uri; // Return the URI as a string
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF');
  }
}