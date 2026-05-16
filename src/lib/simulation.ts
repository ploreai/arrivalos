import type {
  AppState,
  Guest,
  Intervention,
  OverrideReason,
} from '../types';
import { updateBanditWeights } from './bandit';

const BASE_LOCAL_MINUTES = 18 * 60 + 42;

export function localTimeLabel(offset: number): string {
  const total = (BASE_LOCAL_MINUTES + offset) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} PT`;
}

function jitter(seed: number, key: string, range: number): number {
  let h = seed;
  for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) | 0;
  const x = Math.sin(h) * 10000;
  const n = (x - Math.floor(x)) * 2 - 1;
  return n * range;
}

export function advance(state: AppState, minutes: number): AppState {
  const nextOffset = state.clockMinutesOffset + minutes;

  const updatedGuests: Guest[] = state.guests.map((g) => {
    if (state.arrivedIds.includes(g.id)) return g;
    const nextEta = g.etaMinutes - minutes;
    if (nextEta <= 0 && g.actualNps === undefined) {
      const actualNps = Math.max(
        60,
        Math.min(
          98,
          Math.round(g.forecastNpsAfter + jitter(nextOffset, g.id, 4)),
        ),
      );
      return { ...g, etaMinutes: 0, actualNps, arrivedAtOffset: nextOffset };
    }
    return { ...g, etaMinutes: Math.max(0, nextEta) };
  });

  const newlyArrived = updatedGuests
    .filter(
      (g) =>
        g.etaMinutes === 0 &&
        g.actualNps !== undefined &&
        !state.arrivedIds.includes(g.id),
    )
    .map((g) => g.id);

  const arrivedIds = [...state.arrivedIds, ...newlyArrived];

  const pendingMaxEta = updatedGuests
    .filter((g) => !arrivedIds.includes(g.id))
    .reduce((m, g) => Math.max(m, g.etaMinutes), 0);

  let respawnCursor = Math.max(pendingMaxEta, 15);
  const respawns: Guest[] = [];
  for (const arrivedId of newlyArrived) {
    const original = updatedGuests.find((g) => g.id === arrivedId);
    if (!original) continue;
    const baseId = original.id.replace(/-r\d+-\d+$/, '');
    respawnCursor += 11 + Math.floor(jitter(nextOffset, baseId, 5) + 3);
    respawns.push({
      ...original,
      id: `${baseId}-r${nextOffset}-${respawns.length}`,
      etaMinutes: respawnCursor,
      actualNps: undefined,
      override: undefined,
      arrivedAtOffset: undefined,
    });
  }

  const finalGuests = [...updatedGuests, ...respawns];

  const arrivedGuests = finalGuests.filter((g) => arrivedIds.includes(g.id));
  const meanActual =
    arrivedGuests.length > 0
      ? arrivedGuests.reduce((s, g) => s + (g.actualNps ?? 0), 0) /
        arrivedGuests.length
      : state.metrics.actualNps;

  const blendedActual = Math.round(
    state.metrics.actualNps * 0.5 + meanActual * 0.5,
  );

  const upgradeDelta = Math.round(jitter(nextOffset, 'upgrade', 220));
  const avoidedDelta = Math.round(jitter(nextOffset, 'avoided', 180));

  const metrics = {
    ...state.metrics,
    actualNps: blendedActual,
    upgradeCostToday: Math.max(
      0,
      state.metrics.upgradeCostToday + upgradeDelta,
    ),
    upgradeCostAvoided: Math.max(
      0,
      state.metrics.upgradeCostAvoided + avoidedDelta,
    ),
  };

  const bandit = updateBanditWeights(state.bandit, nextOffset);

  return {
    ...state,
    clockMinutesOffset: nextOffset,
    guests: finalGuests,
    arrivedIds,
    metrics,
    bandit,
  };
}

export function buildIntervention(
  guest: Guest,
  reason: OverrideReason,
  offset: number,
): Intervention {
  const detailByReason: Record<OverrideReason, string> = {
    'VIP relationship context':
      'Suite assignment held · GM recognition note prepared · logged for model update.',
    'Guest mood observed':
      'Arrival path softened · scent removed · staff briefed · logged for model update.',
    'Known companion preference':
      'Companion preference applied · room re-set to shared profile · logged for model update.',
    'Owner request':
      'Owner instruction applied · automated action paused · logged for owner reporting.',
    'Operational constraint':
      'Automated action retained · timing delayed by 20 min · logged for model update.',
    'Cultural sensitivity':
      'Welcome amenity swapped · greeting language adjusted · logged for model update.',
    'Upgrade exception':
      'Suite upgrade override applied · displacement cost re-evaluated · logged for owner reporting.',
    'Service recovery':
      'Recovery package activated · amenity + handwritten note + late checkout · logged for model update.',
  };
  return {
    id: `${guest.id}-${offset}-${reason}`,
    guestId: guest.id,
    guestName: guest.name,
    reason,
    detail: detailByReason[reason],
    timestamp: localTimeLabel(offset),
  };
}
