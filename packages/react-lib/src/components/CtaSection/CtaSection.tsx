import { CtaConfig } from '@m2s2/models';
import './CtaSection.scss';

interface CtaSectionProps {
  config: CtaConfig;
}

export function CtaSection({ config }: CtaSectionProps) {
  return (
    <section className="m2s2-cta-section">
      <div className="cta-card">
        <div className="cta-text">
          <h2 className="cta-title">{config.title}</h2>
          <p className="cta-body">{config.body}</p>
        </div>
        <a href={config.route} className="cta-btn">
          {config.label}
        </a>
      </div>
    </section>
  );
}
