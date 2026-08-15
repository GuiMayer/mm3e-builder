import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = resolve(projectRoot, 'dist');
const indexPath = resolve(distDirectory, 'index.html');
const indexHtml = await readFile(indexPath, 'utf8');

const assetReferences = [
  ...indexHtml.matchAll(/(?:src|href)="([^"]+)"/g),
].map((match) => match[1]);

if (assetReferences.length === 0) {
  throw new Error('Static build has no asset references');
}

for (const reference of assetReferences) {
  if (/^(?:https?:|data:|#)/.test(reference)) continue;
  if (reference.startsWith('/')) {
    throw new Error(`GitHub Pages asset must be relative: ${reference}`);
  }

  const cleanReference = reference.replace(/^\.\//, '').split(/[?#]/, 1)[0];
  await access(resolve(distDirectory, cleanReference));
}

if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('Static build is missing the React root element');
}

console.log(`Verified ${assetReferences.length} static asset references.`);
