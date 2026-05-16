import { motion } from 'framer-motion';
import { Clock, Sparkles, AlertTriangle } from 'lucide-react';
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
  const isIrate = guest.needs.includes('irate');
  return (
    <motion.button
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
      className={`relative w-full min-h-0 text-left rounded-lg border bg-surface px-4 py-2.5 transition-colors flex flex-col justify-between ${
        selected
          ? 'border-accent/40 bg-surface-2'
          : isIrate
            ? 'border-need-irate/40 hover:bg-surface-2/60'
            : 'border-hairline hover:bg-surface-2/60'
      }`}
    >
      {selected && (
        <motion.span
          layoutId="card-rail"
          className={`absolute left-0 top-2 bottom-2 w-px ${
            isIrate ? 'bg-need-irate irate-rail' : 'bg-accent'
          }`}
        />
      )}
      {!selected && isIrate && (
        <span className="absolute left-0 top-2 bottom-2 w-px bg-need-irate irate-rail" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            {isIrate && (
              <AlertTriangle className="size-3.5 text-need-irate shrink-0" />
            )}
            <h3 className="text-[15px] font-light tracking-tight text-text truncate">
              {guest.name}
            </h3>
            <NeedBadge needs={guest.needs} />
          </div>
          <p className="mt-0.5 text-[11px] text-muted truncate">
            {guest.guestType}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {arrived ? (
            <>
              <div className="text-[9px] tracking-[0.18em] uppercase text-muted">
                Arrived · Actual NPS
              </div>
              <div className="tnum text-2xl font-extralight text-accent leading-none mt-0.5">
                {guest.actualNps}
              </div>
            </>
          ) : (
            <>
              <div className="text-[9px] tracking-[0.18em] uppercase text-muted">
                ETA
              </div>
              <div className="tnum text-xl font-extralight text-text leading-none mt-0.5">
                {formatEta(guest.etaMinutes)}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-start gap-2 text-[12px] text-text/85">
        <Clock className="size-3 mt-[3px] shrink-0 text-muted" />
        <span className="truncate">{guest.triggerShort}</span>
      </div>

      <div className="mt-1 flex items-start gap-2 text-[12px] text-text/85">
        <Sparkles
          className={`size-3 mt-[3px] shrink-0 ${
            isIrate ? 'text-need-irate' : 'text-accent'
          }`}
        />
        <span className="line-clamp-1">{guest.automatedActions[0]}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-[10px] text-muted">
          Forecast NPS{' '}
          <span className="tnum text-text">{guest.forecastNpsAfter}</span>
          <span className="text-muted/70"> (was {guest.forecastNpsBefore})</span>
        </div>
        {guest.override ? (
          <span className="text-[10px] text-accent/90 tracking-[0.12em] uppercase truncate max-w-[60%]">
            Override · {guest.override}
          </span>
        ) : arrived ? (
          <span className="text-[10px] text-pos tracking-[0.12em] uppercase">
            Choreography complete
          </span>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-muted tracking-[0.12em] uppercase">
              {isIrate ? 'Recovery armed' : 'Automation running'}
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
              className="cursor-pointer text-[10px] tracking-[0.12em] uppercase border border-hairline rounded px-2 py-0.5 hover:bg-surface-2 hover:border-accent/30 text-text/85"
            >
              Override
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
