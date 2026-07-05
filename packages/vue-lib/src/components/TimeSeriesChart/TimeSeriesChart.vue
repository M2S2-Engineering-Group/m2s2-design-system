<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import type { TimeSeriesPoint } from '@m2s2/models';
import { buildTimeSeriesChartConfig } from '@m2s2/utils';

const props = withDefaults(
  defineProps<{ data: TimeSeriesPoint[]; type?: 'line' | 'bar' }>(),
  { type: 'line' },
);

const canvasEl = ref<HTMLCanvasElement>();
let chart: Chart | undefined;

function render() {
  if (!canvasEl.value) return;
  chart?.destroy();
  chart = new Chart(canvasEl.value, buildTimeSeriesChartConfig(props.data, props.type));
}

onMounted(render);
watch(() => [props.data, props.type], render);
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
