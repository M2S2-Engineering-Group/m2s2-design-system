<script setup lang="ts">
import type { FeatureCardConfig } from '@m2s2/models';
import BaseCard from '../BaseCard/BaseCard.vue';

defineProps<{ config: FeatureCardConfig }>();
</script>

<template>
  <BaseCard :featured="config.featured ?? false">
    <div class="fc-header">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-if="config.icon" class="fc-icon" aria-hidden="true" v-html="config.icon" />
      <h2 class="fc-title">{{ config.title }}</h2>
    </div>
    <p class="fc-body">{{ config.body }}</p>
    <ul v-if="config.items?.length" class="fc-list">
      <li v-for="item in config.items" :key="item">{{ item }}</li>
    </ul>
    <p v-if="config.note" class="fc-note">{{ config.note }}</p>
  </BaseCard>
</template>

<style lang="scss">
.fc-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.fc-icon {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.fc-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-on-bg);
  margin: 0;
}

.fc-body {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.fc-list {
  padding-left: var(--space-5);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  li {
    font-size: var(--font-size-sm);
    color: var(--color-on-surface-muted);
  }
}

.fc-note {
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-muted);
  font-style: italic;
  margin: 0;
}
</style>
