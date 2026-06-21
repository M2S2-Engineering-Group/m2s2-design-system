<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { ChatMessage } from '@m2s2/models';

const props = withDefaults(defineProps<{
  sendMessage:         (messages: ChatMessage[]) => Promise<string>;
  title?:              string;
  subtitle?:           string;
  placeholder?:        string;
  maxMessages?:        number;
  ctaLabel?:           string;
  ctaUrl?:             string;
  userAvatarUrl?:      string;
  assistantAvatarUrl?: string;
}>(), {
  title:       'Architecture Advisor',
  subtitle:    'Ask anything about software architecture, cloud design, or engineering decisions.',
  placeholder: 'Ask a question...',
  maxMessages: 6,
  ctaLabel:         'Start a Conversation',
  ctaUrl:           '/contact',
  userAvatarUrl:    undefined,
  assistantAvatarUrl: undefined,
});

type SendState = 'idle' | 'sending' | 'error';

const open      = ref(false);
const messages  = ref<ChatMessage[]>([]);
const sendState = ref<SendState>('idle');
const draft     = ref('');
const listEl    = ref<HTMLElement | null>(null);

const userCount    = computed(() => messages.value.filter(m => m.role === 'user').length);
const limitReached = computed(() => userCount.value >= props.maxMessages);

async function scrollToBottom() {
  await nextTick();
  if (listEl.value) {
    listEl.value.scrollTop = listEl.value.scrollHeight;
  }
}

async function submit() {
  const text = draft.value.trim();
  if (!text || sendState.value === 'sending' || limitReached.value) return;

  draft.value = '';
  const updated: ChatMessage[] = [...messages.value, { role: 'user', content: text }];
  messages.value = updated;
  sendState.value = 'sending';
  await scrollToBottom();

  try {
    const reply = await props.sendMessage(updated);
    messages.value = [...messages.value, { role: 'assistant', content: reply }];
    sendState.value = 'idle';
    await scrollToBottom();
  } catch {
    sendState.value = 'error';
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
}
</script>

<template>
  <div class="m2s2-chat">
    <!-- Toggle -->
    <button
      class="chat-toggle"
      :aria-label="open ? 'Close chat' : 'Open chat'"
      @click="open = !open"
    >
      <svg
        v-if="open"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 5L5 15M5 5l10 10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <svg
        v-else
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Panel -->
    <div
      v-if="open"
      class="chat-panel"
      role="dialog"
      :aria-label="title"
    >
      <div class="chat-header">
        <img
          v-if="assistantAvatarUrl"
          class="chat-header__avatar"
          :src="assistantAvatarUrl"
          alt=""
          aria-hidden="true"
        >
        <div class="chat-header__text">
          <p class="chat-header__title">
            {{ title }}
          </p>
          <p
            v-if="messages.length === 0"
            class="chat-header__subtitle"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div
        ref="listEl"
        class="chat-messages"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        <p
          v-if="messages.length === 0"
          class="chat-empty"
        >
          Send a message to get started.
        </p>

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="chat-message"
          :class="`chat-message--${msg.role}`"
        >
          <span
            v-if="msg.role === 'assistant'"
            class="chat-avatar chat-avatar--assistant"
          >
            <img
              v-if="assistantAvatarUrl"
              :src="assistantAvatarUrl"
              alt=""
              aria-hidden="true"
            >
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <p class="chat-message__text">
            {{ msg.content }}
          </p>
          <span
            v-if="msg.role === 'user'"
            class="chat-avatar chat-avatar--user"
          >
            <img
              v-if="userAvatarUrl"
              :src="userAvatarUrl"
              alt=""
              aria-hidden="true"
            >
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </div>

        <div
          v-if="sendState === 'sending'"
          class="chat-message chat-message--assistant"
        >
          <span class="chat-avatar chat-avatar--assistant">
            <img
              v-if="assistantAvatarUrl"
              :src="assistantAvatarUrl"
              alt=""
              aria-hidden="true"
            >
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="chat-typing" aria-label="Assistant is typing">
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </span>
        </div>
      </div>

      <div
        v-if="limitReached"
        class="chat-cta"
      >
        <p class="chat-cta__text">
          Ready to go deeper? Let's talk through your specific situation.
        </p>
        <a
          class="chat-cta__btn"
          :href="ctaUrl"
        >{{ ctaLabel }}</a>
      </div>

      <template v-if="!limitReached">
        <div class="chat-input-row">
          <textarea
            v-model="draft"
            class="chat-input"
            :rows="1"
            :placeholder="placeholder"
            :disabled="sendState === 'sending'"
            @keydown="onKeydown"
          />
          <button
            class="chat-send"
            :disabled="!draft.trim() || sendState === 'sending'"
            aria-label="Send"
            @click="submit"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <p
          v-if="sendState === 'error'"
          role="alert"
          class="chat-error"
        >
          Something went wrong — please try again.
        </p>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.m2s2-chat {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
  pointer-events: none;

  > * { pointer-events: all; }
}

.chat-toggle {
  @include m.btn-primary;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  padding: 0;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  width: 380px;
  max-height: 520px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - var(--space-8));
    max-height: 70vh;
  }
}

.chat-header {
  @include m.overlay-header;
  background: var(--color-surface-raised);
  gap: var(--space-3);
}

.chat-header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.chat-header__title {
  @include m.overlay-title;
  font-size: var(--font-size-base);
  margin: 0;
}

.chat-header__subtitle {
  @include m.overlay-subtitle;
  margin: var(--space-1) 0 0;
  font-size: var(--font-size-xs);
}

.chat-messages {
  @include m.overlay-body;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.chat-empty {
  @include m.overlay-message;
  text-align: center;
  padding: var(--space-6) 0;
  margin: 0;
}

.chat-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  align-self: flex-end;

  img { width: 100%; height: 100%; object-fit: cover; }

  &--assistant {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    color: var(--color-on-surface-muted);
  }

  &--user {
    background: var(--color-primary-dim, var(--color-primary));
    color: #fff;
  }
}

.chat-message {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  max-width: 90%;

  &--user {
    align-self: flex-end;

    .chat-message__text {
      background: var(--gradient-brand-135);
      color: #fff;
      border-radius: var(--radius-md) var(--radius-md) 2px var(--radius-md);
    }
  }

  &--assistant {
    align-self: flex-start;

    .chat-message__text {
      background: var(--color-surface-raised);
      color: var(--color-on-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 2px;
    }
  }
}

.chat-message__text {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 2px;

  span {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-on-surface-muted);
    animation: chat-bounce 1.2s infinite ease-in-out;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes chat-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%            { transform: translateY(-5px); opacity: 1; }
}

.chat-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-raised);
  text-align: center;
}

.chat-cta__text {
  @include m.overlay-message;
  font-size: var(--font-size-xs);
  margin: 0;
}

.chat-cta__btn {
  @include m.btn-primary;
  font-size: var(--font-size-xs);
  padding: var(--space-2) var(--space-5);
  text-decoration: none;
}

.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.chat-input {
  @include m.form-input;
  resize: none;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.5;
  padding: var(--space-2) var(--space-3);
}

.chat-send {
  @include m.btn-icon(36px);
  background: var(--gradient-brand-135);
  color: #fff;
  border-radius: var(--radius-md);
  flex-shrink: 0;

  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.chat-error {
  @include m.feedback-text;
  @include m.feedback-error;
  padding: 0 var(--space-4) var(--space-2);
  margin: 0;
}
</style>
