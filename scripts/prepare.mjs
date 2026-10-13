import {copyFile} from 'node:fs/promises';
await import('./brand.mjs');
await copyFile('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','public/pdf.worker.min.mjs');
