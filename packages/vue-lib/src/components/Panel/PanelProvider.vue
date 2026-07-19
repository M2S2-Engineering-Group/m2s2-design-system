<script setup lang="ts">
import { ref, provide } from "vue";
import type { M2S2PanelData } from "@m2s2/models";
import Panel from "./Panel.vue";
import { PANEL_KEY } from "./usePanel";

interface ActivePanel {
  data: M2S2PanelData;
  resolve: (value: unknown) => void;
}

const active = ref<ActivePanel | null>(null);

function panel(data: M2S2PanelData): Promise<unknown> {
  return new Promise((resolve) => {
    active.value = { data, resolve };
  });
}

function close(value: unknown) {
  active.value?.resolve(value);
  active.value = null;
}

provide(PANEL_KEY, { panel });
</script>

<template>
  <slot />
  <Panel
    v-if="active"
    :data="active.data"
    :open="true"
    @action="close"
    @close="close(null)"
  />
</template>
