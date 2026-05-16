import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Radar, ScrollText, GitBranch, X } from 'lucide-react';
import type { BanditWeight, ContextSignal, Intervention } from '../types';

interface Props {
  context: ContextSignal[];
  bandit: BanditWeight[];
  interventions: Intervention[];
}

function BanditRow({ row }: { row: BanditWeight }) {
  const positive = row.delta >= 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11.5px] text-text/90 w-40 shrink-0 truncate">
        {row.package}
      </span>
      <div className="relative h-1 flex-1 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${row.weight}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-accent/80"
        />
      </div>
      <span className="tnum text-[11px] text-text/90 w-8 text-right">
        {row.weight}%
      </span>
      <span
        className={`tnum text-[10px] w-10 text-right ${
          positive ? 'text-pos' : 'text-neg'
        }`}
      >
        {positive ? '+' : ''}
        {row.delta}%
      </span>
    </div>
  );
}

function InterventionLogModal({
  open,
  onClose,
  interventions,
}: {
  open: boolean;
  onClose: () => void;
  interventions: Intervention[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-xl bg-surface border border-hairline shadow-2xl"
          >
            <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-hairline">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                  Intervention Log
                </p>
                <h2 className="text-lg font-light text-text mt-1">
                  {interventions.length}{' '}
                  {interventions.length === 1 ? 'override' : 'overrides'} today
                </h2>
                <p className="text-[11px] text-muted mt-1 italic">
                  Each entry is logged for model update.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-text p-1 -m-1"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {interventions.length === 0 ? (
                <p className="text-[13px] text-muted italic">
                  No interventions yet. Automation is running.
                </p>
              ) : (
                <ul className="space-y-3">
                  {interventions.map((i) => (
                    <li
                      key={i.id}
                      className="border-l border-hairline pl-3 -ml-3"
                    >
                      <p className="text-[12px] text-text leading-snug">
                        <span className="text-muted tnum">{i.timestamp}</span>{' '}
                        · <span>{i.guestName}</span>{' '}
                        <span className="text-accent">— {i.reason}</span>
                      </p>
                      <p className="text-[11.5px] text-muted mt-0.5 leading-snug">
                        {i.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ContextLearning({
  context,
  bandit,
  interventions,
}: Props) {
  const [logOpen, setLogOpen] = useState(false);
  const count = interventions.length;

  return (
    <section className="rounded-lg border border-hairline bg-surface px-5 py-3">
      <div className="flex items-baseline justify-between mb-2 gap-3">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          Local Context · Learning
        </p>
        <button
          onClick={() => setLogOpen(true)}
          className={`inline-flex items-center gap-1.5 border rounded-md px-2 py-1 text-[10px] tracking-[0.12em] uppercase transition-colors ${
            count > 0
              ? 'border-accent/40 bg-surface-2 text-accent hover:bg-surface-2/80'
              : 'border-hairline text-muted hover:text-text hover:bg-surface-2'
          }`}
        >
          <ScrollText className="size-3" />
          Interventions · {count}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Radar className="size-3 text-muted" />
            <p className="text-[9px] tracking-[0.18em] uppercase text-muted">
              Local Context
            </p>
          </div>
          <ul className="space-y-1">
            {context.map((c) => (
              <li key={c.id} className="min-w-0">
                <p className="text-[11.5px] text-text/90 truncate">{c.label}</p>
                <p className="text-[10px] text-muted leading-snug truncate">
                  {c.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <GitBranch className="size-3 text-muted" />
            <p className="text-[9px] tracking-[0.18em] uppercase text-muted">
              Arrival Package Bandit
            </p>
          </div>
          <div className="space-y-1.5">
            {bandit.map((row) => (
              <BanditRow row={row} key={row.package} />
            ))}
          </div>
          <p className="text-[10px] italic text-muted mt-1.5 leading-snug">
            Generic luxury is underperforming. State-aware choreography is
            winning.
          </p>
        </div>
      </div>

      <p className="text-[10px] text-muted/80 mt-2 italic leading-snug">
        The hotel adapts to the guest's present-tense state before the guest has
        to explain it.
      </p>

      <InterventionLogModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        interventions={interventions}
      />
    </section>
  );
}
