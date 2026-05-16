import type { BanditWeight } from '../types';

const DRIFT_BIAS: Record<string, number> = {
  'Quiet Recovery': 1.2,
  'Local Cultural Access': 0.9,
  'Work Continuity': 0.2,
  'Celebration Ritual': -0.3,
  'Generic Premium Welcome': -2.0,
};

function pseudoNoise(seed: number, key: string): number {
  let h = seed;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  const x = Math.sin(h) * 10000;
  return (x - Math.floor(x)) * 2 - 1;
}

export function updateBanditWeights(
  weights: BanditWeight[],
  seed: number,
): BanditWeight[] {
  const shifted = weights.map((w) => {
    const bias = DRIFT_BIAS[w.package] ?? 0;
    const noise = pseudoNoise(seed, w.package) * 1.2;
    const raw = Math.max(2, w.weight + bias + noise);
    return { source: w, raw };
  });
  const total = shifted.reduce((s, w) => s + w.raw, 0);
  return shifted.map(({ source, raw }) => {
    const newWeight = Math.round((raw / total) * 100);
    const delta = newWeight - source.weight + source.delta;
    return {
      package: source.package,
      weight: newWeight,
      delta: Math.max(-18, Math.min(18, delta)),
    };
  });
}
