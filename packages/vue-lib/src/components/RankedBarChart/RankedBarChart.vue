<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import type { RankedBarItem } from '@m2s2/models';
import { buildRankedBarChartConfig } from '@m2s2/utils';

const props = defineProps<{ data: RankedBarItem[] }>();

const canvasEl = ref<HTMLCanvasElement>();
let chart: Chart | undefined;

function render() {
  if (!canvasEl.value) return;
  chart?.destroy();
  chart = new Chart(canvasEl.value, buildRankedBarChartConfig(props.data));
}

onMounted(render);
watch(() => props.data, render);
onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <div class="m2s2-chart">
    <canvas ref="canvasEl" />
  </div>
</template>

<style lang="scss">
.m2s2-chart {
  position: relative;
  width: 100%;
  height: var(--chart-height, 320px);
}
</style>
