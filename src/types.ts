export type NeedState =
  | 'rest'
  | 'culture'
  | 'work'
  | 'celebrate'
  | 'family'
  | 'status'
  | 'irate';

export type CircadianState = 'stable' | 'mild' | 'unstable';
export type MealConfidence = 'High' | 'Medium' | 'Low';

export type OverrideReason =
  | 'VIP relationship context'
  | 'Guest mood observed'
  | 'Known companion preference'
  | 'Owner request'
  | 'Operational constraint'
  | 'Cultural sensitivity'
  | 'Upgrade exception'
  | 'Service recovery';

export const OVERRIDE_REASONS: OverrideReason[] = [
  'VIP relationship context',
  'Guest mood observed',
  'Known companion preference',
  'Owner request',
  'Operational constraint',
  'Cultural sensitivity',
  'Upgrade exception',
  'Service recovery',
];

export interface Guest {
  id: string;
  name: string;
  etaMinutes: number;
  needs: NeedState[];
  needLabel: string;
  guestType: string;
  triggerShort: string;
  triggerLong: string;
  forecastNpsBefore: number;
  forecastNpsAfter: number;
  flight: string;
  flightStatus: string;
  mealGapHours: number;
  mealConfidence: MealConfidence;
  circadianState: CircadianState;
  bodyClockEquivalent: string;
  localContext: string;
  priorPreference: string;
  automatedActions: string[];
  roomDisplayCopy: string;
  override?: OverrideReason;
  actualNps?: number;
  arrivedAtOffset?: number;
}

export interface ContextSignal {
  id: string;
  label: string;
  detail: string;
}

export interface BanditWeight {
  package: string;
  weight: number;
  delta: number;
}

export interface OwnerMetrics {
  forecastNps: number;
  actualNps: number;
  adr: number;
  revpar: number;
  ancillaryPerStay: number;
  upgradeCostToday: number;
  upgradeCostSevenDayAvg: number;
  upgradeCostAvoided: number;
}

export interface Intervention {
  id: string;
  guestId: string;
  guestName: string;
  reason: OverrideReason;
  detail: string;
  timestamp: string;
}

export interface AppState {
  clockMinutesOffset: number;
  selectedGuestId: string;
  guests: Guest[];
  arrivedIds: string[];
  bandit: BanditWeight[];
  context: ContextSignal[];
  metrics: OwnerMetrics;
  interventions: Intervention[];
  overrideModalGuestId: string | null;
}
