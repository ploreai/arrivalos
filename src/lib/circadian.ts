import type { CircadianState } from '../types';

export function estimateCircadianState(
  tzDeltaHours: number,
  arrivalLocalHour: number,
): { state: CircadianState; bodyClockEquivalent: string } {
  const absDelta = Math.abs(tzDeltaHours);
  let state: CircadianState = 'stable';
  if (absDelta >= 7) state = 'unstable';
  else if (absDelta >= 4) state = 'mild';

  const bodyHour24 = ((arrivalLocalHour - tzDeltaHours) % 24 + 24) % 24;
  const h = Math.floor(bodyHour24);
  const m = Math.floor((bodyHour24 - h) * 60);
  const suffix = h < 12 ? 'AM' : 'PM';
  const h12 = ((h + 11) % 12) + 1;
  const bodyClockEquivalent = `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  return { state, bodyClockEquivalent };
}
