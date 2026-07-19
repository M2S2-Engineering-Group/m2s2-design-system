import { SectionHeaderConfig } from "@m2s2/models";
import "./SectionHeader.scss";

interface SectionHeaderProps {
  config: SectionHeaderConfig;
}

export function SectionHeader({ config }: SectionHeaderProps) {
  return (
    <div className="m2s2-section-header">
      <h2 className="sh-label">{config.label}</h2>
      {config.subtitle && <p className="sh-subtitle">{config.subtitle}</p>}
    </div>
  );
}
