const PAGINATION_KEY_ATTRIBUTE = 'data-pdf-pagination-key';
const PAGINATION_EPSILON_PX = 1;

interface PaginationBreak {
  beforeKey: string;
  height: number;
  grid: boolean;
}

interface PaginationUnit {
  key: string;
  target: HTMLElement;
  elements: HTMLElement[];
  grid: boolean;
}

interface PaginationTargetSet {
  section: HTMLElement;
  sectionKey: string;
  title: HTMLElement | null;
  units: PaginationUnit[];
}

interface UnitSpec {
  containerSelector: string;
  itemSelector: string;
  columns: number;
  leadingRows?: number;
}

const UNIT_SPECS: UnitSpec[] = [
  { containerSelector: '.powers-list', itemSelector: ':scope > .power-entry', columns: 1 },
  {
    containerSelector: '.equipment-list',
    itemSelector: ':scope > .equipment-entry',
    columns: 1,
  },
  {
    containerSelector: '.complications-list',
    itemSelector: ':scope > .complication-item',
    columns: 1,
  },
  { containerSelector: '.skills-grid', itemSelector: ':scope > .skill-entry', columns: 2 },
  {
    containerSelector: '.advantages-list',
    itemSelector: ':scope > .advantage-entry',
    columns: 2,
  },
  {
    containerSelector: '.offense-table',
    itemSelector: ':scope > .offense-col',
    columns: 5,
    leadingRows: 2,
  },
];

export function getRequiredPageSpacerHeight(
  pageOffset: number,
  blockHeight: number,
  pageHeight: number
): number | null {
  if (
    blockHeight > pageHeight ||
    pageOffset + blockHeight <= pageHeight + PAGINATION_EPSILON_PX
  ) {
    return null;
  }

  return Math.max(0, pageHeight - pageOffset);
}

function chunkElements(
  elements: HTMLElement[],
  columns: number,
  leadingRows = 1
): HTMLElement[][] {
  const firstChunkSize = Math.min(elements.length, columns * leadingRows);
  const chunks: HTMLElement[][] = [];

  if (firstChunkSize > 0) {
    chunks.push(elements.slice(0, firstChunkSize));
  }

  for (let index = firstChunkSize; index < elements.length; index += columns) {
    chunks.push(elements.slice(index, index + columns));
  }

  return chunks;
}

function annotatePaginationTargets(root: HTMLElement): PaginationTargetSet[] {
  const container = root.querySelector<HTMLElement>('.pdf-container');
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(':scope > .pdf-section')).map(
    (section, sectionIndex) => {
      const sectionKey = `section-${sectionIndex}`;
      section.setAttribute(PAGINATION_KEY_ATTRIBUTE, sectionKey);

      const spec = UNIT_SPECS.find(({ containerSelector }) =>
        section.querySelector(containerSelector)
      );
      if (!spec) {
        return {
          section,
          sectionKey,
          title: section.querySelector<HTMLElement>(':scope > .pdf-section-title'),
          units: [],
        };
      }

      const unitContainer = section.querySelector<HTMLElement>(spec.containerSelector);
      const items = unitContainer
        ? Array.from(unitContainer.querySelectorAll<HTMLElement>(spec.itemSelector))
        : [];
      const grid = spec.columns > 1;
      const units = chunkElements(items, spec.columns, spec.leadingRows)
        .map((elements, unitIndex) => {
          const key = `${sectionKey}-unit-${unitIndex}`;
          elements[0]?.setAttribute(PAGINATION_KEY_ATTRIBUTE, key);
          return { key, target: elements[0], elements, grid };
        })
        .filter((unit): unit is PaginationUnit => Boolean(unit.target));

      return {
        section,
        sectionKey,
        title: section.querySelector<HTMLElement>(':scope > .pdf-section-title'),
        units,
      };
    }
  );
}

function getElementsHeight(elements: HTMLElement[]): number {
  if (elements.length === 0) return 0;
  const top = Math.min(...elements.map((element) => element.getBoundingClientRect().top));
  const bottom = Math.max(...elements.map((element) => element.getBoundingClientRect().bottom));
  return bottom - top;
}

function getPageOffset(target: HTMLElement, root: HTMLElement, pageHeight: number): number {
  const relativeTop = target.getBoundingClientRect().top - root.getBoundingClientRect().top;
  return ((relativeTop % pageHeight) + pageHeight) % pageHeight;
}

function createSpacer(height: number, grid: boolean): HTMLDivElement {
  const spacer = document.createElement('div');
  spacer.className = 'pdf-pagination-spacer';
  spacer.setAttribute('aria-hidden', 'true');
  spacer.style.height = `${height}px`;
  spacer.style.minHeight = `${height}px`;
  spacer.style.width = '100%';
  if (grid) spacer.style.gridColumn = '1 / -1';
  return spacer;
}

function measureAndInsertBreak(
  target: HTMLElement,
  blockHeight: number,
  root: HTMLElement,
  pageHeight: number,
  beforeKey: string,
  grid: boolean
): PaginationBreak | null {
  const spacerHeight = getRequiredPageSpacerHeight(
    getPageOffset(target, root, pageHeight),
    blockHeight,
    pageHeight
  );

  if (spacerHeight === null || spacerHeight <= PAGINATION_EPSILON_PX) return null;

  target.before(createSpacer(spacerHeight, grid));
  return { beforeKey, height: spacerHeight, grid };
}

function createPaginationPlan(measurementRoot: HTMLElement, pageHeight: number): PaginationBreak[] {
  const targets = annotatePaginationTargets(measurementRoot);
  const breaks: PaginationBreak[] = [];

  for (const targetSet of targets) {
    const sectionHeight = targetSet.section.getBoundingClientRect().height;

    if (sectionHeight <= pageHeight) {
      const pageBreak = measureAndInsertBreak(
        targetSet.section,
        sectionHeight,
        measurementRoot,
        pageHeight,
        targetSet.sectionKey,
        false
      );
      if (pageBreak) breaks.push(pageBreak);
      continue;
    }

    const firstUnit = targetSet.units[0];
    if (targetSet.title && firstUnit) {
      const firstUnitBottom = Math.max(
        ...firstUnit.elements.map((element) => element.getBoundingClientRect().bottom)
      );
      const titleAndFirstUnitHeight = firstUnitBottom - targetSet.title.getBoundingClientRect().top;
      const pageBreak = measureAndInsertBreak(
        targetSet.section,
        titleAndFirstUnitHeight,
        measurementRoot,
        pageHeight,
        targetSet.sectionKey,
        false
      );
      if (pageBreak) breaks.push(pageBreak);
    }

    for (const unit of targetSet.units) {
      const pageBreak = measureAndInsertBreak(
        unit.target,
        getElementsHeight(unit.elements),
        measurementRoot,
        pageHeight,
        unit.key,
        unit.grid
      );
      if (pageBreak) breaks.push(pageBreak);
    }
  }

  return breaks;
}

function applyPaginationPlan(renderRoot: HTMLElement, breaks: PaginationBreak[]): void {
  annotatePaginationTargets(renderRoot);

  for (const pageBreak of breaks) {
    const target = renderRoot.querySelector<HTMLElement>(
      `[${PAGINATION_KEY_ATTRIBUTE}="${pageBreak.beforeKey}"]`
    );
    target?.before(createSpacer(pageBreak.height, pageBreak.grid));
  }

  renderRoot.querySelectorAll<HTMLElement>(`[${PAGINATION_KEY_ATTRIBUTE}]`).forEach((element) => {
    element.removeAttribute(PAGINATION_KEY_ATTRIBUTE);
  });
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/**
 * Measures a disposable off-screen copy, then applies only the resulting
 * spacers to the clean render tree. The off-screen styles can never leak into
 * the element passed to jsPDF.html().
 */
export async function paginateHtmlForPdf(
  html: string,
  renderWidth: number,
  pageHeight: number
): Promise<HTMLElement> {
  const renderRoot = document.createElement('div');
  renderRoot.innerHTML = html;

  const measurementRoot = renderRoot.cloneNode(true) as HTMLElement;
  measurementRoot.setAttribute('aria-hidden', 'true');
  measurementRoot.style.cssText = `
    position: fixed;
    top: 0;
    left: -100000px;
    width: ${renderWidth}px;
    visibility: hidden;
    pointer-events: none;
  `;

  document.body.appendChild(measurementRoot);
  try {
    await document.fonts?.ready;
    await waitForLayout();
    const plan = createPaginationPlan(measurementRoot, pageHeight);
    applyPaginationPlan(renderRoot, plan);
    return renderRoot;
  } finally {
    measurementRoot.remove();
  }
}
