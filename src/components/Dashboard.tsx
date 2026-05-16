import { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FastForward, RotateCcw } from 'lucide-react';
import type { AppState, OverrideReason } from '../types';
import ArrivalCard from './ArrivalCard';
import ArrivalDetail from './ArrivalDetail';
import OwnerMetrics from './OwnerMetrics';
import ContextLearning from './ContextLearning';
import OverrideModal from './OverrideModal';
import { localTimeLabel } from '../lib/simulation';

interface Props {
  state: AppState;
  onSelectGuest: (id: string) => void;
  onOpenOverride: (id: string) => void;
  onCloseOverride: () => void;
  onSubmitOverride: (id: string, reason: OverrideReason) => void;
  onAdvance: () => void;
  onReset: () => void;
}

export default function Dashboard({
  state,
  onSelectGuest,
  onOpenOverride,
  onCloseOverride,
  onSubmitOverride,
  onAdvance,
  onReset,
}: Props) {
  const visibleGuests = useMemo(
    () =>
      [...state.guests]
        .filter((g) => !state.arrivedIds.includes(g.id) || g.etaMinutes === 0)
        .sort((a, b) => a.etaMinutes - b.etaMinutes)
        .slice(0, 4),
    [state.guests, state.arrivedIds],
  );

  const selectedGuest = useMemo(
    () => state.guests.find((g) => g.id === state.selectedGuestId) ?? null,
    [state.guests, state.selectedGuestId],
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (state.overrideModalGuestId) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      const ids = visibleGuests.map((g) => g.id);
      if (ids.length === 0) return;
      const idx = ids.indexOf(state.selectedGuestId);
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        const next = idx < 0 ? 0 : (idx + 1) % ids.length;
        onSelectGuest(ids[next]);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        const next = idx < 0 ? 0 : (idx - 1 + ids.length) % ids.length;
        onSelectGuest(ids[next]);
      } else if (e.code === 'Space') {
        e.preventDefault();
        onAdvance();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    visibleGuests,
    state.selectedGuestId,
    state.overrideModalGuestId,
    onSelectGuest,
    onAdvance,
  ]);

  const modalGuest = state.overrideModalGuestId
    ? state.guests.find((g) => g.id === state.overrideModalGuestId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-hairline px-8 py-5 flex items-start justify-between gap-8">
        <div>
          <p className="text-[10px] tracking-[0.32em] uppercase text-muted">
            Sense of Arrival
          </p>
          <h1 className="text-[22px] font-extralight tracking-tight mt-1">
            Rosewood Hong Kong
          </h1>
          <p className="text-[12px] text-muted italic mt-1.5">
            The guest has not arrived yet, but the hotel has already changed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Local time
            </p>
            <p className="tnum text-lg font-light mt-0.5">
              {localTimeLabel(state.clockMinutesOffset)}
            </p>
          </div>
          <button
            onClick={onAdvance}
            className="inline-flex items-center gap-2 border border-hairline hover:border-accent/40 hover:bg-surface-2 px-4 py-2 rounded-md text-[12px] tracking-[0.12em] uppercase text-text/90 transition-colors"
          >
            <FastForward className="size-3.5" />
            Advance 15 min
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 border border-hairline hover:border-accent/40 hover:bg-surface-2 px-3 py-2 rounded-md text-[12px] tracking-[0.12em] uppercase text-muted hover:text-text transition-colors"
            aria-label="Reset demo"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </header>

      <main className="px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-5">
        <section className="xl:col-span-7 rounded-lg border border-hairline bg-surface px-6 py-5">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
              Next Four Arrivals
            </p>
            <p className="text-[11px] text-muted">
              {state.arrivedIds.length} arrived today
            </p>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {visibleGuests.map((g) => (
                <ArrivalCard
                  key={g.id}
                  guest={g}
                  selected={g.id === state.selectedGuestId}
                  arrived={state.arrivedIds.includes(g.id)}
                  onSelect={() => onSelectGuest(g.id)}
                  onOverride={() => onOpenOverride(g.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        <div className="xl:col-span-5 flex flex-col gap-5">
          <ArrivalDetail guest={selectedGuest} />
          <OwnerMetrics metrics={state.metrics} />
          <ContextLearning
            context={state.context}
            bandit={state.bandit}
            interventions={state.interventions}
          />
        </div>
      </main>

      <OverrideModal
        guestName={modalGuest?.name ?? null}
        open={modalGuest !== null}
        onClose={onCloseOverride}
        onSubmit={(reason) =>
          modalGuest && onSubmitOverride(modalGuest.id, reason)
        }
      />
    </div>
  );
}
