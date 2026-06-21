<script setup lang="ts">
import { ref, computed } from 'vue';
import { validateEmail } from '@m2s2/utils';

type SubmitState = 'idle' | 'submitting' | 'done' | 'error';
type Mode = 'anon' | 'auth';

const props = withDefaults(defineProps<{
  mode?: Mode;
  subscribeAnon?: (email: string, name: string) => Promise<unknown>;
  subscribeAuth?: () => Promise<unknown>;
  unsubscribeAuth?: () => Promise<unknown>;
}>(), {
  mode: 'anon',
  subscribeAnon: undefined,
  subscribeAuth: undefined,
  unsubscribeAuth: undefined,
});

const email = ref('');
const name = ref('');
const state = ref<SubmitState>('idle');
const subscribed = ref(false);

const emailValid = computed(() => validateEmail(email.value));

async function submit(): Promise<void> {
  if (state.value === 'submitting') return;

  if (props.mode === 'auth') {
    if (subscribed.value) {
      if (!props.unsubscribeAuth) return;
      state.value = 'submitting';
      try {
        await props.unsubscribeAuth();
        subscribed.value = false;
        state.value = 'idle';
      } catch {
        state.value = 'error';
      }
    } else {
      if (!props.subscribeAuth) return;
      state.value = 'submitting';
      try {
        await props.subscribeAuth();
        subscribed.value = true;
        state.value = 'done';
      } catch {
        state.value = 'error';
      }
    }
  } else {
    if (!emailValid.value || !props.subscribeAnon) return;
    state.value = 'submitting';
    try {
      await props.subscribeAnon(email.value.trim(), name.value.trim());
      state.value = 'done';
    } catch {
      state.value = 'error';
    }
  }
}
</script>

<template>
  <!-- Anonymous mode -->
  <template v-if="mode === 'anon'">
    <div
      v-if="state !== 'done'"
      class="sub-form"
    >
      <input
        v-model="name"
        class="sub-input"
        type="text"
        placeholder="Your name (optional)"
        aria-label="Your name (optional)"
        :disabled="state === 'submitting'"
      >
      <input
        v-model="email"
        class="sub-input"
        type="email"
        placeholder="your@email.com"
        aria-label="Email address"
        :disabled="state === 'submitting'"
      >
      <button
        class="sub-btn"
        :disabled="!emailValid || state === 'submitting'"
        @click="submit"
      >
        {{ state === 'submitting' ? 'Submitting…' : 'Subscribe' }}
      </button>
      <p
        v-if="state === 'error'"
        role="alert"
        class="sub-feedback sub-feedback--error"
      >
        Something went wrong — please try again.
      </p>
    </div>
    <div
      v-else
      role="status"
      class="sub-success"
    >
      <span class="sub-success-icon" aria-hidden="true">✓</span>
      <p class="sub-success-text">
        Check your email to confirm your subscription.
      </p>
    </div>
  </template>

  <!-- Auth mode -->
  <div
    v-else
    class="sub-auth"
  >
    <template v-if="!subscribed">
      <button
        class="sub-btn"
        :disabled="state === 'submitting'"
        @click="submit"
      >
        {{ state === 'submitting' ? 'Subscribing…' : 'Subscribe to Blog Updates' }}
      </button>
      <p
        v-if="state === 'done'"
        role="status"
        class="sub-feedback sub-feedback--success"
      >
        You're subscribed!
      </p>
    </template>
    <template v-else>
      <span class="sub-subscribed-label">✓ Subscribed to blog updates</span>
      <button
        class="sub-btn sub-btn--unsub"
        :disabled="state === 'submitting'"
        @click="submit"
      >
        {{ state === 'submitting' ? 'Unsubscribing…' : 'Unsubscribe' }}
      </button>
    </template>
    <p
      v-if="state === 'error'"
      role="alert"
      class="sub-feedback sub-feedback--error"
    >
      Something went wrong — please try again.
    </p>
  </div>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.sub-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.sub-input { @include m.form-input; }

.sub-btn {
  @include m.btn-primary;
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-semibold);

  &--unsub { @include m.btn-muted; }
}

.sub-feedback {
  @include m.feedback-text;
  &--error   { @include m.feedback-error; }
  &--success { @include m.feedback-success; }
}

.sub-success {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sub-success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-success-bg);
  color: var(--color-success);
  font-size: var(--font-size-base);
  flex-shrink: 0;
}

.sub-success-text {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  margin: 0;
}

.sub-auth {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.sub-subscribed-label {
  font-size: var(--font-size-sm);
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}
</style>
