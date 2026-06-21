<script setup lang="ts">
import { computed } from 'vue';
import { STATUS_LABELS, type StatusBadgeVariant } from '@m2s2/models';

const props = withDefaults(defineProps<{
  status: string;
  label?: string;
  variant?: StatusBadgeVariant;
}>(), {
  variant: 'badge',
  label: undefined,
});

const displayLabel = computed(() => props.label ?? STATUS_LABELS[props.status] ?? props.status);
</script>

<template>
  <span
    role="status"
    class="m2s2-status-badge"
    :data-status="status"
    :data-variant="variant"
  >{{ displayLabel }}</span>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-status-badge {
  @include m.status-badge-chrome;

  &[data-variant='pill'] { @include m.status-badge-pill; }

  @include m.status-badge-colors;
}
</style>
