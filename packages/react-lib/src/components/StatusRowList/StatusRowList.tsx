import { StatusRowItem } from "@m2s2/models";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import "./StatusRowList.scss";

interface StatusRowListProps {
  rows: StatusRowItem[];
}

export function StatusRowList({ rows }: StatusRowListProps) {
  return (
    <ul className="srl-list">
      {rows.map((row) => (
        <li className="srl-row" key={row.id}>
          <div className="srl-main">
            <span className="srl-label">{row.label}</span>
            <StatusBadge status={row.status} />
          </div>
          {row.detail && <p className="srl-detail">{row.detail}</p>}
          {row.link && (
            <a
              className="srl-link"
              href={row.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
