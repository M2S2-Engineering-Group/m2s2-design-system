<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{
  loading?: boolean;
  loadingText?: string;
}>(), {
  loading: false,
});

const attrs = useAttrs();
</script>

<template>
  <button v-bind="attrs" :disabled="loading || (attrs.disabled as boolean)" :aria-busy="loading">
    <span v-if="loading" class="m2s2-btn-spinner" aria-hidden="true" />
    <slot v-if="!loading || !loadingText" />
    <template v-else>{{ loadingText }}</template>
  </button>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

@include m.btn-spinner-keyframes;

.m2s2-btn-spinner { @include m.btn-spinner; }
</style>
