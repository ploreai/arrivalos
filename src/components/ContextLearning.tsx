import { motion } from 'framer-motion';
import { Radar, ScrollText, GitBranch } from 'lucide-react';
import type { BanditWeight, ContextSignal, Intervention } from '../types';

interface Props {
  context: ContextSignal[];
  bandit: BanditWeight[];
  interventions: Intervention[];
}

function BanditRow({ row }: { row: BanditWeight }) {
  const positive = row.delta >= 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12.5px] text-text/90 w-44 shrink-0 truncate">
        {row.package}
      </span>
      <div className="relative h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${row.weight}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-accent/80"
        />
      </div>
      <span className="tnum text-[12px] text-text/90 w-9 text-right">
        {row.weight}%
      </span>
      <span
        className={`tnum text-[11px] w-12 text-right ${
          positive ? 'text-pos' : 'text-neg'
        }`}
      >
        {positive ? '+' : ''}
        {row.delta}%
      </span>
    </div>
  );
}

export default function ContextLearning({
  context,
  bandit,
  interventions,
}: Props) {
  return (
    <section className="rounded-lg border border-hairline bg-surface px-6 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Radar className="size-3.5 text-muted" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Local Context Radar
            </p>
          </div>
          <ul className="space-y-2">
            {context.map((c) => (
              <li key={c.id}>
                <p className="text-[13px] text-text/90">{c.label}</p>
                <p className="text-[11px] text-muted leading-snug">
                  {c.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="size-3.5 text-muted" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Arrival Package Bandit
            </p>
          </div>
          <div className="space-y-2.5">
            {bandit.map((row) => (
              <BanditRow row={row} key={row.package} />
            ))}
          </div>
          <p className="text-[12px] italic text-muted mt-4 leading-snug">
            Generic luxury is underperforming. State-aware choreography is
            winning.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ScrollText className="size-3.5 text-muted" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Intervention Log
            </p>
          </div>
          {interventions.length === 0 ? (
            <p className="text-[12.5px] text-muted italic">
              No interventions yet. Automation is running.
            </p>
          ) : (
            <ul className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {interventions.map((i) => (
                <motion.li
                  key={i.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="text-[12.5px] text-text/90 leading-snug"
                >
                  <span className="text-muted tnum">{i.timestamp}</span>{' '}
                  · <span className="text-text">{i.guestName}</span>{' '}
                  <span className="text-muted">— Override:</span>{' '}
                  <span className="text-accent">{i.reason}</span>
                  <p className="text-[11.5px] text-muted mt-0.5">{i.detail}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-[11.5px] text-muted/80 mt-6 italic">
        The hotel adapts to the guest's present-tense human state before the
        guest has to explain it.
      </p>
    </section>
  );
}
