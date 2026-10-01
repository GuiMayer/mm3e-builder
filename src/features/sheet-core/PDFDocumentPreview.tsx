import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask, TextLayer } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDF_GEOMETRY } from '../../services/pdf/pdfGeometry';
import './pdfTextLayer.css';

const MIN_ZOOM = 25;
const MAX_ZOOM = 300;
const ZOOM_STEP = 10;
const PAGE_WIDTH = PDF_GEOMETRY.widthMm / PDF_GEOMETRY.mmPerPx;
const PAGE_HEIGHT = PDF_GEOMETRY.heightMm / PDF_GEOMETRY.mmPerPx;
const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value)));

/** Render the exported bytes without depending on a browser's native PDF plugin. */
export function PDFDocumentPreview({ url }: { url: string }) {
  const { t } = useTranslation();
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [zoomInput, setZoomInput] = useState('100');
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const autoFitRef = useRef(false);
  const zoomInputDirtyRef = useRef(false);

  const fitPage = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !viewport.clientWidth || !viewport.clientHeight) return;
    const fitted = clampZoom(Math.floor(100 * Math.min(
      Math.max(1, viewport.clientWidth - 24) / PAGE_WIDTH,
      Math.max(1, viewport.clientHeight - 84) / PAGE_HEIGHT,
    )));
    zoomInputDirtyRef.current = false;
    setZoom(fitted);
    setZoomInput(String(fitted));
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => { if (autoFitRef.current) fitPage(); });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fitPage]);

  function applyZoom(value: number) {
    zoomInputDirtyRef.current = false;
    if (!Number.isFinite(value)) { setZoomInput(String(zoom)); return; }
    autoFitRef.current = false;
    const next = clampZoom(value);
    setZoom(next);
    setZoomInput(String(next));
  }

  function commitZoomInput() {
    if (!zoomInputDirtyRef.current) return;
    zoomInputDirtyRef.current = false;
    if (!zoomInput.trim()) { setZoomInput(String(zoom)); return; }
    applyZoom(Number(zoomInput));
  }

  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | undefined;
    void (async () => {
      const pdfjs = await import('pdfjs-dist');
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      task = pdfjs.getDocument({ url });
      const loaded = await task.promise;
      if (!cancelled) setDocument(loaded);
    })().catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; void task?.destroy().catch(() => {}); };
  }, [url]);

  useEffect(() => {
    if (!document) return;
    let cancelled = false;
    let task: RenderTask | undefined;
    let textLayer: TextLayer | undefined;
    let release: (() => void) | undefined;
    void (async () => {
      const page = await document.getPage(pageNumber);
      if (cancelled) return;
      release = () => page.cleanup();
      const canvas = canvasRef.current;
      const textContainer = textLayerRef.current;
      if (!canvas || !textContainer) return;
      textContainer.replaceChildren();
      const viewport = page.getViewport({ scale: 2 });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      task = page.render({ canvas, viewport });
      await task.promise;
      if (cancelled) return;
      const content = await page.getTextContent();
      const { TextLayer } = await import('pdfjs-dist');
      if (cancelled) return;
      const textViewport = page.getViewport({ scale: 96 / 72 });
      textLayer = new TextLayer({ textContentSource: content, container: textContainer, viewport: textViewport });
      // Keep fractional page dimensions, matching the scaled PDF rather than
      // rounding the selectable layer to whole CSS pixels.
      textContainer.style.width = `${textViewport.width}px`;
      textContainer.style.height = `${textViewport.height}px`;
      await textLayer.render();
      if (!cancelled) {
        setRendering(false);
      }
    })().catch(() => { if (!cancelled) { setError(true); setRendering(false); } });
    return () => { cancelled = true; task?.cancel(); textLayer?.cancel(); release?.(); };
  }, [document, pageNumber]);

  function changePage(next: number) {
    setRendering(true);
    setPageNumber(next);
  }

  const pageLabel = t('pdf.preview.pageCount', { page: pageNumber, total: document?.numPages ?? '...' });
  return <div className="pdf-document-preview">
    <div className="pdf-document-toolbar">
      <button disabled={!document || rendering || pageNumber <= 1} onClick={() => changePage(pageNumber - 1)} aria-label={t('pdf.preview.previousPage')}>&lsaquo;</button>
      <span aria-live="polite">{pageLabel}</span>
      <button disabled={!document || rendering || pageNumber >= document.numPages} onClick={() => changePage(pageNumber + 1)} aria-label={t('pdf.preview.nextPage')}>&rsaquo;</button>
      <label className="pdf-document-zoom-field">{t('pdf.preview.zoom')}
        <input type="number" inputMode="numeric" min={MIN_ZOOM} max={MAX_ZOOM} step={1}
          value={zoomInput} title={t('pdf.preview.zoomLimits', { min: MIN_ZOOM, max: MAX_ZOOM })}
          onChange={event => {
            const value = event.target.value;
            zoomInputDirtyRef.current = true;
            setZoomInput(value);
            const numeric = Number(value);
            if (value.trim() && Number.isFinite(numeric) && numeric >= MIN_ZOOM && numeric <= MAX_ZOOM) {
              autoFitRef.current = false;
              setZoom(Math.round(numeric));
            }
          }} onBlur={commitZoomInput}
          onKeyDown={event => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') { event.stopPropagation(); zoomInputDirtyRef.current = false; setZoomInput(String(zoom)); }
          }} />
        <span aria-hidden="true">%</span>
      </label>
      <button className="pdf-document-fit" onClick={() => { autoFitRef.current = true; fitPage(); }}>{t('pdf.preview.fitPage')}</button>
    </div>
    <div className="pdf-document-viewport" ref={viewportRef}>
    <div className="pdf-document-scroll" aria-busy={rendering && !error}>
      {error ? <p role="alert">{t('pdf.preview.error')}</p> : <>
        {rendering && <p className="pdf-document-loading" role="status">{t('pdf.preview.loading')}</p>}
        <div className="pdf-document-paper" role="group" aria-label={pageLabel} style={{ width: `${PAGE_WIDTH * zoom / 100}px`, opacity: rendering ? 0 : 1 }}>
          <canvas ref={canvasRef} aria-hidden="true" />
          <div ref={textLayerRef} className="pdf-document-text-layer" style={{ transform: `scale(${zoom / 100})` }} />
        </div>
      </>}
    </div>
    <div className="pdf-document-floating-zoom" role="group" aria-label={t('pdf.preview.zoom')}>
      <button disabled={!document || error || zoom <= MIN_ZOOM} onClick={() => applyZoom(zoom - ZOOM_STEP)} aria-label={t('pdf.preview.zoomOut')} title={t('pdf.preview.zoomOut')}>&minus;</button>
      <button disabled={!document || error || zoom >= MAX_ZOOM} onClick={() => applyZoom(zoom + ZOOM_STEP)} aria-label={t('pdf.preview.zoomIn')} title={t('pdf.preview.zoomIn')}>+</button>
    </div>
    </div>
    <style>{`
      .pdf-document-preview{height:100%;min-height:0;display:flex;flex-direction:column;color:var(--c-text,#eee);}
      .pdf-document-toolbar{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:8px;padding:6px 0 12px;font-size:0.85rem;flex-shrink:0;}
      .pdf-document-toolbar button,.pdf-document-toolbar input{color:inherit;background:var(--c-surface,#252525);border:1px solid var(--c-border,#555);border-radius:4px;min-height:32px;}
      .pdf-document-toolbar button{font-size:1.5rem;min-width:36px;cursor:pointer;}.pdf-document-toolbar button:disabled{opacity:0.4;cursor:default;}
      .pdf-document-toolbar .pdf-document-fit{font-size:0.8rem;padding:0 8px;}
      .pdf-document-zoom-field{margin-left:8px;display:inline-flex;align-items:center;gap:5px;}
      .pdf-document-zoom-field input{width:68px;text-align:center;font:inherit;}
      .pdf-document-viewport{position:relative;display:flex;flex:1;min-height:0;min-width:0;}
      .pdf-document-scroll{overflow:auto;flex:1;min-height:0;min-width:0;position:relative;padding:12px 12px 72px;}
      .pdf-document-paper{position:relative;background:white;box-shadow:0 2px 10px #0005;margin:0 auto;}
      .pdf-document-paper canvas{display:block;width:100%;height:auto;}
      .pdf-document-loading{position:absolute;inset:30px 0 auto;text-align:center;}
      .pdf-document-floating-zoom{position:absolute;right:20px;bottom:12px;display:flex;gap:2px;padding:3px;background:rgba(30,34,42,0.9);border:1px solid #ffffff26;border-radius:24px;box-shadow:0 2px 8px #0003;backdrop-filter:blur(6px);}
      .pdf-document-floating-zoom button{width:40px;height:40px;border:0;border-radius:50%;background:transparent;color:#eee;font-size:1.3rem;cursor:pointer;}
      .pdf-document-floating-zoom button:hover:not(:disabled){background:#ffffff18;}
      .pdf-document-floating-zoom button:focus-visible{outline:2px solid var(--c-primary,#3b82f6);outline-offset:1px;}
      .pdf-document-floating-zoom button:disabled{opacity:0.35;cursor:default;}
      @media(max-width:768px){.pdf-document-floating-zoom button{width:44px;height:44px;}}
    `}</style>
  </div>;
}
