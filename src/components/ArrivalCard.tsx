import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import type { Guest } from '../types';
import NeedBadge from './NeedBadge';

interface Props {
  guest: Guest;
  selected: boolean;
  arrived: boolean;
  onSelect: () => void;
  onOverride: () => void;
}

function formatEta(min: number): string {
  if (min <= 0) return 'Arrived';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function ArrivalCard({
  guest,
  selected,
  arrived,
  onSelect,
  onOverride,
}: Props) {
  return (
    <motion.button
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`relative w-full text-left rounded-lg border bg-surface px-5 py-4 transition-colors ${
        selected
          ? 'border-accent/40 bg-surface-2'
          : 'border-hairline hover:bg-surface-2/60'
      }`}
    >
      {selected && (
        <motion.span
          layoutId="card-rail"
          className="absolute left-0 top-3 bottom-3 w-px bg-accent"
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-[17px] font-light tracking-tight text-text truncate">
              {guest.name}
            </h3>
            <NeedBadge needs={guest.needs} />
          </div>
          <p className="mt-1 text-[12px] text-muted">{guest.guestType}</p>
        </div>
        <div className="shrink-0 text-right">
          {arrived ? (
            <>
              <div className="text-[10px] tracking-[0.18em] uppercase text-muted">
                Arrived · Actual NPS
              </div>
              <div className="tnum text-3xl font-extralight text-accent">
                {guest.actualNps}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] tracking-[0.18em] uppercase text-muted">
                ETA
              </div>
              <div className="tnum text-2xl font-extralight text-text">
                {formatEta(guest.etaMinutes)}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[12.5px] text-text/85">
        <Clock className="size-3.5 mt-[3px] shrink-0 text-muted" />
        <span>{guest.triggerShort}</span>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[12.5px] text-text/85">
        <Sparkles className="size-3.5 mt-[3px] shrink-0 text-accent" />
        <span className="line-clamp-2">{guest.automatedActions[0]}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-[11px] text-muted">
          Forecast NPS{' '}
          <span className="tnum text-text">{guest.forecastNpsAfter}</span>
          <span className="text-muted/70">
            {' '}
            (was {guest.forecastNpsBefore})
          </span>
        </div>
        {guest.override ? (
          <span className="text-[11px] text-accent/90 tracking-[0.12em] uppercase">
            Override · {guest.override}
          </span>
        ) : arrived ? (
          <span className="text-[11px] text-pos tracking-[0.12em] uppercase">
            Choreography complete
          </span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted tracking-[0.12em] uppercase">
              Automation running
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onOverride();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onOverride();
                }
              }}
              className="cursor-pointer text-[11px] tracking-[0.12em] uppercase border border-hairline rounded px-2 py-1 hover:bg-surface-2 hover:border-accent/30 text-text/85"
            >
              Override
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
