import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { OVERRIDE_REASONS, type OverrideReason } from '../types';

interface Props {
  guestName: string | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: OverrideReason) => void;
}

export default function OverrideModal({
  guestName,
  open,
  onClose,
  onSubmit,
}: Props) {
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
            className="w-full max-w-md rounded-xl bg-surface border border-hairline shadow-2xl"
          >
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-hairline">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                  Override
                </p>
                <h2 className="text-lg font-light text-text mt-1">
                  {guestName}
                </h2>
                <p className="text-[12px] text-muted mt-1">
                  Logged for model update.
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
            <div className="p-3">
              {OVERRIDE_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => onSubmit(reason)}
                  className="w-full text-left px-3 py-2.5 rounded-md text-[13px] text-text/90 hover:bg-surface-2 hover:text-text border border-transparent hover:border-hairline transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
