import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { renderComplicationsSection } from '../services/pdf/components/ComplicationsSection';
import { renderNotesSection } from '../services/pdf/components/NotesSection';
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
});
