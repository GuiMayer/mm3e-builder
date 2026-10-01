import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/** Render the exported bytes without depending on a browser's native PDF plugin. */
export function PDFDocumentPreview({ url }: { url: string }) {
  const { t } = useTranslation();
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState(false);
  const [pageText, setPageText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let release: (() => void) | undefined;
    void (async () => {
      const page = await document.getPage(pageNumber);
      if (cancelled) return;
      release = () => page.cleanup();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const viewport = page.getViewport({ scale: 2 });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      task = page.render({ canvas, viewport });
      await task.promise;
      const content = await page.getTextContent();
      if (!cancelled) {
        setPageText(content.items.map(item => 'str' in item ? item.str : '').join(' '));
        setRendering(false);
      }
    })().catch(() => { if (!cancelled) { setError(true); setRendering(false); } });
    return () => { cancelled = true; task?.cancel(); release?.(); };
  }, [document, pageNumber]);

  function changePage(next: number) {
    setRendering(true);
    setPageText('');
    setPageNumber(next);
  }

  const pageLabel = t('pdf.preview.pageCount', { page: pageNumber, total: document?.numPages ?? '...' });
  return <div className="pdf-document-preview">
    <div className="pdf-document-toolbar">
      <button disabled={!document || rendering || pageNumber <= 1} onClick={() => changePage(pageNumber - 1)} aria-label={t('pdf.preview.previousPage')}>&lsaquo;</button>
      <span aria-live="polite">{pageLabel}</span>
      <button disabled={!document || rendering || pageNumber >= document.numPages} onClick={() => changePage(pageNumber + 1)} aria-label={t('pdf.preview.nextPage')}>&rsaquo;</button>
      <label>{t('pdf.preview.zoom')} <select value={zoom} onChange={event => setZoom(Number(event.target.value))}>
        <option value={1}>{t('pdf.preview.fitWidth')}</option><option value={1.5}>150%</option><option value={2}>200%</option>
      </select></label>
    </div>
    <div className="pdf-document-scroll" aria-busy={rendering && !error}>
      {error ? <p role="alert">{t('pdf.preview.error')}</p> : <>
        {rendering && <p className="pdf-document-loading" role="status">{t('pdf.preview.loading')}</p>}
        <div className="pdf-document-paper" style={{ width: `${zoom * 100}%`, opacity: rendering ? 0 : 1 }}>
          <canvas ref={canvasRef} role="img" aria-label={pageLabel} />
          <p className="pdf-document-accessible-text">{pageText}</p>
        </div>
      </>}
    </div>
    <style>{`
      .pdf-document-preview{height:100%;min-height:0;display:flex;flex-direction:column;color:var(--c-text,#eee);}
      .pdf-document-toolbar{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:8px;padding:6px 0 12px;font-size:0.85rem;flex-shrink:0;}
      .pdf-document-toolbar button,.pdf-document-toolbar select{color:inherit;background:var(--c-surface,#252525);border:1px solid var(--c-border,#555);border-radius:4px;min-height:32px;}
      .pdf-document-toolbar button{font-size:1.5rem;min-width:36px;cursor:pointer;}.pdf-document-toolbar button:disabled{opacity:0.4;cursor:default;}
      .pdf-document-toolbar label{margin-left:8px;}
      .pdf-document-scroll{overflow:auto;flex:1;min-height:0;position:relative;padding:0 4px 12px;}
      .pdf-document-paper{background:white;box-shadow:0 2px 10px #0005;margin:0 auto;max-width:1700px;}
      .pdf-document-paper canvas{display:block;width:100%;height:auto;}
      .pdf-document-loading{position:absolute;inset:30px 0 auto;text-align:center;}
      .pdf-document-accessible-text{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;}
    `}</style>
  </div>;
}
