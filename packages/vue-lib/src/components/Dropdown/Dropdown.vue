<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import type {
  AnchorDropdownItem,
  ClickableDropdownItem,
  DropdownItem,
} from "@m2s2/models";
import DropdownItemComponent from "./DropdownItem.vue";

type DropdownItemConfig = DropdownItem &
  (
    | Pick<AnchorDropdownItem, "href">
    | Pick<ClickableDropdownItem, "onClick">
    | Record<string, never>
  );

withDefaults(
  defineProps<{
    items: DropdownItemConfig[];
    align?: "left" | "right";
  }>(),
  { align: "left" },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);

function getMenuItems(): HTMLElement[] {
  return Array.from(
    menuEl.value?.querySelectorAll(
      '[role="menuitem"]:not([aria-disabled="true"])',
    ) ?? [],
  ) as HTMLElement[];
}

function openMenu(): void {
  open.value = true;
}

function closeMenu(): void {
  open.value = false;
  triggerEl.value?.focus();
}

// Focus first menu item after menu renders.
watch(open, async (isOpen) => {
  if (!isOpen) return;
  await nextTick();
  getMenuItems()[0]?.focus();
});

function onOutside(e: MouseEvent): void {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}

function onGlobalEscape(e: KeyboardEvent): void {
  if (e.key === "Escape" && open.value) closeMenu();
}

function onTriggerKeyDown(e: KeyboardEvent): void {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    open.value ? closeMenu() : openMenu();
  }
}

function onMenuKeyDown(e: KeyboardEvent): void {
  const items = getMenuItems();
  const idx = items.indexOf(document.activeElement as HTMLElement);

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
      break;
    case "ArrowUp":
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
      break;
    case "Home":
      e.preventDefault();
      items[0]?.focus();
      break;
    case "End":
      e.preventDefault();
      items[items.length - 1]?.focus();
      break;
    case "Tab":
      open.value = false;
      break;
  }
}

document.addEventListener("mousedown", onOutside);
document.addEventListener("keydown", onGlobalEscape);
</script>

<template>
  <div ref="root" class="m2s2-dropdown">
    <div
      ref="triggerEl"
      class="m2s2-dropdown__trigger"
      tabindex="0"
      role="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onTriggerKeyDown"
    >
      <slot />
    </div>

    <ul
      v-if="open"
      ref="menuEl"
      :class="['m2s2-dropdown__menu', `m2s2-dropdown__menu--${align}`]"
      role="menu"
      @keydown="onMenuKeyDown"
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

  &__trigger {
    cursor: pointer;
  }

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

    &--left {
      left: 0;
    }
    &--right {
      right: 0;
    }
  }
}
</style>
