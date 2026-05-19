<script setup lang="ts">
import type { CardVariant } from '@m2s2/models';

withDefaults(defineProps<{
  featured?: boolean;
  variant?: CardVariant;
}>(), {
  featured: false,
  variant: 'default',
});
</script>

<template>
  <div
    class="m2s2-card"
    :class="{ featured }"
    :data-variant="variant"
  >
    <slot />
  </div>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-card {
  @include m.card-surface;
  padding: var(--space-8) var(--space-10);

  @media (max-width: 767px) { padding: var(--space-6) var(--space-5); }

  &.featured              { @include m.card-featured; }
  &[data-variant='raised'] { @include m.card-raised; }
  &[data-variant='accent'] { @include m.card-accent; }
}
</style>
