<script setup lang="ts">
import type { M2S2PanelData, DialogAction } from '@m2s2/models';

const props = withDefaults(defineProps<{
  data: M2S2PanelData;
  open: boolean;
}>(), {});

const emit = defineEmits<{
  action: [value: unknown];
  close: [];
}>();

const side = () => props.data.side ?? 'right';

function onAction(action: DialogAction): void {
  emit('action', action.value);
}

function onBackdropClick(): void {
  if (!props.data.modal) emit('close');
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel-overlay-fade">
      <div v-if="open" class="m2s2-panel-overlay" @click.self="onBackdropClick" />
    </Transition>
    <Transition :name="`panel-slide-${side()}`">
      <div
        v-if="open"
        class="m2s2-panel-content"
        :class="`m2s2-panel-content--${side()}`"
        :style="data.width ? { '--panel-width': data.width } : {}"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="'panel-title'"
      >
        <div class="panel-header">
          <div class="panel-header-text">
            <h2 id="panel-title" class="panel-title">{{ data.title }}</h2>
            <p v-if="data.subtitle" class="panel-subtitle">{{ data.subtitle }}</p>
          </div>
          <button v-if="!data.modal" class="panel-close" aria-label="Close" @click="emit('close')">&#x2715;</button>
        </div>

        <div class="panel-body">
          <p v-if="data.message && !$slots.default" class="panel-message">{{ data.message }}</p>
          <slot />
        </div>

        <div v-if="data.actions?.length" class="panel-footer">
          <button
            v-for="action in data.actions"
            :key="action.label"
            class="panel-btn"
            :class="`panel-btn--${action.variant ?? 'secondary'}`"
            @click="onAction(action)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: var(--z-modal, 300);
}

.m2s2-panel-content {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: var(--z-modal, 300);
  width: min(var(--panel-width, 480px), 100vw);
  max-width: 100vw;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--right {
    right: 0;
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  }

  &--left {
    left: 0;
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  }
}

.panel-header      { @include m.overlay-header-stacked; }
.panel-header-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}
.panel-title    { @include m.overlay-title; }
.panel-subtitle { @include m.overlay-subtitle; }
.panel-close    { @include m.btn-icon; }
.panel-body     { @include m.overlay-body; }
.panel-message  { @include m.overlay-message; }
.panel-footer   { @include m.overlay-footer; }

.panel-btn {
  @include m.btn-base;
  &--primary     { @include m.btn-primary; }
  &--secondary   { @include m.btn-secondary; }
  &--destructive { @include m.btn-destructive; }
  &--ghost       { @include m.btn-ghost; }
}

// Overlay fade
.panel-overlay-fade-enter-active,
.panel-overlay-fade-leave-active { transition: opacity 200ms ease; }
.panel-overlay-fade-enter-from,
.panel-overlay-fade-leave-to     { opacity: 0; }

// Right slide
.panel-slide-right-enter-active,
.panel-slide-right-leave-active { transition: transform 220ms ease; }
.panel-slide-right-enter-from,
.panel-slide-right-leave-to     { transform: translateX(100%); }

// Left slide
.panel-slide-left-enter-active,
.panel-slide-left-leave-active { transition: transform 220ms ease; }
.panel-slide-left-enter-from,
.panel-slide-left-leave-to     { transform: translateX(-100%); }
</style>
