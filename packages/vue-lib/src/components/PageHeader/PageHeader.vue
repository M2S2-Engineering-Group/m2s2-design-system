<script setup lang="ts">
import type { PageHeaderConfig } from '@m2s2/models';

defineProps<{ config: PageHeaderConfig }>();
</script>

<template>
  <header class="m2s2-page-header">
    <h1 class="page-title">
      {{ config.title }}
    </h1>
    <p class="page-subtitle">
      {{ config.subtitle }}
    </p>
  </header>
</template>

<style lang="scss">
.m2s2-page-header {
  display: block;
  text-align: center;
  margin-bottom: var(--space-12);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-bg);
  margin: 0 0 var(--space-4);

  @media (max-width: 767px) { font-size: var(--font-size-2xl); }
}

.page-subtitle {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-on-surface-muted);
  margin: 0;

  @media (max-width: 767px) { font-size: var(--font-size-base); }
}
</style>
