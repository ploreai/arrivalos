import { motion } from 'framer-motion';
import { sevenDayAverages } from '../data/context';
import type { OwnerMetrics as OwnerMetricsType } from '../types';

interface Props {
  metrics: OwnerMetricsType;
}

function fmtMoney(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

function Stat({
  label,
  value,
  delta,
  invertDelta = false,
  small,
}: {
  label: string;
  value: string;
  delta?: { abs: string; positive: boolean };
  invertDelta?: boolean;
  small?: string;
}) {
  const isPos = delta ? (invertDelta ? !delta.positive : delta.positive) : true;
  return (
    <div className="rounded-md border border-hairline bg-surface-2/40 px-2.5 py-1.5">
      <p className="text-[9px] tracking-[0.16em] uppercase text-muted truncate">
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="tnum text-[17px] font-extralight text-text mt-0.5 leading-tight"
      >
        {value}
      </motion.p>
      {(delta || small) && (
        <p className="text-[10px] text-muted mt-0.5 tnum truncate">
          {delta && (
            <span className={isPos ? 'text-pos' : 'text-neg'}>
              {delta.positive ? '▲' : '▼'} {delta.abs}
            </span>
          )}
          {small && <span className="ml-1.5">{small}</span>}
        </p>
      )}
    </div>
  );
}

export default function OwnerMetrics({ metrics }: Props) {
  const fnpsDelta = metrics.forecastNps - sevenDayAverages.forecastNps;
  const npsDelta = metrics.actualNps - sevenDayAverages.actualNps;
  const adrDelta = metrics.adr - sevenDayAverages.adr;
  const revparDelta = metrics.revpar - sevenDayAverages.revpar;
  const ancDelta = metrics.ancillaryPerStay - sevenDayAverages.ancillaryPerStay;
  const allocPct = Math.round(
    (1 - metrics.upgradeCostToday / metrics.upgradeCostSevenDayAvg) * 100,
  );

  return (
    <section className="rounded-lg border border-hairline bg-surface px-5 py-3">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          Owner Metrics · Today vs 7-day avg
        </p>
        <p className="text-[10px] italic text-text/65 truncate ml-3">
          Upgrades allocated where they protect relationship value.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Stat
          label="Forecast NPS"
          value={String(metrics.forecastNps)}
          delta={{ abs: String(Math.abs(fnpsDelta)), positive: fnpsDelta >= 0 }}
        />
        <Stat
          label="Actual NPS"
          value={String(metrics.actualNps)}
          delta={{ abs: String(Math.abs(npsDelta)), positive: npsDelta >= 0 }}
        />
        <Stat
          label="ADR"
          value={fmtMoney(metrics.adr)}
          delta={{ abs: fmtMoney(Math.abs(adrDelta)), positive: adrDelta >= 0 }}
        />
        <Stat
          label="RevPAR"
          value={fmtMoney(metrics.revpar)}
          delta={{
            abs: fmtMoney(Math.abs(revparDelta)),
            positive: revparDelta >= 0,
          }}
        />
        <Stat
          label="Ancillary / stay"
          value={fmtMoney(metrics.ancillaryPerStay)}
          delta={{ abs: fmtMoney(Math.abs(ancDelta)), positive: ancDelta >= 0 }}
        />
        <Stat
          label="Upgrade today"
          value={fmtMoney(metrics.upgradeCostToday)}
          small={`7d ${fmtMoney(metrics.upgradeCostSevenDayAvg)}`}
        />
        <Stat
          label="Upgrade avoided"
          value={fmtMoney(metrics.upgradeCostAvoided)}
          delta={{
            abs: fmtMoney(metrics.upgradeCostAvoided),
            positive: true,
          }}
        />
        <Stat
          label="Allocation discipline"
          value={`${allocPct}%`}
          small="vs 7d"
        />
      </div>
    </section>
  );
}
