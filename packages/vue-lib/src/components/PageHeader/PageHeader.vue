<script setup lang="ts">
import type { PageHeaderConfig } from "@m2s2/models";

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
@use "packages/tokens/src/components/page-header";

.m2s2-page-header {
  display: block;
  text-align: center;
  margin-bottom: var(--space-12);
}
</style>
