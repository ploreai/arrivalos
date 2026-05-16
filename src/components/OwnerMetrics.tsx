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
    <div className="rounded-md border border-hairline bg-surface-2/40 px-4 py-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-muted">
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="tnum text-2xl font-extralight text-text mt-1"
      >
        {value}
      </motion.p>
      {(delta || small) && (
        <p className="text-[11px] text-muted mt-1 tnum">
          {delta && (
            <span className={isPos ? 'text-pos' : 'text-neg'}>
              {delta.positive ? '▲' : '▼'} {delta.abs}
            </span>
          )}
          {small && <span className="ml-2">{small}</span>}
        </p>
      )}
    </div>
  );
}

export default function OwnerMetrics({ metrics }: Props) {
  const npsDelta = metrics.actualNps - sevenDayAverages.actualNps;
  const adrDelta = metrics.adr - sevenDayAverages.adr;
  const revparDelta = metrics.revpar - sevenDayAverages.revpar;
  const ancDelta = metrics.ancillaryPerStay - sevenDayAverages.ancillaryPerStay;

  return (
    <section className="rounded-lg border border-hairline bg-surface px-6 py-5">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
          Owner Metrics · Today vs 7-day avg
        </p>
        <p className="text-[11px] text-muted">Rosewood Hong Kong</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Stat
          label="Forecast NPS"
          value={String(metrics.forecastNps)}
          delta={{
            abs: String(Math.abs(metrics.forecastNps - sevenDayAverages.forecastNps)),
            positive: metrics.forecastNps >= sevenDayAverages.forecastNps,
          }}
        />
        <Stat
          label="Actual NPS"
          value={String(metrics.actualNps)}
          delta={{
            abs: String(Math.abs(npsDelta)),
            positive: npsDelta >= 0,
          }}
        />
        <Stat
          label="ADR"
          value={fmtMoney(metrics.adr)}
          delta={{
            abs: fmtMoney(Math.abs(adrDelta)),
            positive: adrDelta >= 0,
          }}
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
          delta={{
            abs: fmtMoney(Math.abs(ancDelta)),
            positive: ancDelta >= 0,
          }}
        />
        <Stat
          label="Upgrade cost today"
          value={fmtMoney(metrics.upgradeCostToday)}
          small={`7d avg ${fmtMoney(metrics.upgradeCostSevenDayAvg)}`}
        />
        <Stat
          label="Upgrade cost avoided"
          value={fmtMoney(metrics.upgradeCostAvoided)}
          delta={{ abs: fmtMoney(metrics.upgradeCostAvoided), positive: true }}
        />
        <Stat
          label="Allocation discipline"
          value={`${Math.round(
            (1 - metrics.upgradeCostToday / metrics.upgradeCostSevenDayAvg) *
              100,
          )}%`}
          small="vs 7d baseline"
        />
      </div>

      <p className="text-[12px] italic text-muted mt-5 leading-snug">
        Upgrades are not eliminated. They are allocated where they protect
        relationship value.
      </p>
    </section>
  );
}
