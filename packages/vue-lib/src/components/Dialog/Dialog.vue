<script setup lang="ts">
import type { M2S2DialogData, DialogAction } from '@m2s2/models';

const props = defineProps<{
  data: M2S2DialogData;
  open: boolean;
}>();

const emit = defineEmits<{
  action: [value: unknown];
  close: [];
}>();

function onAction(action: DialogAction): void {
  emit('action', action.value);
}

function onBackdropClick(): void {
  if (!props.data.modal) emit('close');
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && !props.data.modal) emit('close');
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="open"
        class="m2s2-dialog-overlay"
        @click.self="onBackdropClick"
        @keydown="onKeydown"
      >
        <div
          class="m2s2-dialog-content"
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="'dialog-title'"
        >
          <div class="dialog-header">
            <h2
              id="dialog-title"
              class="dialog-title"
            >
              {{ data.title }}
            </h2>
            <button
              v-if="!data.modal"
              class="dialog-close"
              aria-label="Close"
              @click="emit('close')"
            >
              &#x2715;
            </button>
          </div>

          <div class="dialog-body">
            <p
              v-if="data.message"
              class="dialog-message"
            >
              {{ data.message }}
            </p>
            <slot />
          </div>

          <div
            v-if="data.actions.length"
            class="dialog-footer"
          >
            <button
              v-for="action in data.actions"
              :key="action.label"
              class="dialog-btn"
              :class="`dialog-btn--${action.variant ?? 'secondary'}`"
              @click="onAction(action)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: var(--z-modal, 300);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.m2s2-dialog-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: min(480px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  @include m.overlay-header;
}

.dialog-title  { @include m.overlay-title; }
.dialog-close  { @include m.btn-icon; }
.dialog-body   { @include m.overlay-body; }
.dialog-message { @include m.overlay-message; }
.dialog-footer { @include m.overlay-footer; }

.dialog-btn {
  @include m.btn-base;
  &--primary     { @include m.btn-primary; }
  &--secondary   { @include m.btn-secondary; }
  &--destructive { @include m.btn-destructive; }
  &--ghost       { @include m.btn-ghost; }
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 200ms ease;
  .m2s2-dialog-content { transition: transform 200ms ease, opacity 200ms ease; }
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  .m2s2-dialog-content { transform: scale(0.96); opacity: 0; }
}
</style>
