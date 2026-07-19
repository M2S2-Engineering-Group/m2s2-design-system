<script setup lang="ts">
import { ref } from "vue";
import type { ColumnDef } from "@m2s2/models";
import { getStatusLabel as resolveStatusLabel } from "@m2s2/utils";

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    columnDefs: () => [],
    colVisibility: () => ({}),
    statuses: () => [],
    statusFilter: "all",
    statusLabels: () => ({}),
    searchValue: "",
    searchPlaceholder: "Search…",
    totalCount: 0,
    filteredCount: 0,
    emptyMessage: "No data yet.",
  },
);

const emit = defineEmits<{
  searchChange: [value: string];
  statusChange: [status: string];
  colToggle: [key: string];
}>();

const showCols = ref(false);
const colWrapRef = ref<HTMLElement | null>(null);

function getStatusLabel(s: string): string {
  return resolveStatusLabel(s, props.statusLabels);
}

function onDocClick(e: MouseEvent): void {
  if (!colWrapRef.value?.contains(e.target as Node)) {
    showCols.value = false;
    document.removeEventListener("click", onDocClick);
  }
}

function toggleCols(): void {
  showCols.value = !showCols.value;
  if (showCols.value) {
    setTimeout(() => document.addEventListener("click", onDocClick), 0);
  }
}
</script>

<template>
  <div class="table-panel">
    <p v-if="totalCount === 0" class="dt-empty">
      {{ emptyMessage }}
    </p>

    <template v-else>
      <div class="dt-toolbar">
        <template v-if="statuses.length > 0">
          <input
            class="dt-search"
            type="search"
            :placeholder="searchPlaceholder"
            aria-label="Search"
            :value="searchValue"
            @input="
              emit('searchChange', ($event.target as HTMLInputElement).value)
            "
          />
          <div class="dt-pills" role="group" aria-label="Filter by status">
            <button
              v-for="s in statuses"
              :key="s"
              class="dt-pill"
              :class="{ 'dt-pill--active': statusFilter === s }"
              @click="emit('statusChange', s)"
            >
              {{ getStatusLabel(s) }}
            </button>
          </div>
          <span class="dt-count">{{ filteredCount }} of {{ totalCount }}</span>
        </template>

        <div v-if="columnDefs.length > 0" ref="colWrapRef" class="dt-col-wrap">
          <button
            class="dt-col-btn"
            :aria-expanded="showCols"
            aria-controls="dt-col-panel"
            @click="toggleCols"
          >
            &#9881; Columns
          </button>
          <div v-if="showCols" id="dt-col-panel" class="dt-col-panel">
            <label
              v-for="col in columnDefs"
              :key="col.key"
              class="dt-col-check"
            >
              <input
                type="checkbox"
                :checked="colVisibility[col.key] ?? true"
                @change="emit('colToggle', col.key)"
              />
              {{ col.label }}
            </label>
          </div>
        </div>
      </div>

      <div class="dt-scroll">
        <slot />
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@use "packages/tokens/src/mixins" as m;

.table-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.dt-empty {
  padding: var(--space-10);
  text-align: center;
  color: var(--color-on-surface-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}

.dt-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.dt-search {
  @include m.form-input-compact;
  width: 200px;
  flex-shrink: 0;
  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
}

.dt-pills {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.dt-pill {
  @include m.filter-pill;
  &--active {
    @include m.filter-pill-active;
  }
}

.dt-count {
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-muted);
  white-space: nowrap;
  margin-right: auto;
}

.dt-col-wrap {
  position: relative;
  margin-left: auto;
}

.dt-col-btn {
  @include m.filter-pill;
}

.dt-col-panel {
  @include m.floating-panel;
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-1));
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: var(--z-dropdown);
  min-width: 140px;
}

.dt-col-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  cursor: pointer;

  input[type="checkbox"] {
    cursor: pointer;
    accent-color: var(--color-primary);
  }
}

.dt-scroll {
  overflow-x: auto;
}

@media (max-width: 767px) {
  .dt-search {
    width: 100%;
  }
  .dt-scroll {
    overflow-x: visible;
  }
}
</style>
