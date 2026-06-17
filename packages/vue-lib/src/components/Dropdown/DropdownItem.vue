<script setup lang="ts">
import type { AnchorDropdownItem, ClickableDropdownItem, DropdownItem } from '@m2s2/models';

type DropdownItemConfig = DropdownItem & (
  | Pick<AnchorDropdownItem, 'href'>
  | Pick<ClickableDropdownItem, 'onClick'>
  | Record<string, never>
);

const props = defineProps<{ item: DropdownItemConfig }>();
const emit  = defineEmits<{ select: [] }>();

function isAnchor(i: DropdownItemConfig): i is DropdownItem & Pick<AnchorDropdownItem, 'href'> {
  return 'href' in i;
}
function isClickable(i: DropdownItemConfig): i is DropdownItem & Pick<ClickableDropdownItem, 'onClick'> {
  return 'onClick' in i;
}

function handleClick() {
  if (isClickable(props.item)) (props.item as ClickableDropdownItem).onClick();
  emit('select');
}
</script>

<template>
  <li
    class="m2s2-dropdown__item"
    role="none"
  >
    <a
      v-if="isAnchor(item)"
      :href="(item as any).href"
      class="m2s2-dropdown__link"
      role="menuitem"
      target="_blank"
      rel="noopener noreferrer"
      @click="emit('select')"
    >
      <img
        v-if="item.imgSrc"
        :src="item.imgSrc"
        alt=""
        aria-hidden="true"
      >
      {{ item.text }}
    </a>
    <button
      v-else-if="isClickable(item)"
      class="m2s2-dropdown__link"
      role="menuitem"
      @click="handleClick"
    >
      <img
        v-if="item.imgSrc"
        :src="item.imgSrc"
        alt=""
        aria-hidden="true"
      >
      {{ item.text }}
    </button>
    <span
      v-else
      class="m2s2-dropdown__link m2s2-dropdown__link--disabled"
      role="menuitem"
      aria-disabled="true"
    >
      <img
        v-if="item.imgSrc"
        :src="item.imgSrc"
        alt=""
        aria-hidden="true"
      >
      {{ item.text }}
    </span>
  </li>
</template>

<style lang="scss">
.m2s2-dropdown {
  &__item { display: block; }

  &__link {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 16px;
    font-size: 14px;
    color: var(--color-text);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    text-decoration: none;
    transition: background 150ms ease, color 150ms ease;

    &:hover {
      background: var(--color-surface-overlay);
      color: var(--color-secondary);
    }

    &--disabled { opacity: 0.5; cursor: not-allowed; }

    img { width: 20px; height: 20px; object-fit: contain; }
  }
}
</style>
