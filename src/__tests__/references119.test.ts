import { describe, expect, it } from 'vitest';
import { MEASUREMENTS, getMeasurement, checkDegree, damageDegree, formatMeasure } from '../features/references/measurements';
import { REFERENCE_SECTIONS, SIZE_SECTION, BENCHMARK_SECTION, filterReferenceSection, referenceText } from '../features/references/referenceCatalog';

describe('Handbook measurement tables (pp. 11 and 347)', () => {
  it('includes every rank from −5 through 30 exactly once', () => {
    expect(MEASUREMENTS.map(row => row.rank)).toEqual(Array.from({ length: 36 }, (_, i) => i - 5));
    for (const row of MEASUREMENTS) for (const system of ['metric','imperial'] as const) {
      for (const key of ['mass','distance','volume'] as const) expect(row[system][key]).toHaveLength(2);
    }
  });
  it('retains the actual official rounded values rather than converting the imperial scale', () => {
    expect(MEASUREMENTS.find(row => row.rank === 0)).toMatchObject({ time: [6,'second'], metric: { mass: [24,'kg'], distance: [8,'m'], volume: [.025,'m3'] }, imperial: { mass: [50,'lb'], distance: [30,'ft'], volume: [1,'cft'] } });
    expect(MEASUREMENTS.find(row => row.rank === 7)).toMatchObject({ metric: { mass: [3.2,'ton'], distance: [1,'km'], volume: [3.5,'m3'] }, imperial: { mass: [3,'ton'], distance: [.5,'mile'], volume: [125,'cft'] } });
    expect(MEASUREMENTS.find(row => row.rank === 13)).toMatchObject({ time: [16,'hour'], metric: { distance: [64,'km'] }, imperial: { distance: [30,'mile'] } });
    expect(MEASUREMENTS.find(row => row.rank === 15)).toMatchObject({ metric: { volume: [1000,'m3'] }, imperial: { volume: [32000,'cft'] } });
  });
  it('preserves fractional, tiny and very large values', () => {
    expect(MEASUREMENTS[0]).toMatchObject({ time: ['1/8','second'], metric: { mass: [750,'g'], distance: [15,'cm'], volume: [.0008,'m3'] }, imperial: { volume: ['1/32','cft'] } });
    expect(MEASUREMENTS.at(-1)).toMatchObject({ time: [200,'year'], metric: { distance: [8000000,'km'], volume: [30000000,'m3'] }, imperial: { distance: [4000000,'mile'], volume: [1000000000,'cft'] } });
    expect(formatMeasure([.0008,'m3'], 'pt-BR', () => 'm³')).toBe('0,0008 m³');
    expect(formatMeasure(['1/32','cft'], 'en', () => 'ft³')).toBe('1/32 ft³');
  });
  it('does not mutate the table when formatting either language', () => {
    const original = structuredClone(MEASUREMENTS);
    MEASUREMENTS.forEach(row => formatMeasure(row.metric.volume, 'pt-BR', () => 'm³'));
    expect(MEASUREMENTS).toEqual(original);
  });
});

describe('Measurement extrapolation', () => {
  it('preserves every published value instead of deriving rounded ranks from a formula', () => {
    MEASUREMENTS.forEach(row => expect(getMeasurement(row.rank)).toBe(row));
  });
  it('doubles all four measures above rank 30 using each official unit system', () => {
    expect(getMeasurement(31)).toMatchObject({ time: [400,'year'], metric: { mass: [50000,'kton'], distance: [16000000,'km'], volume: [60000000,'m3'] }, imperial: { mass: [50000,'kton'], distance: [8000000,'mile'], volume: [2000000000,'cft'] } });
    expect(getMeasurement(40).time).toEqual([204800,'year']);
    expect(getMeasurement(40).metric.distance).toEqual([8192000000,'km']);
  });
  it('halves values below rank −5, including fractional endpoint values', () => {
    expect(getMeasurement(-6)).toMatchObject({ time: [.0625,'second'], metric: { mass: [375,'g'], distance: [7.5,'cm'], volume: [.0004,'m3'] }, imperial: { mass: [.75,'lb'], volume: [1/64,'cft'] } });
    expect(formatMeasure(getMeasurement(-20).metric.volume, 'en', () => 'm³')).not.toBe('0 m³');
  });
  it('keeps astronomical and tiny ranks meaningful without overflowing or underflowing', () => {
    for (const rank of [10000,-10000]) {
      const text = formatMeasure(getMeasurement(rank).metric.distance, 'pt-BR', () => 'km');
      expect(text).toContain('× 10^');
      expect(text).not.toMatch(/Infinity|NaN|∞|^0 /);
    }
    expect(formatMeasure(getMeasurement(10000).time, 'en', () => 'years')).toBe('3.71609 × 10^3003 years');
  });
  it('does not change the table and rejects invalid numeric ranks', () => {
    const original = structuredClone(MEASUREMENTS);
    getMeasurement(40);
    expect(MEASUREMENTS).toEqual(original);
    for (const rank of [NaN,Infinity,1.5,Number.MAX_SAFE_INTEGER+1]) expect(() => getMeasurement(rank)).toThrow(RangeError);
  });
});

describe('Degree boundaries and damage (pp. 14, 241, 346)', () => {
  it.each([[20,true,1],[24,true,1],[25,true,2],[35,true,4],[19,false,1],[15,false,1],[14,false,2],[10,false,2],[9,false,3],[4,false,4]])('result %i against DC 20', (result, success, degrees) => {
    expect(checkDegree(result as number, 20)).toEqual({ success, degrees });
  });
  it('uses DC 15 + rank and saturates only the damage result at four degrees', () => {
    expect([25,24,20,19,15,14,10,9,-100].map(total => damageDegree(total,10))).toEqual([0,1,1,2,2,3,3,4,4]);
    expect(checkDegree(-100,25).degrees).toBe(25);
    expect(damageDegree(15,0)).toBe(0);
  });
});

describe('Searchable reference catalog', () => {
  const sections = [...REFERENCE_SECTIONS, SIZE_SECTION, BENCHMARK_SECTION];
  it('has distinct section/row identities, source pages and aligned bilingual columns', () => {
    expect(new Set(sections.map(section => section.id)).size).toBe(sections.length);
    for (const section of sections) {
      expect(section.pages).toMatch(/\d/);
      expect(new Set(section.rows.map(row => row.id)).size).toBe(section.rows.length);
      for (const row of section.rows) {
        expect(row.cells).toHaveLength(section.columns.length);
        row.cells.forEach(cell => { expect(referenceText(cell,'en')).toBeTruthy(); expect(referenceText(cell,'pt-BR')).toBeTruthy(); });
      }
    }
  });
  it('finds specific rows across languages, accents and multiple words without losing source context', () => {
    const maneuvers = sections.find(section => section.id === 'maneuvers')!;
    expect(filterReferenceSection(maneuvers, ' ATAQUE EM EQUIPE ')?.rows.map(row => row.id)).toEqual(['team']);
    expect(filterReferenceSection(maneuvers, 'team attack')?.rows.map(row => row.id)).toEqual(['team']);
    expect(filterReferenceSection(sections.find(section => section.id === 'defenses')!, 'camuflagem')?.rows.map(row => row.id)).toEqual(['concealment']);
    expect(filterReferenceSection(SIZE_SECTION, 'intimidacao')?.rows.length).toBe(11);
    expect(filterReferenceSection(maneuvers, 'zzzzzz')).toBeNull();
    expect(filterReferenceSection(maneuvers, '  ')).toBe(maneuvers);
    expect(filterReferenceSection(maneuvers, 'team attack')?.pages).toBe(maneuvers.pages);
  });
  it('includes the official human size baseline and distinct size/effect ranks', () => {
    expect(SIZE_SECTION.rows.find(row => row.id === '-2')?.cells.map(cell => cell[0])).toEqual(['-2','6 ft.','0','0','0','0','0','0']);
    expect(SIZE_SECTION.rows.find(row => row.id === '3')?.cells.map(cell => cell[0])).toEqual(['3','250 ft.','-10','-20','+10','+20','+20','+2']);
    expect(BENCHMARK_SECTION.rows.find(row => row.id === '7')).toBeDefined();
  });

});
