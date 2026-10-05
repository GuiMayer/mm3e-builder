import type { ICharacter } from '../entities/types';
import type { DialogApi } from '../shared/ui/appDialogContext';
import type { TFunction } from 'i18next';
import { downloadBlob } from './downloadHelper';
import { collectLocalPortraits, createPortraitBundle, type BundleKind } from './portraitBundle';

let exporting = false;
export async function exportWithPortraits(data: Blob, filename: string, kind: BundleKind, characters: readonly ICharacter[], dialog: DialogApi, t: TFunction): Promise<void> {
  if (exporting) return;
  exporting = true;
  try {
    let portraits;
    try { portraits = await collectLocalPortraits(characters); }
    catch {
      const choice = await dialog.choose({ title: t('bundle.exportTitle'), message: t('bundle.readError'), choices: [{ value: 'plain', label: t('bundle.exportPlain', { format: kind === 'character' ? 'JSON' : 'JSONL' }) }] });
      if (choice === 'plain') await downloadBlob(data, filename);
      return;
    }
    if (!portraits.length) { await downloadBlob(data, filename); return; }
    const choice = await dialog.choose({
      title: t('bundle.exportTitle'), message: t('bundle.exportMessage', { count: portraits.length }),
      choices: [{ value: 'plain', label: t('bundle.exportPlain', { format: kind === 'character' ? 'JSON' : 'JSONL' }) }, { value: 'zip', label: t('bundle.exportZip') }],
    });
    if (!choice) return;
    if (choice === 'plain') { await downloadBlob(data, filename); return; }
    let zip: Blob;
    try { zip = await createPortraitBundle(data, kind, portraits); }
    catch {
      const fallback = await dialog.choose({ title: t('bundle.exportTitle'), message: t('bundle.createError'), choices: [{ value: 'plain', label: t('bundle.exportPlain', { format: kind === 'character' ? 'JSON' : 'JSONL' }) }] });
      if (fallback === 'plain') await downloadBlob(data, filename);
      return;
    }
    await downloadBlob(zip, filename.replace(/\.(json|jsonl)$/i, '.zip'));
  } finally { exporting = false; }
}
