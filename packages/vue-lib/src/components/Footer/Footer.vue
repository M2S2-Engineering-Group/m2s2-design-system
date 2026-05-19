<script setup lang="ts">
import type { FooterConfig } from '@m2s2/models';
import SocialIcon from './SocialIcon.vue';

defineProps<{ config: FooterConfig }>();

const year = new Date().getFullYear();
</script>

<template>
  <footer class="m2s2-footer">
    <div class="footer-inner">
      <span class="footer-copy">
        &copy; {{ year }} {{ config.brandName }} &mdash; All Rights Reserved
      </span>
      <nav class="footer-social" aria-label="Social links">
        <a
          v-for="link in config.links"
          :key="link.type"
          :href="link.href"
          class="social-link"
          :title="link.label ?? link.type"
          :aria-label="link.label ?? link.type"
          v-bind="link.type !== 'email' ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
        >
          <SocialIcon :type="link.type" />
        </a>
      </nav>
    </div>
  </footer>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-footer {
  width: 100%;
  min-height: var(--footer-height, 48px);
  background-color: var(--color-nav-bg);
  color: var(--color-on-nav);
  border-top: 2px solid transparent;
  border-image: var(--gradient-brand) 1;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  text-align: center;
  min-height: var(--footer-height, 48px);

  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding: var(--space-2) var(--space-6);
  }
}

.footer-copy {
  font-size: var(--font-size-sm);
  opacity: 0.85;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.social-link { @include m.social-link; }
.social-icon { @include m.social-icon; }
</style>
