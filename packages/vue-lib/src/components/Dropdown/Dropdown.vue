<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { AnchorDropdownItem, ClickableDropdownItem, DropdownItem } from '@m2s2/models';
import DropdownItemComponent from './DropdownItem.vue';

type DropdownItemConfig = DropdownItem & (
  | Pick<AnchorDropdownItem, 'href'>
  | Pick<ClickableDropdownItem, 'onClick'>
  | Record<string, never>
);

withDefaults(defineProps<{
  items: DropdownItemConfig[];
  align?: 'left' | 'right';
}>(), { align: 'left' });

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function onOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}
function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

onMounted(() => {
  document.addEventListener('mousedown', onOutside);
  document.addEventListener('keydown', onEscape);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', onOutside);
  document.removeEventListener('keydown', onEscape);
});
</script>

<template>
  <div
    ref="root"
    class="m2s2-dropdown"
  >
    <div
      class="m2s2-dropdown__trigger"
      :aria-haspopup="'menu'"
      :aria-expanded="open"
      @click="open = !open"
    >
      <slot />
    </div>

    <ul
      v-if="open"
      :class="['m2s2-dropdown__menu', `m2s2-dropdown__menu--${align}`]"
      role="menu"
    >
      <DropdownItemComponent
        v-for="item in items"
        :key="item.id"
        :item="item"
        @select="open = false"
      />
    </ul>
  </div>
</template>

<style lang="scss">
.m2s2-dropdown {
  position: relative;
  display: inline-block;

  &__trigger { cursor: pointer; }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    z-index: var(--z-dropdown, 200);
    min-width: 160px;
    padding: 4px 0;
    list-style: none;
    margin: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md, 8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

    &--left  { left: 0; }
    &--right { right: 0; }
  }
}
</style>
