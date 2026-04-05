/* ================================================
   Header Section — Page 1
   Fields: Hero, Player, Identity, Base of Operations,
   Group Affiliation, Power Level, PP Earned/Spent/Total,
   Age, Gender, Height, Weight, Eyes, Hair, Hero Points,
   Public/Secret checkboxes.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacterHeader } from '../../../entities/types';
import { setField, setCheck } from '../helpers';

interface HeaderPP {
  totalAvailable: number;
  totalSpent: number;
  remaining: number;
}

export function fillHeader(form: PDFForm, header: ICharacterHeader, pp: HeaderPP): void {
  // ── Identity info ──────────────────────────────────────────
  setField(form, 'Hero',               header.name);
  setField(form, 'Player',             header.player);
  setField(form, 'Identity',           header.identity);
  setField(form, 'Base of Operations', header.base);
  setField(form, 'Group Affiliation',  header.groupAffiliation ?? '');
  setField(form, 'Power Level',        String(header.powerLevel));
  setField(form, 'Hero Points',        String(header.heroPoints));

  // ── Page 2 extras (series / GM filled here for consistency) ──
  // These two are physically on page 2 but are header data.
  setField(form, 'Series',      header.series      ?? '');
  setField(form, 'Game Master', header.gameMaster  ?? '');

  // ── PP summary ─────────────────────────────────────────────
  setField(form, 'PP Earned', String(pp.totalAvailable));
  setField(form, 'PP Spent',  String(pp.totalSpent));
  setField(form, 'Total',     String(pp.remaining));

  // ── Physical description (all optional) ────────────────────
  setField(form, 'Age',    header.age    ?? '');
  setField(form, 'Gender', header.gender ?? '');
  setField(form, 'Height', header.height ?? '');
  setField(form, 'Weight', header.weight ?? '');
  setField(form, 'Eyes',   header.eyes   ?? '');
  setField(form, 'Hair',   header.hair   ?? '');

  // ── Identity type checkboxes ────────────────────────────────
  const isPublic = header.identityType === 'public';
  const isSecret = header.identityType === 'secret';
  setCheck(form, 'Public', isPublic);
  setCheck(form, 'Secret', isSecret);
}
