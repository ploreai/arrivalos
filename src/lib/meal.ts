import type { MealConfidence } from '../types';

export function estimateMealGap(
  hoursSinceLastMeal: number,
  flightDelayMinutes: number,
  airlineMealKnown: boolean,
): { hours: number; confidence: MealConfidence } {
  const hours = hoursSinceLastMeal + flightDelayMinutes / 60;
  const confidence: MealConfidence = airlineMealKnown
    ? 'High'
    : hours < 4
      ? 'Medium'
      : 'Low';
  return { hours: Number(hours.toFixed(2)), confidence };
}
