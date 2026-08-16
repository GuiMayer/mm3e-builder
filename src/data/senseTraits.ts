export interface SenseTraitDefinition {
  id: string; label: string; minRanks: number; maxRanks: number;
  requiresSense?: boolean; requiresDetail?: boolean; supportsScope?: boolean;
}

// Costs and limits follow the Senses table in the Deluxe Hero's Handbook.
const SENSE_TRAIT_ROWS: Array<[string, string, number, number, boolean?, boolean?, boolean?]> = [
  ['accurate','Accurate',2,4,true,false,true], ['acute','Acute',1,2,true,false,true],
  ['analytical','Analytical',1,2,true,false,true], ['awareness','Awareness',1,1,true,true],
  ['communication_link','Communication Link',1,1,true,true], ['counters_concealment','Counters Concealment',2,5,true,true],
  ['counters_illusion','Counters Illusion',2,2,true,true], ['danger_sense','Danger Sense',1,1,true,false],
  ['darkvision','Darkvision',2,2], ['detect','Detect',1,2,true,true], ['direction_sense','Direction Sense',1,1],
  ['distance_sense','Distance Sense',1,1], ['extended','Extended',1,20,true], ['infravision','Infravision',1,1],
  ['low_light_vision','Low-Light Vision',1,1], ['microscopic_vision','Microscopic Vision',1,4],
  ['penetrates_concealment','Penetrates Concealment',4,4,true], ['postcognition','Postcognition',4,4],
  ['precognition','Precognition',4,4], ['radio','Radio',1,1], ['radius','Radius',1,2,true,false,true],
  ['ranged','Ranged',1,1,true], ['rapid','Rapid',1,20,true,false,true], ['time_sense','Time Sense',1,1],
  ['tracking','Tracking',1,2,true], ['ultra_hearing','Ultra-Hearing',1,1], ['ultravision','Ultravision',1,1],
];

export const SENSE_TRAITS: SenseTraitDefinition[] = SENSE_TRAIT_ROWS.map(([id,label,minRanks,maxRanks,requiresSense,requiresDetail,supportsScope]) => ({ id, label, minRanks, maxRanks, requiresSense, requiresDetail, supportsScope }));

export const SENSE_TYPES = ['Visual', 'Auditory', 'Olfactory', 'Tactile', 'Mental', 'Radio'];
