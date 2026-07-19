import { PageHeaderConfig } from "@m2s2/models";
import "./PageHeader.scss";

interface PageHeaderProps {
  config: PageHeaderConfig;
}

export function PageHeader({ config }: PageHeaderProps) {
  return (
    <header className="m2s2-page-header">
      <h1 className="page-title">{config.title}</h1>
      <p className="page-subtitle">{config.subtitle}</p>
    </header>
  );
}
