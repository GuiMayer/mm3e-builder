import { jsPDF } from 'jspdf';
import { rasterizePdfPortraits } from './portraitLayout';
import { paginateHtmlForPdf } from './pdfPagination';
import { PDF_GEOMETRY, PDF_CONTENT_WIDTH_PX, PDF_CONTENT_HEIGHT_PX } from './pdfGeometry';
import { embedPDFFontsInHTML, getPDFFontFaces } from './pdfFonts';

export interface HtmlToPdfOptions { filename: string }

let conversionQueue: Promise<void> = Promise.resolve();

/** Serialize off-screen rendering so rapidly changed previews cannot mix styles. */
export function convertHtmlToPdf(html: string, options: HtmlToPdfOptions): Promise<Blob> {
  const result = conversionQueue.then(() => renderPdf(html, options));
  conversionQueue = result.then(() => {}, () => {});
  return result;
}

export function createPaginatedHTML(html: string): Promise<string> {
  const result = conversionQueue.then(async () => {
    const root = await paginateHtmlForPdf(html, PDF_CONTENT_WIDTH_PX, PDF_CONTENT_HEIGHT_PX);
    const font = root.dataset.pdfFont ?? 'Noto Sans';
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    parsed.body.replaceChildren(root);
    return embedPDFFontsInHTML(parsed.documentElement.outerHTML, font);
  });
  conversionQueue = result.then(() => {}, () => {});
  return result;
}

async function renderPdf(html: string, options: HtmlToPdfOptions): Promise<Blob> {
  const root = await paginateHtmlForPdf(html, PDF_CONTENT_WIDTH_PX, PDF_CONTENT_HEIGHT_PX);
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true });
  pdf.setProperties({ title: options.filename.replace(/\.pdf$/i, '') });
  const pages = Array.from(root.querySelectorAll<HTMLElement>('.pdf-page'));
  try {
    for (const [index, page] of pages.entries()) {
      if (index > 0) pdf.addPage();
      const wrapper = document.createElement('div');
      // Put the physical margin in the DOM. jsPDF's non-paging canvas paths
      // do not apply x/y offsets consistently to both text and borders.
      wrapper.style.cssText = `padding:${PDF_GEOMETRY.marginMm / PDF_GEOMETRY.mmPerPx}px;width:${PDF_GEOMETRY.widthMm / PDF_GEOMETRY.mmPerPx}px;box-sizing:border-box;`;
      root.querySelectorAll('style').forEach(style => wrapper.append(style.cloneNode(true)));
      wrapper.append(page.cloneNode(true));
      await pdf.html(wrapper, {
        callback: () => {}, x: 0, y: 0,
        width: PDF_GEOMETRY.widthMm,
        windowWidth: PDF_GEOMETRY.widthMm / PDF_GEOMETRY.mmPerPx, autoPaging: false,
        fontFaces: getPDFFontFaces(root.dataset.pdfFont ?? 'Noto Sans'),
        html2canvas: {
          scale: PDF_GEOMETRY.mmPerPx, useCORS: true, logging: false,
          onclone: document => rasterizePdfPortraits(document.body),
        },
      });
      pdf.setFont((root.dataset.pdfFont ?? 'Noto Sans').toLowerCase(), 'normal normal 400');
      pdf.setFontSize(8); pdf.setTextColor('#536070');
      pdf.text(`${root.dataset.pageLabel} ${index + 1} / ${pages.length}`, PDF_GEOMETRY.widthMm - PDF_GEOMETRY.marginMm, PDF_GEOMETRY.heightMm - PDF_GEOMETRY.marginMm, { align: 'right' });
    }
    return pdf.output('blob');
  } finally { root.remove(); }
}
