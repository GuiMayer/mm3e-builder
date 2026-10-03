type Fit = 'contain' | 'cover' | 'fill';

/** Center a portrait within its output frame without changing the original media. */
export function portraitDrawRect(sourceWidth: number, sourceHeight: number, width: number, height: number, fit: Fit) {
  if (fit === 'fill') return { x: 0, y: 0, width, height };
  const scale = (fit === 'cover' ? Math.max : Math.min)(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale, drawHeight = sourceHeight * scale;
  return { x: (width - drawWidth) / 2, y: (height - drawHeight) / 2, width: drawWidth, height: drawHeight };
}

/** jsPDF's canvas renderer ignores object-fit. Fit only its cloned portrait bitmap,
 * leaving the sheet, exported HTML and stored original untouched. Text stays text. */
export async function rasterizePdfPortraits(root: HTMLElement) {
  for (const image of root.querySelectorAll<HTMLImageElement>('img.pdf-portrait')) {
    await image.decode();
    const bounds = image.getBoundingClientRect();
    if (!image.naturalWidth || !image.naturalHeight || !bounds.width || !bounds.height) continue;
    const canvas = image.ownerDocument.createElement('canvas');
    canvas.width = Math.ceil(bounds.width * 3);
    canvas.height = Math.ceil(bounds.height * 3);
    const context = canvas.getContext('2d');
    if (!context) continue;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const fit = image.style.objectFit === 'cover' || image.style.objectFit === 'fill' ? image.style.objectFit : 'contain';
    const rect = portraitDrawRect(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height, fit);
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    image.src = canvas.toDataURL('image/png');
    await image.decode();
  }
}
