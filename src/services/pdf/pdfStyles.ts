import type { PDFCustomizationOptions } from './types';
import { COLOR_THEMES } from './types';
import { getPDFFontCSS, resolvePDFFont } from './pdfFonts';
import { PDF_CONTENT_WIDTH_PX, PDF_GEOMETRY } from './pdfGeometry';

export function getPDFStyles(options: PDFCustomizationOptions): string {
  const color = options.colorScheme === 'mono' ? '#222222' : COLOR_THEMES[options.colorScheme].primary;
  const size = { small: 9, medium: 10, large: 11 }[options.fontSize];
  const gap = options.layoutMode === 'compact' ? 4 : 7;
  return `${getPDFFontCSS(options.fontFamily)}
.pdf-container,.pdf-page{font-family:'${resolvePDFFont(options.fontFamily)}',sans-serif;font-size:${size}pt;line-height:1.35;color:#202b3a;box-sizing:border-box;width:${PDF_CONTENT_WIDTH_PX}px;display:flow-root;overflow-wrap:anywhere;}
.pdf-container *,.pdf-page *{box-sizing:border-box;}
.pdf-container{margin:0 auto;padding:0;}
.pdf-page{margin:0;background:white;padding:0;}
.pdf-section{margin:0 0 ${gap + 3}px;}
.pdf-section-title{display:flex;justify-content:space-between;align-items:baseline;font-size:${size + 1}pt;font-weight:700;color:${color};border-bottom:1px solid ${color};padding-bottom:3px;margin:0 0 5px;}
.section-cost{font-weight:400;font-size:${Math.max(8, size - 1)}pt;color:#536070;white-space:nowrap;margin-left:8px;}
.pdf-header{border-bottom:2px solid ${color};margin-bottom:${gap + 4}px;padding-bottom:${gap}px;}
.header-main{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}
.character-name{flex:1;min-width:0;font-size:${size + 8}pt;line-height:1.15;font-weight:700;color:${color};}
.header-stats{font-weight:700;white-space:nowrap;color:${color};}
.header-fields,.header-details{display:flex;flex-wrap:wrap;gap:2px 14px;margin-top:4px;font-size:${Math.max(8, size - 1)}pt;}
.header-field-label{color:#536070;}
.pp-summary-compact{font-size:${Math.max(8, size - 1)}pt;margin-top:5px;display:flex;flex-wrap:wrap;gap:4px 12px;}
.pp-summary-compact strong{color:${color};}
.abilities-grid,.defenses-grid{display:flex;gap:4px;}
.ability-box,.defense-box{flex:1;min-width:0;text-align:center;border:1px solid #ccd2dc;padding:${gap}px 2px;background:#f8f9fb;}
.ability-name,.defense-name{font-size:${Math.max(8, size - 1)}pt;line-height:1.15;color:#475569;}
.ability-value,.defense-value{font-size:${size + 5}pt;line-height:1.3;font-weight:700;color:${color};}
.defense-breakdown{font-size:8pt;color:#536070;}
.pdf-columns{display:flex;gap:14px;margin-bottom:${gap + 3}px;}
.pdf-columns>.pdf-section{width:calc(50% - 7px);margin:0;}
.pdf-columns>.pdf-section:only-child{width:100%;}
.skills-grid,.advantages-list{display:block;}
.skill-entry{display:flex;align-items:baseline;gap:6px;padding:3px 0;border-bottom:1px solid #edf0f4;font-size:${Math.max(9, size - 1)}pt;}
.skill-name{flex:1;min-width:0;}
.skill-ranks{font-size:8pt;color:#536070;white-space:nowrap;}
.skill-total{font-weight:700;min-width:22px;text-align:right;color:${color};}
.advantage-entry{padding:3px 0;border-bottom:1px solid #edf0f4;font-size:${Math.max(9, size - 1)}pt;}
.advantage-rank{float:right;font-weight:700;}
.offense-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:${Math.max(9, size - 1)}pt;}
.offense-table th{text-align:left;font-size:8pt;font-weight:700;color:#536070;}
.offense-table th,.offense-table td{padding:4px 5px;vertical-align:top;border-bottom:1px solid #dce1e8;overflow-wrap:anywhere;}
.offense-table tr:nth-child(even){background:#f6f8fa;}
.offense-table th:nth-child(1){width:22%;}.offense-table th:nth-child(2){width:8%;}.offense-table th:nth-child(3){width:15%;}.offense-table th:nth-child(4){width:21%;}.offense-table th:nth-child(5){width:34%;}
.offense-table td:nth-child(2){text-align:center;font-weight:700;}
.power-entry,.equipment-entry{padding:${gap}px 0;border-bottom:1px solid #dce1e8;margin:0;}
.power-header{display:flex;justify-content:space-between;gap:12px;font-weight:700;align-items:baseline;margin-bottom:2px;}
.power-cost{font-size:9pt;color:${color};white-space:nowrap;}
.power-effects{font-size:${Math.max(9, size - 1)}pt;}
.power-description{font-size:${Math.max(8.5, size - 1)}pt;color:#475569;margin-top:2px;white-space:pre-wrap;}
.power-alternate{margin:3px 0 3px 12px;border-left:1px solid #ccd2dc;padding-left:7px;font-size:${Math.max(9, size - 1)}pt;}
.complication-item{font-size:${Math.max(9, size - 1)}pt;padding:3px 0;}
.notes-section{font-size:${Math.max(9, size - 1)}pt;}
.notes-section p{margin:0 0 5px;white-space:pre-wrap;}
.text-muted{color:#536070;}.text-small,.text-sm{font-size:8.5pt;}
.pdf-page-heading{font-size:8pt;color:#536070;border-bottom:1px solid #dce1e8;margin-bottom:8px;padding-bottom:4px;}
.pdf-continuation{font-size:8pt;font-weight:400;color:#536070;}
@page{size:A4;margin:${PDF_GEOMETRY.marginMm}mm;}
@media print{.pdf-page{break-after:page;}.pdf-page:last-child{break-after:auto;}}
`;
}
