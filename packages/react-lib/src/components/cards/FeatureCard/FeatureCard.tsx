import { FeatureCardConfig } from "@m2s2/models";
import { BaseCard } from "../BaseCard/BaseCard";
import "./FeatureCard.scss";

interface FeatureCardProps {
  config: FeatureCardConfig;
}

export function FeatureCard({ config }: FeatureCardProps) {
  return (
    <BaseCard featured={config.featured ?? false}>
      <div className="fc-header">
        {config.icon && (
          <span className="fc-icon" aria-hidden="true">
            {config.icon}
          </span>
        )}
        <h2 className="fc-title">{config.title}</h2>
      </div>
      <p className="fc-body">{config.body}</p>
      {config.items && config.items.length > 0 && (
        <ul className="fc-list">
          {config.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {config.note && <p className="fc-note">{config.note}</p>}
    </BaseCard>
  );
}
