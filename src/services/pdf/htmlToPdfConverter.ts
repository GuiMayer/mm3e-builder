/* ================================================
   HTML to PDF Converter
   Uses jsPDF.html() to convert HTML strings to PDF
   ================================================ */

import { jsPDF } from 'jspdf';

const PAGE_CONTENT_WIDTH_MM = 190;
const PAGE_CONTENT_HEIGHT_MM = 277;
const RENDER_WIDTH_PX = 816;
const PAGE_CONTENT_HEIGHT_PX = (PAGE_CONTENT_HEIGHT_MM / PAGE_CONTENT_WIDTH_MM) * RENDER_WIDTH_PX;
const PAGINATION_EPSILON_PX = 1;
const ATOMIC_ENTRY_SELECTOR = '.power-entry, .equipment-entry, .complication-item';

export interface HtmlToPdfOptions {
  filename: string;
}

/**
 * Returns the height of a transparent spacer needed to move a block to the
 * next page. Oversized blocks are allowed to flow normally: forcing a break
 * before them would only create a nearly empty page and would not prevent a
 * later split.
 */
export function getRequiredPageSpacerHeight(
  pageOffset: number,
  blockHeight: number,
  pageHeight = PAGE_CONTENT_HEIGHT_PX
): number | null {
  if (blockHeight > pageHeight || pageOffset + blockHeight <= pageHeight + PAGINATION_EPSILON_PX) {
    return null;
  }

  return Math.max(0, pageHeight - pageOffset);
}

function getPageOffset(target: HTMLElement, container: HTMLElement): number {
  const relativeTop = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
  return ((relativeTop % PAGE_CONTENT_HEIGHT_PX) + PAGE_CONTENT_HEIGHT_PX) % PAGE_CONTENT_HEIGHT_PX;
}

function insertPageSpacerBefore(target: HTMLElement, container: HTMLElement, blockHeight: number): boolean {
  const spacerHeight = getRequiredPageSpacerHeight(getPageOffset(target, container), blockHeight);
  if (spacerHeight === null || spacerHeight <= PAGINATION_EPSILON_PX) {
    return false;
  }

  const spacer = document.createElement('div');
  spacer.className = 'pdf-page-spacer';
  spacer.setAttribute('aria-hidden', 'true');
  spacer.style.height = `${spacerHeight}px`;
  target.before(spacer);
  return true;
}

/**
 * Adds physical spacers at page boundaries before jsPDF renders the DOM.
 * jsPDF's `autoPaging: 'text'` preserves selectable text but does not expose
 * element-level page-break controls, so CSS print rules alone are not enough.
 */
function addMeasuredPageBreaks(element: HTMLElement): void {
  const container = element.querySelector<HTMLElement>('.pdf-container');
  if (!container) return;

  const sections = Array.from(container.querySelectorAll<HTMLElement>(':scope > .pdf-section'));
  for (const section of sections) {
    const sectionHeight = section.getBoundingClientRect().height;
    const entries = Array.from(section.querySelectorAll<HTMLElement>(ATOMIC_ENTRY_SELECTOR));

    if (entries.length === 0) {
      insertPageSpacerBefore(section, container, sectionHeight);
      continue;
    }

    const title = section.querySelector<HTMLElement>(':scope > .pdf-section-title');
    const firstEntry = entries[0];
    if (title && firstEntry) {
      // Keep a long section's title with its first card so it cannot be orphaned.
      const titleAndFirstEntryHeight = firstEntry.getBoundingClientRect().bottom - title.getBoundingClientRect().top;
      insertPageSpacerBefore(title, container, titleAndFirstEntryHeight);
    }

    for (const entry of entries) {
      insertPageSpacerBefore(entry, container, entry.getBoundingClientRect().height);
    }
  }
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * Convert HTML string to PDF blob
 *
 * @param html - HTML content to convert
 * @param options - Conversion options
 * @returns Promise<Blob> - PDF blob ready for download
 */
export async function convertHtmlToPdf(
  html: string,
  options: HtmlToPdfOptions
): Promise<Blob> {
  // Create temporary DOM element
  const element = document.createElement('div');
  element.innerHTML = html;
  element.style.cssText = `
    position: fixed;
    top: 0;
    left: -100000px;
    width: ${RENDER_WIDTH_PX}px;
    visibility: hidden;
    pointer-events: none;
  `;

  try {
    document.body.appendChild(element);
    await waitForLayout();
    addMeasuredPageBreaks(element);
    element.style.visibility = 'visible';

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });
    pdf.setProperties({ title: options.filename.replace(/\.pdf$/i, '') });

    await new Promise<void>((resolve, reject) => {
      pdf.html(element, {
        callback: () => resolve(),
        margin: 10,
        x: 0,
        y: 0,
        width: 190,
        windowWidth: 816,
        autoPaging: 'text',
        html2canvas: {
          scale: 0.23,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
      }).catch(reject);
    });

    return pdf.output('blob');
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw new Error(`Failed to convert HTML to PDF: ${String(error)}`);
  } finally {
    // Cleanup temporary layout container and its measured spacers.
    element.remove();
  }
}
