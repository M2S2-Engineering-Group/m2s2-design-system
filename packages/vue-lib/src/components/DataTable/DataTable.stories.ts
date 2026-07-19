import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import DataTable from "./DataTable.vue";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

interface Row {
  date: string;
  name: string;
  email: string;
  engagement: string;
  status: string;
}

const ALL_ROWS: Row[] = [
  {
    date: "May 1, 2026",
    name: "Jane Smith",
    email: "jane@acme.com",
    engagement: "Platform Build",
    status: "reviewing",
  },
  {
    date: "Apr 28, 2026",
    name: "Tom Baker",
    email: "tom@startup.io",
    engagement: "Fractional CTO",
    status: "in_conversation",
  },
  {
    date: "Apr 15, 2026",
    name: "Sara Lee",
    email: "sara@company.com",
    engagement: "Code Review",
    status: "received",
  },
  {
    date: "Apr 10, 2026",
    name: "Chris Park",
    email: "chris@venture.co",
    engagement: "Platform Build",
    status: "closed",
  },
  {
    date: "Mar 30, 2026",
    name: "Alicia Moon",
    email: "alicia@corp.com",
    engagement: "Fractional CTO",
    status: "cancelled",
  },
];

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  reviewing: "Reviewing",
  in_conversation: "In Conversation",
  closed: "Closed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  received: "#7c3aed",
  reviewing: "#0369a1",
  in_conversation: "#065f46",
  closed: "#374151",
  cancelled: "#6b7280",
};

const DEMO_STYLES = `
  .demo-tbl { width: 100%; border-collapse: collapse; font-size: 0.875rem; table-layout: fixed; }
  .demo-tbl thead { background: var(--color-surface-raised); }
  .demo-tbl th { padding: 10px 12px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-on-surface-muted); border-bottom: 2px solid var(--color-border); white-space: nowrap; overflow: hidden; }
  .demo-tbl tbody tr { border-bottom: 1px solid var(--color-border); transition: background 0.15s; }
  .demo-tbl tbody tr:last-child { border-bottom: none; }
  .demo-tbl tbody tr:hover { background: var(--color-surface-raised); }
  .demo-tbl td { padding: 10px 12px; color: var(--color-on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .demo-tbl td.muted { color: var(--color-on-surface-muted); }
  .demo-tbl .col-date { width: 120px; }
  .demo-tbl .col-name { width: 150px; }
  .demo-tbl .col-email { width: 210px; }
  .demo-tbl .col-eng { width: 160px; }
  .demo-tbl .col-status { width: 140px; }
  .tbl-empty { padding: 24px 12px; text-align: center; color: var(--color-on-surface-muted); }
  .status-pill { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; color: #fff; white-space: nowrap; }
`;

export const Default: Story = {
  name: "Interactive — search, filter, column toggle",
  render: () => ({
    components: { DataTable },
    setup() {
      const search = ref("");
      const statusFilter = ref("all");
      const colVisibility = ref<Record<string, boolean>>({
        date: true,
        name: true,
        email: true,
        engagement: true,
        status: true,
      });

      const filtered = computed(() => {
        const q = search.value.toLowerCase().trim();
        const s = statusFilter.value;
        return ALL_ROWS.filter(
          (r) =>
            (s === "all" || r.status === s) &&
            (!q || Object.values(r).some((v) => v.toLowerCase().includes(q))),
        );
      });

      const visibleColCount = computed(
        () => Object.values(colVisibility.value).filter(Boolean).length,
      );

      function onStatusChange(status: string) {
        statusFilter.value = statusFilter.value === status ? "all" : status;
      }

      function toggleCol(key: string) {
        colVisibility.value = {
          ...colVisibility.value,
          [key]: !colVisibility.value[key],
        };
      }

      onMounted(() => {
        const el = document.createElement("style");
        el.id = "dt-demo-styles";
        el.textContent = DEMO_STYLES;
        document.head.appendChild(el);
      });

      onUnmounted(() => {
        document.getElementById("dt-demo-styles")?.remove();
      });

      return {
        search,
        statusFilter,
        colVisibility,
        filtered,
        visibleColCount,
        onStatusChange,
        toggleCol,
        STATUS_LABELS,
        STATUS_COLORS,
        statuses: ["all", ...Object.keys(STATUS_LABELS)],
        rows: ALL_ROWS,
      };
    },
    template: `
      <DataTable
        :column-defs="[
          { key: 'date',       label: 'Date'       },
          { key: 'name',       label: 'Name'       },
          { key: 'email',      label: 'Email'      },
          { key: 'engagement', label: 'Engagement' },
          { key: 'status',     label: 'Status'     },
        ]"
        :statuses="statuses"
        :status-labels="STATUS_LABELS"
        :status-filter="statusFilter"
        :search-value="search"
        :total-count="rows.length"
        :filtered-count="filtered.length"
        :col-visibility="colVisibility"
        empty-message="No matching inquiries."
        @search-change="search = $event"
        @status-change="onStatusChange"
        @col-toggle="toggleCol"
      >
        <table class="demo-tbl">
          <thead>
            <tr>
              <th v-if="colVisibility['date']"       class="col-date">Date</th>
              <th v-if="colVisibility['name']"       class="col-name">Name</th>
              <th v-if="colVisibility['email']"      class="col-email">Email</th>
              <th v-if="colVisibility['engagement']" class="col-eng">Engagement</th>
              <th v-if="colVisibility['status']"     class="col-status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td :colspan="visibleColCount" class="tbl-empty">No matching results.</td>
            </tr>
            <tr v-for="row in filtered" :key="row.email">
              <td v-if="colVisibility['date']"       class="muted">{{ row.date }}</td>
              <td v-if="colVisibility['name']">{{ row.name }}</td>
              <td v-if="colVisibility['email']"       class="muted">{{ row.email }}</td>
              <td v-if="colVisibility['engagement']" class="muted">{{ row.engagement }}</td>
              <td v-if="colVisibility['status']">
                <span class="status-pill" :style="{ background: STATUS_COLORS[row.status] ?? '#374151' }">
                  {{ STATUS_LABELS[row.status] ?? row.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </DataTable>
    `,
  }),
};
