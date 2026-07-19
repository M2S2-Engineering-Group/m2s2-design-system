<script setup lang="ts">
import type { CtaConfig } from "@m2s2/models";

defineProps<{ config: CtaConfig }>();
</script>

<template>
  <section class="m2s2-cta-section">
    <div class="cta-card">
      <div class="cta-text">
        <h2 class="cta-title">
          {{ config.title }}
        </h2>
        <p class="cta-body">
          {{ config.body }}
        </p>
      </div>
      <a :href="config.route" class="cta-btn">{{ config.label }}</a>
    </div>
  </section>
</template>

<style lang="scss">
@use "packages/tokens/src/mixins" as m;

.m2s2-cta-section {
  padding: var(--space-12) 0;
}

.cta-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid transparent;
  border-image: var(--gradient-brand) 1;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding: var(--space-8) var(--space-10);
    gap: var(--space-8);
  }
}

.cta-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cta-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-bg);
  margin: 0;

  @media (min-width: 768px) {
    font-size: var(--font-size-2xl);
  }
}

.cta-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-on-surface-muted);
  margin: 0;
  max-width: 540px;
}

.cta-btn {
  @include m.btn-brand;
  flex-shrink: 0;
}
</style>
