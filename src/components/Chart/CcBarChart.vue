<script setup lang="ts">
/**
 * CcBarChart — 柱状图组件（支持横向 / 堆叠 / 圆角 / 深浅色模式）。
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
    /** X 轴（或横向时 Y 轴）类目。 */
    categories: string[]
    /** 一个或多个系列数据。 */
    series: CcChartSeries[]
    /** 图表高度（px），默认 320。 */
    height?: number
    /** 横向柱状图（类目在 Y 轴）。 */
    horizontal?: boolean
    /** 多系列堆叠。 */
    stacked?: boolean
    /** 柱顶圆角，默认开启。 */
    rounded?: boolean
    /** 是否显示图例。 */
    showLegend?: boolean
    /** 自定义色板。 */
    colors?: string[]
    /** 深色模式（适配 dashboard 深色底）。 */
    dark?: boolean
  }>(),
  {
    height: 320,
    horizontal: false,
    stacked: false,
    rounded: true,
    showLegend: true,
    colors: undefined,
    dark: false,
  },
)

const chartEl = ref<HTMLElement>()
const { setOption } = useECharts(chartEl)

const option = computed<ECOption>(() => {
  const palette = props.colors ?? (props.dark ? CC_CHART_PALETTE_DARK : CC_CHART_PALETTE)
  const axis = axisLineStyle(props.dark)
  const valueAxis: Record<string, unknown> = {
    ...axis,
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        color: props.dark ? 'rgba(255, 255, 255, 0.07)' : '#eef0f5',
      },
    },
  }
  const categoryAxis: Record<string, unknown> = {
    ...axis,
    type: 'category',
    data: props.categories,
    axisTick: { show: false },
    splitLine: { show: false },
  }

  return {
    color: palette,
    backgroundColor: 'transparent',
    animationDuration: 500,
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
        type: 'shadow',
        shadowStyle: { color: props.dark ? 'rgba(255,255,255,0.04)' : 'rgba(83,58,253,0.05)' },
      },
    },
    xAxis: props.horizontal ? valueAxis : categoryAxis,
    yAxis: props.horizontal ? categoryAxis : valueAxis,
    series: props.series.map((item) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      stack: props.stacked ? 'total' : undefined,
      barMaxWidth: props.horizontal ? 22 : 36,
      itemStyle: {
        borderRadius: props.rounded
          ? props.horizontal
            ? [0, 4, 4, 0]
            : [4, 4, 0, 0]
          : 0,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 8,
          shadowColor: 'rgba(13, 37, 61, 0.18)',
        },
      },
    })),
  } as ECOption
})

watch(option, (value) => setOption(value), { deep: true })
onMounted(() => setOption(option.value))
</script>

<template>
  <div class="cc-chart cc-chart--bar" :style="{ height: `${height}px` }">
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
