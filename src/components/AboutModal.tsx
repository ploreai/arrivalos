import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const VENDORS = [
  'Oracle OPERA',
  'OHIP',
  'Sabre SynXis',
  'Hapi (AWS)',
  'Salesforce',
  'Cendyn',
  'Canary AI',
  'Adobe',
  'Sojern',
  'Triptease',
  'OneTrust',
  'Cirium',
];

export default function AboutModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
            className="w-full max-w-2xl rounded-xl bg-surface border border-hairline shadow-2xl"
          >
            <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-hairline">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
                  About this demo
                </p>
                <h2 className="text-lg font-light text-text mt-1">
                  Sense of Arrival · pre-arrival orchestration layer
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-text p-1 -m-1"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 text-[13px] text-text/90 leading-relaxed">
              <blockquote className="border-l border-accent/50 pl-4 italic text-text/85">
                "Predict guest needs — preferred views, wake-up times, dietary
                requirements — before the guest has to ask."
                <footer className="not-italic text-muted text-[11px] mt-1.5">
                  — Sonia Cheng, CEO, Rosewood Hotel Group
                </footer>
              </blockquote>

              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1">
                  Where this sits
                </p>
                <p>
                  Rosewood already deploys <strong>Canary Technologies</strong>{' '}
                  for in-stay engagement — check-in, guest messaging, AI Voice,
                  AI Webchat, digital tipping. Canary owns{' '}
                  <em>T-0 onwards</em>.
                </p>
                <p className="mt-2">
                  <strong>Sense of Arrival</strong> is the{' '}
                  <em>pre-arrival</em> orchestration layer (T-2h → T-0) that
                  sits upstream of Canary. It reads flight, meal-timing,
                  circadian, occupancy, local-context, CRM-preference, and
                  prior-stay signals from{' '}
                  <strong>OPERA / Hapi / Salesforce / Cendyn</strong>, infers
                  guest need-state, and fires room IoT, F&B, and itinerary
                  actions automatically — before the guest is in messaging
                  range of Canary.
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1">
                  Architecture
                </p>
                <pre className="text-[11px] tnum bg-bg/60 border border-hairline rounded-md px-3 py-2 overflow-x-auto leading-relaxed text-text/85">
{`OPERA  ─┐
        ├─→  Hapi (AWS)  ─→  Salesforce / Cendyn  ─→  Sense of Arrival  ─→  Room IoT
Sabre   ─┤                                            (need-state, NPS,
        │                                              upgrade ROI,
CRM     ─┘  Cirium · curated events · weather  ──────→ bandit choice)   └─→  Canary AI (T-0+)`}
                </pre>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1.5">
                  Integration surface
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {VENDORS.map((v) => (
                    <span
                      key={v}
                      className="text-[11px] border border-hairline rounded-full px-2 py-0.5 text-text/85 bg-surface-2/50"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-muted italic">
                Hackathon MVP · synthetic data · no backend · no real APIs.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
