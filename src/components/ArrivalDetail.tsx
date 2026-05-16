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
    <div className="flex items-start gap-2.5">
      <div className="text-muted mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted">
          {label}
        </p>
        <p className="text-[13px] text-text/90 mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function ArrivalDetail({ guest }: Props) {
  return (
    <section className="h-full overflow-y-auto rounded-lg border border-hairline bg-surface px-6 py-5">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          Arrival Intelligence
        </p>
        <p className="text-[12px] italic text-text/70 mt-1">
          Personalization as choreography, not memory.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {guest && (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extralight tracking-tight text-text">
                  {guest.name}
                </h2>
                <div className="mt-2">
                  <NeedBadge needs={guest.needs} size="md" />
                </div>
                <p className="text-[12px] text-muted mt-2">{guest.guestType}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted">
                  Forecast NPS
                </p>
                <div className="mt-1 flex items-baseline gap-2 justify-end">
                  <span className="tnum text-muted/80 line-through text-base">
                    {guest.forecastNpsBefore}
                  </span>
                  <span className="tnum text-3xl font-extralight text-accent">
                    {guest.forecastNpsAfter}
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1">
                  before · after orchestration
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Stat
                icon={<Plane className="size-3.5" />}
                label="Flight"
                value={`${guest.flight} · ${guest.flightStatus}`}
              />
              <Stat
                icon={<Utensils className="size-3.5" />}
                label={`Meal gap · confidence ${guest.mealConfidence}`}
                value={`${guest.mealGapHours.toFixed(1)} h since last ate`}
              />
              <Stat
                icon={<Moon className="size-3.5" />}
                label="Circadian"
                value={`${guest.circadianState} · body clock ${guest.bodyClockEquivalent}`}
              />
              <Stat
                icon={<MapPin className="size-3.5" />}
                label="Local context"
                value={guest.localContext}
              />
              <Stat
                icon={<History className="size-3.5" />}
                label="Prior preference"
                value={guest.priorPreference}
              />
            </div>

            <div className="mt-6">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-2">
                Automated
              </p>
              <ul className="space-y-1.5">
                {guest.automatedActions.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px] text-text/90"
                  >
                    <span className="mt-1.5 size-1 rounded-full bg-accent shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-md border border-hairline bg-bg/60 px-4 py-3">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted">
                Room display
              </p>
              <p className="text-[13px] text-text/90 mt-1.5 italic leading-relaxed">
                "{guest.roomDisplayCopy}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
