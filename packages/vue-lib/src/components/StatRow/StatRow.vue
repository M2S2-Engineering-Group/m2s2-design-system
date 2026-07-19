<script setup lang="ts">
import type { StatItem } from "@m2s2/models";

defineProps<{ stats: StatItem[] }>();
</script>

<template>
  <div class="sr-row">
    <template v-for="(stat, i) in stats" :key="stat.label">
      <div class="sr-item">
        <span class="sr-value">{{ stat.value }}</span>
        <span class="sr-label">{{ stat.label }}</span>
      </div>
      <div v-if="i < stats.length - 1" class="sr-divider" aria-hidden="true" />
    </template>
  </div>
</template>

<style lang="scss">
.sr-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.sr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-1);
  padding: 0 var(--space-4);
}

.sr-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  line-height: 1;
}

.sr-label {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface-muted);
}

.sr-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
  flex-shrink: 0;
}
</style>
