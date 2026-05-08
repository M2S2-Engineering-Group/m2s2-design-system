import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { ResizableColDirective } from '../../directives/resizable-col/resizable-col.directive';
import { ColumnDef } from '../../models/data-table/data-table.model';

interface Row {
  date:       string;
  name:       string;
  email:      string;
  engagement: string;
  status:     string;
}

const ALL_ROWS: Row[] = [
  { date: 'May 1, 2026',  name: 'Jane Smith',  email: 'jane@acme.com',     engagement: 'Platform Build',   status: 'reviewing'       },
  { date: 'Apr 28, 2026', name: 'Tom Baker',   email: 'tom@startup.io',    engagement: 'Fractional CTO',   status: 'in_conversation' },
  { date: 'Apr 15, 2026', name: 'Sara Lee',    email: 'sara@company.com',  engagement: 'Code Review',      status: 'received'        },
  { date: 'Apr 10, 2026', name: 'Chris Park',  email: 'chris@venture.co',  engagement: 'Platform Build',   status: 'closed'          },
  { date: 'Mar 30, 2026', name: 'Alicia Moon', email: 'alicia@corp.com',   engagement: 'Fractional CTO',   status: 'cancelled'       },
];

const STATUS_LABELS: Record<string, string> = {
  received:        'Received',
  reviewing:       'Reviewing',
  in_conversation: 'In Conversation',
  closed:          'Closed',
  cancelled:       'Cancelled',
};

const COLUMN_DEFS: ColumnDef[] = [
  { key: 'date',       label: 'Date'       },
  { key: 'name',       label: 'Name'       },
  { key: 'email',      label: 'Email'      },
  { key: 'engagement', label: 'Engagement' },
  { key: 'status',     label: 'Status'     },
];

@Component({
  selector: 'sb-data-table-demo',
  standalone: true,
  imports: [DataTableComponent, ResizableColDirective],
  styles: [`
    .demo-tbl {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      table-layout: fixed;
    }
    .demo-tbl thead { background: var(--color-surface-raised); }
    .demo-tbl th {
      padding: 10px 12px;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-on-surface-muted);
      white-space: nowrap;
      overflow: hidden;
      border-bottom: 2px solid var(--color-border);
    }
    .demo-tbl tbody tr {
      border-bottom: 1px solid var(--color-border);
      transition: background 0.15s;
    }
    .demo-tbl tbody tr:last-child { border-bottom: none; }
    .demo-tbl tbody tr:hover { background: var(--color-surface-raised); }
    .demo-tbl td {
      padding: 10px 12px;
      color: var(--color-on-surface);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .demo-tbl td.muted { color: var(--color-on-surface-muted); }
    .tbl-empty { padding: 24px 12px; text-align: center; color: var(--color-on-surface-muted); }
    .col-date   { width: 120px; }
    .col-name   { width: 150px; }
    .col-email  { width: 210px; }
    .col-eng    { width: 160px; }
    .col-status { width: 140px; }
    .status-pill {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
    }
  `],
  template: `
    <m2s2-data-table
      [columnDefs]="columnDefs"
      [statuses]="statuses"
      [statusLabels]="statusLabels"
      [statusFilter]="statusFilter()"
      [searchValue]="search()"
      [totalCount]="rows.length"
      [filteredCount]="filtered().length"
      [colVisibility]="colVisibility()"
      [emptyMessage]="'No matching inquiries.'"
      (searchChange)="search.set($event)"
      (statusChange)="onStatusChange($event)"
      (colToggle)="toggleCol($event)">

      <table class="demo-tbl">
        <thead>
          <tr>
            @if (colVisibility()['date'])       { <th m2s2ResizableCol class="col-date">Date</th> }
            @if (colVisibility()['name'])       { <th m2s2ResizableCol class="col-name">Name</th> }
            @if (colVisibility()['email'])      { <th m2s2ResizableCol class="col-email">Email</th> }
            @if (colVisibility()['engagement']) { <th m2s2ResizableCol class="col-eng">Engagement</th> }
            @if (colVisibility()['status'])     { <th m2s2ResizableCol class="col-status">Status</th> }
          </tr>
        </thead>
        <tbody>
          @if (filtered().length === 0) {
            <tr>
              <td [attr.colspan]="visibleColCount()" class="tbl-empty">No matching results.</td>
            </tr>
          }
          @for (row of filtered(); track row.email) {
            <tr>
              @if (colVisibility()['date'])       { <td class="muted">{{ row.date }}</td> }
              @if (colVisibility()['name'])       { <td>{{ row.name }}</td> }
              @if (colVisibility()['email'])      { <td class="muted">{{ row.email }}</td> }
              @if (colVisibility()['engagement']) { <td class="muted">{{ row.engagement }}</td> }
              @if (colVisibility()['status'])     {
                <td>
                  <span class="status-pill" [style.background]="statusColor(row.status)">
                    {{ statusLabels[row.status] ?? row.status }}
                  </span>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>

    </m2s2-data-table>
  `,
})
class DataTableDemoComponent {
  readonly rows        = ALL_ROWS;
  readonly columnDefs  = COLUMN_DEFS;
  readonly statuses    = ['all', ...Object.keys(STATUS_LABELS)];
  readonly statusLabels = STATUS_LABELS;

  readonly search       = signal('');
  readonly statusFilter = signal('all');
  readonly colVisibility = signal<Record<string, boolean>>({
    date: true, name: true, email: true, engagement: true, status: true,
  });

  readonly filtered = computed(() => {
    const q   = this.search().toLowerCase().trim();
    const sta = this.statusFilter();
    return this.rows.filter(r => {
      const matchesStatus = sta === 'all' || r.status === sta;
      const matchesSearch = !q || Object.values(r).some(v => v.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  });

  readonly visibleColCount = computed(() =>
    Object.values(this.colVisibility()).filter(Boolean).length
  );

  onStatusChange(status: string): void {
    this.statusFilter.set(this.statusFilter() === status ? 'all' : status);
  }

  toggleCol(key: string): void {
    this.colVisibility.update(v => ({ ...v, [key]: !v[key] }));
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      received:        '#7c3aed',
      reviewing:       '#0369a1',
      in_conversation: '#065f46',
      closed:          '#374151',
      cancelled:       '#6b7280',
    };
    return map[status] ?? '#374151';
  }
}

const DATA_TABLE_CODE = `
// component.ts
readonly search       = signal('');
readonly statusFilter = signal('all');
readonly colVisibility = signal<Record<string, boolean>>({
  date: true, name: true, email: true, status: true,
});
readonly filtered = computed(() => {
  const q   = this.search().toLowerCase().trim();
  const sta = this.statusFilter();
  return this.rows.filter(r =>
    (sta === 'all' || r.status === sta) &&
    (!q || Object.values(r).some(v => v.toLowerCase().includes(q)))
  );
});

// component.html
<m2s2-data-table
  [columnDefs]="columnDefs"
  [statuses]="statuses"
  [statusLabels]="statusLabels"
  [statusFilter]="statusFilter()"
  [searchValue]="search()"
  [totalCount]="rows.length"
  [filteredCount]="filtered().length"
  [colVisibility]="colVisibility()"
  (searchChange)="search.set($event)"
  (statusChange)="statusFilter.set($event)"
  (colToggle)="colVisibility.update(v => ({ ...v, [$event]: !v[$event] }))">

  <table>
    <thead>
      <tr>
        @if (colVisibility()['date'])   { <th m2s2ResizableCol>Date</th>   }
        @if (colVisibility()['name'])   { <th m2s2ResizableCol>Name</th>   }
        @if (colVisibility()['email'])  { <th m2s2ResizableCol>Email</th>  }
        @if (colVisibility()['status']) { <th m2s2ResizableCol>Status</th> }
      </tr>
    </thead>
    <tbody>
      @for (row of filtered(); track row.id) {
        <tr>
          @if (colVisibility()['date'])   { <td>{{ row.date }}</td>   }
          @if (colVisibility()['name'])   { <td>{{ row.name }}</td>   }
          @if (colVisibility()['email'])  { <td>{{ row.email }}</td>  }
          @if (colVisibility()['status']) { <td>{{ row.status }}</td> }
        </tr>
      }
    </tbody>
  </table>

</m2s2-data-table>
`.trim();

const meta: Meta<DataTableDemoComponent> = {
  title:     'Components/DataTable',
  component: DataTableDemoComponent,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      source: { code: DATA_TABLE_CODE, language: 'typescript' },
    },
  },
};

export default meta;
type Story = StoryObj<DataTableDemoComponent>;

export const Default: Story = {
  name: 'Interactive — search, filter, column toggle',
};
