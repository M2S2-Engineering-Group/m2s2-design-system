import { Fragment } from 'react';
import { StatItem } from '@m2s2/models';
import './StatRow.scss';

interface StatRowProps {
  stats: StatItem[];
}

export function StatRow({ stats }: StatRowProps) {
  return (
    <div className="sr-row">
      {stats.map((stat, i) => (
        <Fragment key={stat.label}>
          <div className="sr-item">
            <span className="sr-value">{stat.value}</span>
            <span className="sr-label">{stat.label}</span>
          </div>
          {i < stats.length - 1 && <div className="sr-divider" aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}
