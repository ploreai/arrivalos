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
        .filter(
          (g) =>
            !state.arrivedIds.includes(g.id) ||
            g.arrivedAtOffset === state.clockMinutesOffset,
        )
        .sort((a, b) => a.etaMinutes - b.etaMinutes)
        .slice(0, 4),
    [state.guests, state.arrivedIds, state.clockMinutesOffset],
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
    <div className="h-screen overflow-hidden bg-bg text-text flex flex-col">
      <header className="shrink-0 border-b border-hairline px-6 py-3 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[9px] tracking-[0.32em] uppercase text-muted">
            Sense of Arrival
          </p>
          <div className="flex items-baseline gap-3 mt-0.5">
            <h1 className="text-[18px] font-extralight tracking-tight">
              Rosewood Sand Hill
            </h1>
            <p className="text-[11px] text-muted italic truncate">
              The guest has not arrived yet, but the hotel has already changed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[9px] tracking-[0.2em] uppercase text-muted">
              Local time
            </p>
            <p className="tnum text-[15px] font-light leading-tight">
              {localTimeLabel(state.clockMinutesOffset)}
            </p>
          </div>
          <button
            onClick={onAdvance}
            className="inline-flex items-center gap-2 border border-hairline hover:border-accent/40 hover:bg-surface-2 px-3 py-1.5 rounded-md text-[11px] tracking-[0.12em] uppercase text-text/90 transition-colors"
          >
            <FastForward className="size-3" />
            Advance 15 min
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 border border-hairline hover:border-accent/40 hover:bg-surface-2 px-2.5 py-1.5 rounded-md text-[11px] tracking-[0.12em] uppercase text-muted hover:text-text transition-colors"
            aria-label="Reset demo"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3">
        <section className="col-span-7 min-h-0 flex flex-col rounded-lg border border-hairline bg-surface">
          <div className="shrink-0 flex items-baseline justify-between px-5 pt-3 pb-2">
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
              Next Four Arrivals
            </p>
            <p className="text-[11px] text-muted">
              {state.arrivedIds.length} arrived today
            </p>
          </div>
          <div className="flex-1 min-h-0 px-3 pb-3 grid grid-rows-4 gap-2">
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

        <div className="col-span-5 min-h-0 grid grid-rows-[minmax(0,1fr)_auto_auto] gap-3">
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
