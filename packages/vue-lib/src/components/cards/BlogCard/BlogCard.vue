<script setup lang="ts">
import type { BlogCardConfig } from '@m2s2/models';
import { formatBlogDate } from '@m2s2/utils';

defineProps<{ config: BlogCardConfig }>();
</script>

<template>
  <div class="m2s2-blog-card">
    <div class="bc-cover">
      <img
        v-if="config.coverImage"
        :src="config.coverImage"
        :alt="config.title"
        class="bc-cover-img"
        loading="lazy"
      >
      <div
        v-else
        class="bc-cover-placeholder"
      >
        <span class="bc-cover-tag">{{ config.tags[0] }}</span>
      </div>
    </div>
    <div class="bc-inner">
      <div class="bc-meta">
        <time :dateTime="config.date">{{ formatBlogDate(config.date) }}</time>
        <span
          v-if="config.readingTime"
          class="bc-reading-time"
        >{{ config.readingTime }} min read</span>
      </div>
      <h2 class="bc-title">
        <a :href="`/blog/${config.slug}`">{{ config.title }}</a>
      </h2>
      <p class="bc-summary">
        {{ config.summary }}
      </p>
      <div class="bc-tags">
        <span
          v-for="tag in config.tags"
          :key="tag"
          class="bc-tag"
        >{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-blog-card {
  @include m.card-surface;
  padding: 0;
  overflow: hidden;
}

.bc-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-surface-raised);
  flex-shrink: 0;
}

.bc-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bc-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bc-cover-tag {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-on-surface-muted);
}

.bc-inner {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.bc-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-muted);
}

.bc-reading-time { opacity: 0.8; }

.bc-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-on-bg);
  margin: 0;
  line-height: 1.3;

  a {
    color: inherit;
    text-decoration: none;
    &:hover { color: var(--color-secondary); }
  }
}

.bc-summary {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.bc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.bc-tag {
  font-size: var(--font-size-xs);
  padding: 2px var(--space-2);
  border-radius: 4px;
  background: var(--color-surface-raised);
  color: var(--color-on-surface-muted);
  border: 1px solid var(--color-border);
}
</style>
