import type { BanditWeight, ContextSignal, OwnerMetrics } from '../types';

export const seedContext: ContextSignal[] = [
  {
    id: 'art-week',
    label: 'Hong Kong Art Week',
    detail: 'Detected via local events feed · 6 day window',
  },
  {
    id: 'rain',
    label: 'Rain forecast at 6 PM',
    detail: '11mm expected · arrival paths re-routed under cover',
  },
  {
    id: 'flight-cluster',
    label: 'Flight disruption cluster',
    detail: '3 long-haul arrivals delayed 90m+ in next 4h',
  },
  {
    id: 'occupancy',
    label: 'Occupancy 91%',
    detail: 'Upgrade ROI threshold raised · suite displacement $640 avg',
  },
  {
    id: 'corp-conf',
    label: 'Corporate conference nearby',
    detail: 'Pacific Place · 1.2km · 600 attendees · ends 6 PM',
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
