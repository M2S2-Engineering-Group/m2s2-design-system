<script setup lang="ts">
import { ref, watch, provide, onMounted } from 'vue';
import { THEME_KEY, type Theme } from './useTheme';

const props = withDefaults(defineProps<{
  defaultTheme?: Theme;
}>(), { defaultTheme: 'auto' });

const STORAGE_KEY = 'm2s2-theme';

function readStored(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? props.defaultTheme;
}

function applyTheme(t: Theme) {
  if (t === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', t);
  }
}

const theme = ref<Theme>(props.defaultTheme);

onMounted(() => {
  theme.value = readStored();
});

watch(theme, t => {
  localStorage.setItem(STORAGE_KEY, t);
  applyTheme(t);
}, { immediate: false });

function setTheme(t: Theme) {
  theme.value = t;
}

provide(THEME_KEY, { get theme() { return theme.value; }, setTheme });
</script>

<template>
  <slot />
</template>
