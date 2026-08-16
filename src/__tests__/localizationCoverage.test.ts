/// <reference types="node" />

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import i18next from 'i18next';
import { describe, expect, it } from 'vitest';
import en from '../locales/en/translation.json';
import ptBR from '../locales/pt-BR/translation.json';

const english = en as Record<string, string>;
const portuguese = ptBR as Record<string, string>;
const sourceRoot = fileURLToPath(new URL('../', import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('localization coverage', () => {
  it('keeps English and pt-BR translation keys in parity', () => {
    expect(Object.keys(portuguese).sort()).toEqual(Object.keys(english).sort());
  });

  it('does not silently overwrite duplicate JSON translation keys', () => {
    for (const locale of ['en', 'pt-BR']) {
      const path = join(sourceRoot, 'locales', locale, 'translation.json');
      const keys = [...readFileSync(path, 'utf8').matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]);
      const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
      expect([...new Set(duplicates)], `${locale} duplicate keys`).toEqual([]);
    }
  });

  it('defines every statically referenced translation key', () => {
    const missing = new Map<string, string[]>();
    const translationCall = /\bt\(\s*['"]([^'"]+)['"]/g;

    for (const file of sourceFiles(sourceRoot)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(translationCall)) {
        const key = match[1];
        const directKeyExists = key in english && key in portuguese;
        const pluralKeysExist = `${key}_one` in english
          && `${key}_other` in english
          && `${key}_one` in portuguese
          && `${key}_other` in portuguese;
        if (directKeyExists || pluralKeysExist) continue;
        missing.set(key, [...(missing.get(key) ?? []), file]);
      }
    }

    expect(Object.fromEntries(missing)).toEqual({});
  });

  it('includes the dynamic Resource labels and Portuguese dialog copy', () => {
    const requiredKeys = [
      'resources.type.gadget',
      'resources.type.gear',
      'resources.type.vehicle',
      'resources.type.headquarters',
      'resources.type.custom',
      'resources.size.miniscule',
      'resources.size.awesome',
      'resources.deleteInUse_one',
      'resources.deleteInUse_other',
      'resources.restoreMessage_one',
      'resources.restoreMessage_other',
      'draft.updateTitle',
      'draft.clearAcknowledgement',
      'draft.recovery.unrecoverable',
      'draft.saveError.storageFull',
    ];

    for (const key of requiredKeys) {
      expect(english[key], `missing English ${key}`).toBeTruthy();
      expect(portuguese[key], `missing pt-BR ${key}`).toBeTruthy();
    }

    expect(portuguese['resources.title']).toBe('Recursos');
    expect(portuguese['draft.updateTitle']).toBe('Atualização detectada');
    expect(portuguese['draft.clearAction']).toBe('Limpar todos os dados');
  });

  it('resolves pt-BR Resource plurals at runtime', async () => {
    const instance = i18next.createInstance();
    await instance.init({ lng: 'pt-BR', resources: { 'pt-BR': { translation: ptBR } } });

    expect(instance.t('resources.deleteInUse', { count: 1 })).toContain('1 aba de personagem');
    expect(instance.t('resources.deleteInUse', { count: 2 })).toContain('2 abas de personagem');
    expect(instance.t('resources.restoreMessage', { count: 1, warning: '' })).toContain('1 Recurso');
    expect(instance.t('resources.restoreMessage', { count: 2, warning: '' })).toContain('2 Recursos');
  });
});
