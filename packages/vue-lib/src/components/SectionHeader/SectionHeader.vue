<script setup lang="ts">
import type { SectionHeaderConfig } from '@m2s2/models';

defineProps<{ config: SectionHeaderConfig }>();
</script>

<template>
  <div class="m2s2-section-header">
    <h2 class="sh-label">{{ config.label }}</h2>
    <p v-if="config.subtitle" class="sh-subtitle">{{ config.subtitle }}</p>
  </div>
</template>

<style lang="scss">
.m2s2-section-header {
  display: block;
  text-align: center;
  margin-bottom: var(--space-8);
}

.sh-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin: 0 0 var(--space-2);
}

.sh-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-on-surface-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}
</style>
