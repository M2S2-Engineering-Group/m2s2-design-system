import { useEffect, useRef, useState } from 'react';
import type { ColumnDef } from '@m2s2/models';
import { getStatusLabel } from '@m2s2/utils';
import './DataTable.scss';

interface DataTableProps {
  children: React.ReactNode;
  columnDefs?: ColumnDef[];
  colVisibility?: Record<string, boolean>;
  statuses?: string[];
  statusFilter?: string;
  statusLabels?: Record<string, string>;
  searchValue?: string;
  searchPlaceholder?: string;
  totalCount?: number;
  filteredCount?: number;
  emptyMessage?: string;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (status: string) => void;
  onColToggle?: (key: string) => void;
}

export function DataTable({
  children,
  columnDefs = [],
  colVisibility = {},
  statuses = [],
  statusFilter = 'all',
  statusLabels = {},
  searchValue = '',
  searchPlaceholder = 'Search…',
  totalCount = 0,
  filteredCount = 0,
  emptyMessage = 'No data yet.',
  onSearchChange,
  onStatusChange,
  onColToggle,
}: DataTableProps) {
  const [showCols, setShowCols] = useState(false);
  const colWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCols) return;
    function handleClick(e: MouseEvent) {
      if (!colWrapRef.current?.contains(e.target as Node)) {
        setShowCols(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showCols]);

  if (totalCount === 0) {
    return (
      <div className="table-panel">
        <p className="dt-empty">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-panel">
      <div className="dt-toolbar">
        {statuses.length > 0 && (
          <>
            <input
              className="dt-search"
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Search"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
            />
            <div className="dt-pills" role="group" aria-label="Filter by status">
              {statuses.map(s => (
                <button
                  key={s}
                  className={`dt-pill${statusFilter === s ? ' dt-pill--active' : ''}`}
                  onClick={() => onStatusChange?.(s)}
                >
                  {getStatusLabel(s, statusLabels)}
                </button>
              ))}
            </div>
            <span className="dt-count">{filteredCount} of {totalCount}</span>
          </>
        )}

        {columnDefs.length > 0 && (
          <div className="dt-col-wrap" ref={colWrapRef}>
            <button
              className="dt-col-btn"
              aria-expanded={showCols}
              aria-controls="dt-col-panel"
              onClick={() => setShowCols(v => !v)}
            >
              ⚙ Columns
            </button>
            {showCols && (
              <div id="dt-col-panel" className="dt-col-panel">
                {columnDefs.map(col => (
                  <label key={col.key} className="dt-col-check">
                    <input
                      type="checkbox"
                      checked={colVisibility[col.key] ?? true}
                      onChange={() => onColToggle?.(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dt-scroll">{children}</div>
    </div>
  );
}
