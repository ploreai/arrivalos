import type { NeedState } from '../types';

const NEED_LABEL: Record<NeedState, string> = {
  rest: 'Rest',
  culture: 'Culture',
  work: 'Work',
  celebrate: 'Celebrate',
  family: 'Family',
  status: 'Status',
};

const NEED_DOT: Record<NeedState, string> = {
  rest: 'bg-need-rest',
  culture: 'bg-need-culture',
  work: 'bg-need-work',
  celebrate: 'bg-need-celebrate',
  family: 'bg-need-family',
  status: 'bg-need-status',
};

interface Props {
  needs: NeedState[];
  size?: 'sm' | 'md';
}

export default function NeedBadge({ needs, size = 'sm' }: Props) {
  const px = size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5';
  const text = size === 'md' ? 'text-xs' : 'text-[11px]';
  return (
    <div className="flex items-center gap-1.5">
      {needs.map((n) => (
        <span
          key={n}
          className={`inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2 text-text/90 ${px} ${text}`}
        >
          <span className={`size-1.5 rounded-full ${NEED_DOT[n]}`} />
          {NEED_LABEL[n]}
        </span>
      ))}
    </div>
  );
}
