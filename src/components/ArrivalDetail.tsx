import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Utensils, Moon, MapPin, History } from 'lucide-react';
import type { Guest } from '../types';
import NeedBadge from './NeedBadge';

interface Props {
  guest: Guest | null;
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-muted mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[9px] tracking-[0.16em] uppercase text-muted">
          {label}
        </p>
        <p className="text-[12px] text-text/90 leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function ArrivalDetail({ guest }: Props) {
  return (
    <section className="min-h-0 overflow-y-auto rounded-lg border border-hairline bg-surface px-5 py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          Arrival Intelligence
        </p>
        <p className="text-[11px] italic text-text/65">
          Personalization as choreography, not memory.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {guest && (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[20px] font-extralight tracking-tight text-text truncate">
                  {guest.name}
                </h2>
                <div className="mt-1.5">
                  <NeedBadge needs={guest.needs} size="md" />
                </div>
                <p className="text-[11px] text-muted mt-1 truncate">
                  {guest.guestType}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] tracking-[0.16em] uppercase text-muted">
                  Forecast NPS
                </p>
                <div className="mt-0.5 flex items-baseline gap-2 justify-end">
                  <span className="tnum text-muted/80 line-through text-[13px]">
                    {guest.forecastNpsBefore}
                  </span>
                  <span className="tnum text-[26px] font-extralight text-accent leading-none">
                    {guest.forecastNpsAfter}
                  </span>
                </div>
                <p className="text-[9px] text-muted mt-0.5">
                  before · after orchestration
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              <Stat
                icon={<Plane className="size-3" />}
                label="Flight"
                value={`${guest.flight} · ${guest.flightStatus}`}
              />
              <Stat
                icon={<Utensils className="size-3" />}
                label={`Meal gap · ${guest.mealConfidence}`}
                value={`${guest.mealGapHours.toFixed(1)} h since last ate`}
              />
              <Stat
                icon={<Moon className="size-3" />}
                label="Circadian"
                value={`${guest.circadianState} · ${guest.bodyClockEquivalent}`}
              />
              <Stat
                icon={<MapPin className="size-3" />}
                label="Local context"
                value={guest.localContext}
              />
              <Stat
                icon={<History className="size-3" />}
                label="Prior preference"
                value={guest.priorPreference}
              />
            </div>

            <div className="mt-3">
              <p className="text-[9px] tracking-[0.16em] uppercase text-muted mb-1">
                Automated
              </p>
              <ul className="grid grid-cols-1 gap-y-0.5">
                {guest.automatedActions.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] text-text/90"
                  >
                    <span className="mt-1.5 size-1 rounded-full bg-accent shrink-0" />
                    <span className="line-clamp-1">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-md border border-hairline bg-bg/60 px-3 py-2">
              <p className="text-[9px] tracking-[0.16em] uppercase text-muted">
                Room display
              </p>
              <p className="text-[12px] text-text/90 mt-1 italic leading-snug">
                "{guest.roomDisplayCopy}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
