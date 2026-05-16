import type { BanditWeight, ContextSignal, OwnerMetrics } from '../types';

export const seedContext: ContextSignal[] = [
  {
    id: 'founders-forum',
    label: 'Stanford GSB Founders Forum',
    detail: 'Detected via local events feed · 4-day window',
  },
  {
    id: 'fog',
    label: 'Marine layer rolling in 7 PM',
    detail: 'Arrival paths shifted under cover · valet windows widened',
  },
  {
    id: 'flight-cluster',
    label: 'Flight disruption cluster',
    detail: '3 long-haul arrivals delayed 90m+ in next 4h at SFO',
  },
  {
    id: 'occupancy',
    label: 'Occupancy 91%',
    detail: 'Upgrade ROI threshold raised · suite displacement $640 avg',
  },
  {
    id: 'vc-offsite',
    label: 'VC partner offsite on property',
    detail: 'Sand Hill Road · 80 partners · ends 9 PM',
  },
];

export const seedBandit: BanditWeight[] = [
  { package: 'Quiet Recovery', weight: 31, delta: 8 },
  { package: 'Local Cultural Access', weight: 27, delta: 5 },
  { package: 'Work Continuity', weight: 19, delta: 1 },
  { package: 'Celebration Ritual', weight: 14, delta: -2 },
  { package: 'Generic Premium Welcome', weight: 9, delta: -12 },
];

export const seedMetrics: OwnerMetrics = {
  forecastNps: 87,
  actualNps: 84,
  adr: 1420,
  revpar: 1278,
  ancillaryPerStay: 410,
  upgradeCostToday: 4800,
  upgradeCostSevenDayAvg: 6950,
  upgradeCostAvoided: 2150,
};

export const sevenDayAverages = {
  forecastNps: 84,
  actualNps: 81,
  adr: 1380,
  revpar: 1240,
  ancillaryPerStay: 372,
};
