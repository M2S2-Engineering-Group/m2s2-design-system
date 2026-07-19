<script setup lang="ts">
import { ref, provide } from "vue";
import type { M2S2DialogData } from "@m2s2/models";
import Dialog from "./Dialog.vue";
import { DIALOG_KEY } from "./useDialog";

interface ActiveDialog {
  data: M2S2DialogData;
  resolve: (value: unknown) => void;
}

const active = ref<ActiveDialog | null>(null);

function dialog(data: M2S2DialogData): Promise<unknown> {
  return new Promise((resolve) => {
    active.value = { data, resolve };
  });
}

function confirm(title: string, message?: string): Promise<boolean> {
  return dialog({
    title,
    message,
    actions: [
      { label: "Cancel", value: false, variant: "secondary" },
      { label: "Confirm", value: true, variant: "primary" },
    ],
  }) as Promise<boolean>;
}

function close(value: unknown) {
  active.value?.resolve(value);
  active.value = null;
}

provide(DIALOG_KEY, { dialog, confirm });
</script>

<template>
  <slot />
  <Dialog
    v-if="active"
    :data="active.data"
    :open="true"
    @action="close"
    @close="close(null)"
  />
</template>
