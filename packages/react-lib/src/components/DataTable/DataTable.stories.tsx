import type { Meta, StoryObj } from '@storybook/react';
import { useState, useMemo } from 'react';
import { DataTable } from './DataTable';

interface Row { date: string; name: string; email: string; engagement: string; status: string; }

const ALL_ROWS: Row[] = [
  { date: 'May 1, 2026',  name: 'Jane Smith',  email: 'jane@acme.com',    engagement: 'Platform Build',  status: 'reviewing'       },
  { date: 'Apr 28, 2026', name: 'Tom Baker',   email: 'tom@startup.io',   engagement: 'Fractional CTO',  status: 'in_conversation' },
  { date: 'Apr 15, 2026', name: 'Sara Lee',    email: 'sara@company.com', engagement: 'Code Review',     status: 'received'        },
  { date: 'Apr 10, 2026', name: 'Chris Park',  email: 'chris@venture.co', engagement: 'Platform Build',  status: 'closed'          },
  { date: 'Mar 30, 2026', name: 'Alicia Moon', email: 'alicia@corp.com',  engagement: 'Fractional CTO',  status: 'cancelled'       },
];

const STATUS_LABELS: Record<string, string> = {
  received: 'Received', reviewing: 'Reviewing',
  in_conversation: 'In Conversation', closed: 'Closed', cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<string, string> = {
  received: '#7c3aed', reviewing: '#0369a1', in_conversation: '#065f46',
  closed: '#374151', cancelled: '#6b7280',
};

const COLUMN_DEFS = [
  { key: 'date', label: 'Date' }, { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }, { key: 'engagement', label: 'Engagement' },
  { key: 'status', label: 'Status' },
];

const tblStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', tableLayout: 'fixed',
};
const thStyle: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-on-surface-muted)',
  whiteSpace: 'nowrap', borderBottom: '2px solid var(--color-border)',
};
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', color: 'var(--color-on-surface)',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
const pillStyle = (status: string): React.CSSProperties => ({
  padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
  color: '#fff', background: STATUS_COLOR[status] ?? '#374151', whiteSpace: 'nowrap',
});

function Demo() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('all');
  const [colVisibility, setColVis]    = useState<Record<string, boolean>>(
    Object.fromEntries(COLUMN_DEFS.map(c => [c.key, true]))
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_ROWS.filter(r => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch = !q || Object.values(r).some(v => v.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  function toggleCol(key: string) {
    setColVis(v => ({ ...v, [key]: !v[key] }));
  }

  const statuses = ['all', ...Object.keys(STATUS_LABELS)];

  return (
    <DataTable
      columnDefs={COLUMN_DEFS}
      colVisibility={colVisibility}
      statuses={statuses}
      statusFilter={statusFilter}
      statusLabels={STATUS_LABELS}
      searchValue={search}
      totalCount={ALL_ROWS.length}
      filteredCount={filtered.length}
      onSearchChange={setSearch}
      onStatusChange={s => setStatus(prev => prev === s ? 'all' : s)}
      onColToggle={toggleCol}
    >
      <table style={tblStyle}>
        <thead style={{ background: 'var(--color-surface-raised)' }}>
          <tr>
            {colVisibility['date']       && <th style={{ ...thStyle, width: 120 }}>Date</th>}
            {colVisibility['name']       && <th style={{ ...thStyle, width: 150 }}>Name</th>}
            {colVisibility['email']      && <th style={{ ...thStyle, width: 210 }}>Email</th>}
            {colVisibility['engagement'] && <th style={{ ...thStyle, width: 160 }}>Engagement</th>}
            {colVisibility['status']     && <th style={{ ...thStyle, width: 140 }}>Status</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={Object.values(colVisibility).filter(Boolean).length}
                  style={{ ...tdStyle, textAlign: 'center', color: 'var(--color-on-surface-muted)' }}>
                No matching results.
              </td>
            </tr>
          ) : filtered.map(row => (
            <tr key={row.email} style={{ borderBottom: '1px solid var(--color-border)' }}>
              {colVisibility['date']       && <td style={{ ...tdStyle, color: 'var(--color-on-surface-muted)' }}>{row.date}</td>}
              {colVisibility['name']       && <td style={tdStyle}>{row.name}</td>}
              {colVisibility['email']      && <td style={{ ...tdStyle, color: 'var(--color-on-surface-muted)' }}>{row.email}</td>}
              {colVisibility['engagement'] && <td style={{ ...tdStyle, color: 'var(--color-on-surface-muted)' }}>{row.engagement}</td>}
              {colVisibility['status']     && <td style={tdStyle}><span style={pillStyle(row.status)}>{STATUS_LABELS[row.status]}</span></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </DataTable>
  );
}

const meta: Meta = {
  title: 'Components/DataTable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

export const Default: StoryObj = {
  name: 'Interactive — search, filter, column toggle',
  render: () => <Demo />,
};
