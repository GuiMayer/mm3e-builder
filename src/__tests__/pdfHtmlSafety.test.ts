import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { renderComplicationsSection } from '../services/pdf/components/ComplicationsSection';
import { renderNotesSection } from '../services/pdf/components/NotesSection';
import { renderDefensesSection } from '../services/pdf/components/DefensesSection';
import { escapeHtml, nl2br } from '../services/pdf/components/utils';

describe('PDF HTML safety', () => {
  it('escapes markup and attribute delimiters', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#039;x&#039;)&quot;&gt;'
    );
  });

  it('adds line breaks only after escaping notes', () => {
    expect(nl2br('<script>alert(1)</script>\nsecond line')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;<br>second line'
    );
  });

  it('does not inject imported character text into generated sections', () => {
    const character = createDefaultCharacter({
      notes: '<img src=x onerror=alert(1)>',
      complications: [
        { title: '<script>', description: '"dangerous" & text' },
      ],
    });

    const html = [
      renderNotesSection({ character }),
      renderComplicationsSection({ character }),
    ].join('');

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('renders active defense totals from abilities plus purchased ranks', () => {
    const character = createDefaultCharacter({
      abilities: { str: 0, sta: 1, agl: 2, dex: 0, fgt: 3, int: 0, awe: 4, pre: 0 },
      defenses: { dodge: 5, parry: 6, fortitude: 7, will: 8 },
    });

    const html = renderDefensesSection({
      character,
      defensesCost: 26,
      toughnessTotal: 4,
      initiativeTotal: 6,
    });

    expect(html).toContain('Base: 2 + Bonus: 5');
    expect(html).toContain('Base: 3 + Bonus: 6');
    expect(html).toContain('Base: 1 + Bonus: 7');
    expect(html).toContain('Base: 4 + Bonus: 8');
  });
});
