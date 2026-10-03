import { waitForPDFFonts } from './pdfFonts';

const EPSILON = 0.5;
interface Fragment { frame: HTMLElement; targets: HTMLElement[] }
interface Group { create: (continued: boolean) => Fragment; units: HTMLElement[][] }

/** Kept for consumers that need to decide whether an atomic row fits. */
export function fitsOnPdfPage(contentHeight: number, pageHeight: number): boolean {
  return contentHeight <= pageHeight + EPSILON;
}

function clone(element: HTMLElement): HTMLElement { return element.cloneNode(true) as HTMLElement; }

function sectionGroup(section: HTMLElement, continuation: string): Group {
  const title = section.querySelector<HTMLElement>(':scope > .pdf-section-title');
  const list = section.querySelector<HTMLElement>(':scope > .powers-list,:scope > .equipment-list,:scope > .complications-list,:scope > .notes-section,:scope > .skills-grid,:scope > .advantages-list,:scope > .offense-table');
  const table = list?.tagName === 'TABLE';
  const items = list ? Array.from((table ? list.querySelector('tbody')! : list).children) as HTMLElement[] : Array.from(section.children).filter(item => item !== title) as HTMLElement[];
  return {
    units: items.map(item => [item]),
    create: continued => {
      const frame = section.cloneNode(false) as HTMLElement;
      if (title) {
        const heading = clone(title);
        if (continued) { const label = document.createElement('span'); label.className = 'pdf-continuation'; label.textContent = ` (${continuation})`; heading.firstChild?.after(label); }
        frame.append(heading);
      }
      if (!list) return { frame, targets: [frame] };
      // Keep introductory context, including campaign budget/mode, with repeated tables.
      for (const child of Array.from(section.children)) {
        if (child === list) break;
        if (child !== title) frame.append(child.cloneNode(true));
      }
      const container = list.cloneNode(false) as HTMLElement;
      frame.append(container);
      if (!table) return { frame, targets: [container] };
      const header = list.querySelector('thead');
      if (header) container.append(header.cloneNode(true));
      const body = document.createElement('tbody'); container.append(body);
      return { frame, targets: [body] };
    },
  };
}

function getGroup(element: HTMLElement, continuation: string): Group {
  if (element.classList.contains('pdf-columns')) {
    const columns = Array.from(element.children).map(section => sectionGroup(section as HTMLElement, continuation));
    const count = Math.max(0, ...columns.map(column => column.units.length));
    return {
      units: Array.from({ length: count }, (_, index) => columns.map(column => column.units[index]?.[0] ?? document.createElement('div'))),
      create: continued => {
        const frame = element.cloneNode(false) as HTMLElement;
        const fragments = columns.map(column => column.create(continued));
        fragments.forEach(fragment => frame.append(fragment.frame));
        return { frame, targets: fragments.map(fragment => fragment.targets[0]) };
      },
    };
  }
  if (element.classList.contains('pdf-section')) return sectionGroup(element, continuation);
  return { units: [[element]], create: () => ({ frame: document.createElement('div'), targets: [] }) };
}

function textWithBreaks(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node instanceof HTMLElement && node.tagName === 'BR') return '\n';
  const text = Array.from(node.childNodes).map(textWithBreaks).join('');
  return node instanceof HTMLElement && ['DIV', 'P', 'TD'].includes(node.tagName) ? `${text}\n` : text;
}

/** Measures physical pages, repeats section/table headings and splits oversized content.
 * No spacers and no second automatic pagination pass are involved in PDF conversion.
 */
export async function paginateHtmlForPdf(html: string, width: number, height: number): Promise<HTMLElement> {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const source = parsed.querySelector<HTMLElement>('.pdf-container');
  if (!source) throw new Error('Missing PDF content');
  const root = document.createElement('div');
  parsed.querySelectorAll('style').forEach(style => root.append(document.importNode(style, true)));
  const pages = document.createElement('div'); pages.className = 'pdf-pages'; root.append(pages);
  const measurement = document.createElement('div');
  measurement.style.cssText = `position:fixed;left:-100000px;top:0;width:${width}px;visibility:hidden;pointer-events:none;`;
  measurement.setAttribute('aria-hidden', 'true'); measurement.append(root); document.body.append(measurement);
  let page: HTMLElement;
  let fragment!: Fragment;
  const newPage = () => {
    page = document.createElement('div'); page.className = 'pdf-page'; page.style.width = `${width}px`; pages.append(page);
    if (pages.children.length > 1 && source.dataset.characterName) {
      const heading = document.createElement('div'); heading.className = 'pdf-page-heading'; heading.textContent = source.dataset.characterName; page.append(heading);
    }
  };
  const fits = () => fitsOnPdfPage(page.getBoundingClientRect().height, height);
  try {
    await waitForPDFFonts(source.dataset.pdfFont ?? 'Noto Sans');
    await Promise.all(Array.from(source.querySelectorAll('img')).map(image => image.decode().catch(() => undefined)));
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    newPage();
    for (const element of Array.from(source.children) as HTMLElement[]) {
      const group = getGroup(element, source.dataset.continuationLabel ?? 'continued');
      let continued = false;
      let fragmentHasContent = false;
      const newFragment = () => { fragment = group.create(continued); page.append(fragment.frame); fragmentHasContent = false; };
      newFragment();
      const appendNodes = (nodes: HTMLElement[]) => nodes.forEach((node, index) => (fragment.targets[index] ?? fragment.frame).append(node));
      const hasEarlierContent = () => page.children.length > (pages.children.length > 1 ? 2 : 1);
      const advance = () => {
        continued ||= fragmentHasContent;
        if (!fragmentHasContent) fragment.frame.remove();
        newPage(); newFragment();
      };
      const addUnit = (originals: HTMLElement[], splittable = true) => {
        const nodes = originals.map(clone); appendNodes(nodes);
        if (fits()) { fragmentHasContent = true; return; }
        nodes.forEach(node => node.remove());
        // Keep a heading with its first row. Reclaim the empty frame before deciding.
        const probe = document.createElement('div'); probe.className = 'pdf-page'; probe.style.width = `${width}px`;
        const candidate = group.create(true);
        if (source.dataset.characterName) {
          const runningHeading = document.createElement('div');
          runningHeading.className = 'pdf-page-heading';
          runningHeading.textContent = source.dataset.characterName;
          probe.append(runningHeading);
        }
        probe.append(candidate.frame);
        originals.forEach((original, index) => (candidate.targets[index] ?? candidate.frame).append(clone(original)));
        measurement.append(probe);
        const fitsFreshPage = fitsOnPdfPage(probe.getBoundingClientRect().height, height);
        probe.remove();
        // Oversized text uses the current page's remaining space before continuing.
        if (fitsFreshPage && (fragmentHasContent || hasEarlierContent())) advance();
        appendNodes(nodes);
        if (fits()) { fragmentHasContent = true; return; }
        nodes.forEach(node => node.remove());
        // A very long power is divided by its components/alternates/notes.
        if (splittable && originals.length === 1 && originals[0].matches('.power-entry,.equipment-entry')) {
          const original = originals[0];
          const header = original.querySelector<HTMLElement>(':scope > .power-header');
          const children = Array.from(original.children).filter(child => child !== header).flatMap(child => child.classList.contains('power-alternate') ? Array.from(child.children).map((line, index) => {
            const wrapper = child.cloneNode(false) as HTMLElement;
            if (index > 0 && child.firstElementChild) wrapper.append(child.firstElementChild.cloneNode(true));
            wrapper.append(line.cloneNode(true)); return wrapper;
          }) : [child as HTMLElement]);
          children.forEach((child, index) => { const part = original.cloneNode(false) as HTMLElement; if (header) part.append(clone(header)); part.append(clone(child)); part.dataset.pdfPart = String(index); addUnit([part], false); });
          return;
        }
        // Split the text of an oversized paragraph, cell or component at word boundaries.
        // Slice long unbroken tokens too; nothing is truncated.
        const tableRow = originals.length === 1 && originals[0].tagName === 'TR';
        const powerHeader = originals.length === 1 && originals[0].matches('.power-entry,.equipment-entry')
          ? originals[0].querySelector<HTMLElement>(':scope > .power-header') : null;
        const textSources = tableRow ? Array.from(originals[0].children) as HTMLElement[] : originals.map(original => {
          if (!powerHeader) return original;
          const body = clone(original);
          body.querySelector(':scope > .power-header')?.remove();
          return body;
        });
        const tokens = textSources.map(original => textWithBreaks(original).match(/\S+\s*|\s+/g) ?? ['']);
        const positions = tokens.map(() => 0);
        while (tokens.some((items, index) => positions[index] < items.length)) {
          const chunks = textSources.map(original => { const node = powerHeader ? document.createElement('div') : original.cloneNode(false) as HTMLElement; node.style.whiteSpace = 'pre-wrap'; return node; });
          const wrappers = powerHeader ? chunks.map(chunk => {
            const wrapper = originals[0].cloneNode(false) as HTMLElement;
            wrapper.append(clone(powerHeader), chunk);
            return wrapper;
          }) : chunks;
          const row = tableRow ? originals[0].cloneNode(false) as HTMLElement : null;
          if (row) { row.append(...chunks); appendNodes([row]); } else appendNodes(wrappers);
          let progress = false;
          chunks.forEach((chunk, index) => {
            const start = positions[index];
            let low = start, high = tokens[index].length;
            while (low < high) {
              const mid = Math.ceil((low + high) / 2); chunk.textContent = tokens[index].slice(start, mid).join('');
              if (fits()) low = mid; else high = mid - 1;
            }
            chunk.textContent = tokens[index].slice(start, low).join(''); positions[index] = low;
            progress ||= low > start;
          });
          if (!progress) {
            row?.remove();
            wrappers.forEach(wrapper => wrapper.remove());
            if (fragmentHasContent || hasEarlierContent()) { advance(); continue; }
            // An enormous single token is split into Unicode code points, preserving accents.
            const index = tokens.findIndex((items, i) => positions[i] < items.length);
            const token = tokens[index][positions[index]];
            if (Array.from(token).length <= 1) throw new Error('PDF content cannot fit within page geometry');
            tokens[index].splice(positions[index], 1, ...Array.from(token));
            continue;
          }
          fragmentHasContent = true;
          if (tokens.some((items, index) => positions[index] < items.length)) advance();
        }
      };
      group.units.forEach(unit => addUnit(unit));
      if (!fragmentHasContent) fragment.frame.remove();
    }
    root.dataset.characterName = source.dataset.characterName ?? '';
    root.dataset.pdfFont = source.dataset.pdfFont ?? 'Noto Sans';
    root.dataset.pageLabel = source.dataset.pageLabel ?? 'Page';
    Array.from(pages.children).forEach(page => {
      (page as HTMLElement).dataset.contentHeight = String(page.getBoundingClientRect().height);
    });
    return root;
  } finally { root.remove(); measurement.remove(); }
}
