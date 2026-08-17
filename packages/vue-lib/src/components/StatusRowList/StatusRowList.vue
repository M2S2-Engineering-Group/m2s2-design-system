<script setup lang="ts">
import type { StatusRowItem } from "@m2s2/models";
import StatusBadge from "../StatusBadge/StatusBadge.vue";

defineProps<{ rows: StatusRowItem[] }>();
</script>

<template>
  <ul class="srl-list">
    <li
      v-for="row in rows"
      :key="row.id"
      class="srl-row"
    >
      <div class="srl-main">
        <span class="srl-label">{{ row.label }}</span>
        <StatusBadge :status="row.status" />
      </div>
      <p
        v-if="row.detail"
        class="srl-detail"
      >
        {{ row.detail }}
      </p>
      <a
        v-if="row.link"
        class="srl-link"
        :href="row.link.href"
        target="_blank"
        rel="noopener noreferrer"
      >{{ row.link.label }}</a>
    </li>
  </ul>
</template>

<style lang="scss">
.srl-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.srl-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.srl-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.srl-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.srl-detail {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-muted);
}

.srl-link {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
}
</style>
