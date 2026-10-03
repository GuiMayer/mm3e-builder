export type MeasureUnit = 'g' | 'kg' | 'lb' | 'ton' | 'kton' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'cm' | 'm' | 'km' | 'inch' | 'ft' | 'mile' | 'm3' | 'cft';
export type Measure = readonly [number | string, MeasureUnit];
export type MeasurementSystem = 'metric' | 'imperial';
export interface MeasurementRow { rank: number; time: Measure; metric: { mass: Measure; distance: Measure; volume: Measure }; imperial: { mass: Measure; distance: Measure; volume: Measure }; }

// Deluxe Hero's Handbook pp. 11, 347: transcribed separately. The metric table
// is a rounded game scale, not a unit conversion of the imperial table.
const metricMass: Measure[] = [[750,'g'],[1.5,'kg'],[3,'kg'],[6,'kg'],[12,'kg'],[24,'kg'],[50,'kg'],[100,'kg'],[200,'kg'],[400,'kg'],[800,'kg'],[1600,'kg'],[3.2,'ton'],[6,'ton'],[12,'ton'],[25,'ton'],[50,'ton'],[100,'ton'],[200,'ton'],[400,'ton'],[800,'ton'],[1600,'ton'],[3.2,'kton'],[6,'kton'],[12,'kton'],[25,'kton'],[50,'kton'],[100,'kton'],[200,'kton'],[400,'kton'],[800,'kton'],[1600,'kton'],[3200,'kton'],[6400,'kton'],[12500,'kton'],[25000,'kton']];
const imperialMass: Measure[] = [[1.5,'lb'],[3,'lb'],[6,'lb'],[12,'lb'],[25,'lb'],[50,'lb'],[100,'lb'],[200,'lb'],[400,'lb'],[800,'lb'],[1600,'lb'],[3200,'lb'],[3,'ton'],[6,'ton'],[12,'ton'],[25,'ton'],[50,'ton'],[100,'ton'],[200,'ton'],[400,'ton'],[800,'ton'],[1600,'ton'],[3.2,'kton'],[6,'kton'],[12,'kton'],[25,'kton'],[50,'kton'],[100,'kton'],[200,'kton'],[400,'kton'],[800,'kton'],[1600,'kton'],[3200,'kton'],[6400,'kton'],[12500,'kton'],[25000,'kton']];
const times: Measure[] = [['1/8','second'],['1/4','second'],['1/2','second'],[1,'second'],[3,'second'],[6,'second'],[12,'second'],[30,'second'],[1,'minute'],[2,'minute'],[4,'minute'],[8,'minute'],[15,'minute'],[30,'minute'],[1,'hour'],[2,'hour'],[4,'hour'],[8,'hour'],[16,'hour'],[1,'day'],[2,'day'],[4,'day'],[1,'week'],[2,'week'],[1,'month'],[2,'month'],[4,'month'],[8,'month'],[1.5,'year'],[3,'year'],[6,'year'],[12,'year'],[25,'year'],[50,'year'],[100,'year'],[200,'year']];
const metricDistances: Measure[] = [[15,'cm'],[50,'cm'],[1,'m'],[2,'m'],[4,'m'],[8,'m'],[16,'m'],[32,'m'],[64,'m'],[125,'m'],[250,'m'],[500,'m'],[1,'km'],[2,'km'],[4,'km'],[8,'km'],[16,'km'],[32,'km'],[64,'km'],[125,'km'],[250,'km'],[500,'km'],[1000,'km'],[2000,'km'],[4000,'km'],[8000,'km'],[16000,'km'],[32000,'km'],[64000,'km'],[125000,'km'],[250000,'km'],[500000,'km'],[1000000,'km'],[2000000,'km'],[4000000,'km'],[8000000,'km']];
const imperialDistances: Measure[] = [[6,'inch'],[1,'ft'],[3,'ft'],[6,'ft'],[15,'ft'],[30,'ft'],[60,'ft'],[120,'ft'],[250,'ft'],[500,'ft'],[900,'ft'],[1800,'ft'],[0.5,'mile'],[1,'mile'],[2,'mile'],[4,'mile'],[8,'mile'],[16,'mile'],[30,'mile'],[60,'mile'],[120,'mile'],[250,'mile'],[500,'mile'],[1000,'mile'],[2000,'mile'],[4000,'mile'],[8000,'mile'],[16000,'mile'],[32000,'mile'],[64000,'mile'],[125000,'mile'],[250000,'mile'],[500000,'mile'],[1000000,'mile'],[2000000,'mile'],[4000000,'mile']];
const metricVolumes = [.0008,.0017,.0035,.007,.014,.025,.05,.1,.2,.4,.8,1.7,3.5,7,15,30,60,120,250,500,1000,2000,4000,8000,15000,30000,60000,120000,250000,500000,1000000,2000000,4000000,8000000,15000000,30000000];
const imperialVolumes: (number | string)[] = ['1/32','1/16','1/8','1/4','1/2',1,2,4,8,15,30,60,125,250,500,1000,2000,4000,8000,15000,32000,65000,125000,250000,500000,1000000,2000000,4000000,8000000,15000000,32000000,65000000,125000000,250000000,500000000,1000000000];

export const MEASUREMENTS: readonly MeasurementRow[] = times.map((time, index) => ({ rank: index - 5, time,
  metric: { mass: metricMass[index], distance: metricDistances[index], volume: [metricVolumes[index], 'm3'] },
  imperial: { mass: imperialMass[index], distance: imperialDistances[index], volume: [imperialVolumes[index], 'cft'] },
}));

export function formatMeasure([amount, unit]: Measure, language: string, unitLabel: (unit: MeasureUnit, count?: number) => string): string {
  const value = typeof amount === 'string' ? amount : new Intl.NumberFormat(language, { maximumFractionDigits: 4 }).format(amount);
  return `${value} ${unitLabel(unit, typeof amount === 'number' ? amount : undefined)}`;
}

/** Query helpers only: no dice, mutations or sheet-rule integration. */
export function checkDegree(result: number, dc: number): { success: boolean; degrees: number } {
  const success = result >= dc;
  return { success, degrees: success ? 1 + Math.floor((result - dc) / 5) : Math.ceil((dc - result) / 5) };
}
export function damageDegree(result: number, rank: number): number {
  const check = checkDegree(result, 15 + rank);
  return check.success ? 0 : Math.min(4, check.degrees);
}
