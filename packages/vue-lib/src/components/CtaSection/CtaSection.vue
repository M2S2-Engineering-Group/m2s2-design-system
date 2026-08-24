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
@use "packages/tokens/src/components/cta-section";
</style>
