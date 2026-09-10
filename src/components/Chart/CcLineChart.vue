<script setup lang="ts">
/**
 * CcLineChart — 曲线图组件（支持平滑曲线 / 面积填充 / 多系列 / 深浅色模式）。
 * 基于 ECharts 按需引入，样式遵循 Stripe 风格设计令牌。
 */
import { computed, onMounted, ref, watch } from 'vue'
import {
  CC_CHART_PALETTE,
  CC_CHART_PALETTE_DARK,
  axisLineStyle,
  legendStyle,
  tooltipStyle,
  type CcChartSeries,
} from './common'
import { useECharts, type ECOption } from './useECharts'

const props = withDefaults(
  defineProps<{
    /** X 轴类目。 */
    categories: string[]
    /** 一个或多个系列数据。 */
    series: CcChartSeries[]
    /** 图表高度（px），默认 320。 */
    height?: number
    /** 平滑曲线，默认开启。 */
    smooth?: boolean
    /** 面积填充。 */
    area?: boolean
    /** 是否显示数据点。 */
    showDots?: boolean
    /** 是否显示图例。 */
    showLegend?: boolean
    /** 是否显示网格分割线。 */
    showGrid?: boolean
    /** 自定义色板。 */
    colors?: string[]
    /** 深色模式（适配 dashboard 深色底）。 */
    dark?: boolean
  }>(),
  {
    height: 320,
    smooth: true,
    area: false,
    showDots: false,
    showLegend: true,
    showGrid: true,
    colors: undefined,
    dark: false,
  },
)

const chartEl = ref<HTMLElement>()
const { setOption } = useECharts(chartEl)

const option = computed<ECOption>(() => {
  const palette = props.colors ?? (props.dark ? CC_CHART_PALETTE_DARK : CC_CHART_PALETTE)
  const axis = axisLineStyle(props.dark)

  return {
    color: palette,
    backgroundColor: 'transparent',
    animationDuration: 600,
    grid: {
      left: 8,
      right: 12,
      top: props.showLegend ? 38 : 14,
      bottom: 6,
      containLabel: true,
    },
    legend: props.showLegend ? legendStyle(props.dark) : { show: false },
    tooltip: {
      ...tooltipStyle(props.dark),
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: props.dark ? 'rgba(255,255,255,0.2)' : 'rgba(13,37,61,0.18)',
          type: 'dashed',
        },
      },
    },
    xAxis: {
      ...axis,
      type: 'category',
      boundaryGap: false,
      data: props.categories,
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      ...axis,
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: props.showGrid,
        lineStyle: {
          color: props.dark ? 'rgba(255, 255, 255, 0.07)' : '#eef0f5',
        },
      },
    },
    series: props.series.map((item) => ({
      name: item.name,
      type: 'line',
      data: item.data,
      smooth: props.smooth,
      showSymbol: props.showDots,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2.5,
      },
      areaStyle: props.area
        ? {
            opacity: 0.08,
          }
        : undefined,
      emphasis: {
        focus: 'series',
        lineStyle: { width: 3 },
      },
    })),
  } as ECOption
})

watch(option, (value) => setOption(value), { deep: true })
onMounted(() => setOption(option.value))
</script>

<template>
  <div class="cc-chart cc-chart--line" :style="{ height: `${height}px` }">
    <div ref="chartEl" class="cc-chart__canvas" />
  </div>
</template>

<style scoped>
.cc-chart {
  width: 100%;
  min-width: 0;
}

.cc-chart__canvas {
  width: 100%;
  height: 100%;
}
</style>
