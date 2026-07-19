<script setup lang="ts">
import type { ProcessStep } from "@m2s2/models";

defineProps<{ steps: ProcessStep[] }>();
</script>

<template>
  <ol class="ps-steps">
    <template v-for="(step, i) in steps" :key="step.num">
      <li class="ps-step">
        <span class="ps-num">{{ step.num }}</span>
        <span class="ps-name">{{ step.name }}</span>
        <span class="ps-desc">{{ step.desc }}</span>
      </li>
      <li v-if="i < steps.length - 1" class="ps-divider" aria-hidden="true">
        &#8594;
      </li>
    </template>
  </ol>
</template>

<style lang="scss">
.ps-steps {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 991px) {
    flex-direction: column;
    gap: var(--space-4);
  }
}

.ps-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-surface-raised);
  border-radius: 8px;

  @media (max-width: 991px) {
    width: 100%;
  }
}

.ps-num {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  color: var(--color-secondary);
}

.ps-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-on-bg);
}

.ps-desc {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-on-surface-muted);
}

.ps-divider {
  display: flex;
  align-items: center;
  padding-top: var(--space-6);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  list-style: none;

  @media (max-width: 991px) {
    display: none;
  }
}
</style>
