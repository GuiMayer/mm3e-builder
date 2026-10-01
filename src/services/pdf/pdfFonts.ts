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
