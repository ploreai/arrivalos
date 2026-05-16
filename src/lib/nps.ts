import type { Guest } from '../types';

export function forecastNPS(
  guest: Guest,
  choreographyMatchesNeed: boolean,
  priorPreferenceHit: boolean,
  mealNeedUnmet: boolean,
): number {
  let nps = 70;
  if (guest.needs.includes('status')) nps -= 4;
  if (guest.needs.includes('rest')) nps -= 2;
  if (choreographyMatchesNeed) nps += 12;
  if (priorPreferenceHit) nps += 5;
  if (mealNeedUnmet) nps -= 8;
  if (guest.circadianState === 'unstable') nps -= 4;
  return Math.max(60, Math.min(98, nps));
}
