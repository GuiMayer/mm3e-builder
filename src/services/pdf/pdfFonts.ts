import sansRegular from '../../assets/pdf-fonts/NotoSans-Regular.ttf?url';
import sansBold from '../../assets/pdf-fonts/NotoSans-Bold.ttf?url';
import sansItalic from '../../assets/pdf-fonts/NotoSans-Italic.ttf?url';
import serifRegular from '../../assets/pdf-fonts/NotoSerif-Regular.ttf?url';
import serifBold from '../../assets/pdf-fonts/NotoSerif-Bold.ttf?url';
import serifItalic from '../../assets/pdf-fonts/NotoSerif-Italic.ttf?url';

export function resolvePDFFont(font: string): 'Noto Sans' | 'Noto Serif' {
  return ['Noto Serif', 'Times New Roman', 'Georgia'].includes(font) ? 'Noto Serif' : 'Noto Sans';
}

export function getPDFFontFaces(font: string) {
  const family = resolvePDFFont(font);
  const sources = family === 'Noto Sans' ? [sansRegular, sansBold, sansItalic] : [serifRegular, serifBold, serifItalic];
  return sources.map((url, index) => ({
    family, style: index === 2 ? 'italic' as const : 'normal' as const, weight: index === 1 ? 700 as const : 400 as const,
    src: [{ url: typeof window === 'undefined' ? url : new URL(url, window.location.href).href, format: 'truetype' as const }],
  }));
}

export function getPDFFontCSS(font: string): string {
  return getPDFFontFaces(font).map(face => `@font-face{font-family:'${face.family}';font-style:${face.style};font-weight:${face.weight};src:url('${face.src[0].url}') format('truetype');}`).join('\n');
}

export async function waitForPDFFonts(font: string): Promise<void> {
  const family = resolvePDFFont(font);
  await Promise.all([document.fonts.load(`10pt "${family}"`), document.fonts.load(`bold 10pt "${family}"`), document.fonts.load(`italic 10pt "${family}"`)]);
  await document.fonts.ready;
}

const embeddedFontCache = new Map<string, Promise<string>>();

/** Downloaded HTML remains printable offline, with the same licensed fonts. */
export async function embedPDFFontsInHTML(html: string, font: string): Promise<string> {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  for (const face of getPDFFontFaces(font)) {
    const url = face.src[0].url;
    if (!embeddedFontCache.has(url)) embeddedFontCache.set(url, (async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Unable to load PDF font');
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = '';
      for (let index = 0; index < bytes.length; index += 8192) binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
      return `data:font/ttf;base64,${btoa(binary)}`;
    })().catch(error => { embeddedFontCache.delete(url); throw error; }));
    const dataUrl = await embeddedFontCache.get(url)!;
    parsed.querySelectorAll('style').forEach(style => { style.textContent = style.textContent!.split(url).join(dataUrl); });
  }
  return `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}`;
}
