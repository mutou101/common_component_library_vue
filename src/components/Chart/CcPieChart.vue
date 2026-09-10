<script setup lang="ts">
/**
 * CcPieChart — 饼图 / 环形图组件（支持玫瑰图、深浅色模式）。
 * 基于 ECharts 按需引入，样式遵循 Stripe 风格设计令牌。
 */
import { computed, onMounted, ref, watch } from 'vue'
import {
  CC_CHART_PALETTE,
  CC_CHART_PALETTE_DARK,
  legendStyle,
  tooltipStyle,
  type CcPieDatum,
} from './common'
import { useECharts, type ECOption } from './useECharts'

const props = withDefaults(
  defineProps<{
    /** 饼图数据项。 */
    data: CcPieDatum[]
    /** 图表高度（px），默认 320。 */
    height?: number
    /** 环形图（中心挖空）。 */
    donut?: boolean
    /** 玫瑰图（半径随数值变化）。 */
    rose?: boolean
    /** 是否显示图例。 */
    showLegend?: boolean
    /** 是否显示数据标签（默认隐藏，hover 高亮时显示）。 */
    showLabels?: boolean
    /** 自定义色板。 */
    colors?: string[]
    /** 深色模式（适配 dashboard 深色底）。 */
    dark?: boolean
  }>(),
  {
    height: 320,
    donut: false,
    rose: false,
    showLegend: true,
    showLabels: false,
    colors: undefined,
    dark: false,
  },
)

const chartEl = ref<HTMLElement>()
const { setOption } = useECharts(chartEl)

const option = computed<ECOption>(() => {
  const palette = props.colors ?? (props.dark ? CC_CHART_PALETTE_DARK : CC_CHART_PALETTE)
  const legend = props.showLegend ? legendStyle(props.dark) : { show: false }

  return {
    color: palette,
    backgroundColor: 'transparent',
    animationDuration: 600,
    legend: props.showLegend ? { ...legend, bottom: 0, top: undefined } : { show: false },
    tooltip: {
      ...tooltipStyle(props.dark),
      trigger: 'item',
      valueFormatter: (value: unknown) => String(value),
    },
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: props.donut ? ['46%', '70%'] : props.rose ? ['16%', '72%'] : '72%',
        roseType: props.rose ? 'radius' : undefined,
        center: ['50%', props.showLegend ? '44%' : '50%'],
        itemStyle: {
          borderRadius: 5,
          borderColor: props.dark ? '#121430' : '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: props.showLabels,
          color: props.dark ? '#f4f5fa' : '#0d253d',
          fontSize: 12,
          formatter: '{b}\n{d}%',
        },
        labelLine: props.showLabels ? { length: 12, length2: 8 } : undefined,
        emphasis: {
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(13, 37, 61, 0.2)',
          },
        },
        data: props.data,
      },
    ],
  } as ECOption
})

watch(option, (value) => setOption(value), { deep: true })
onMounted(() => setOption(option.value))
</script>

<template>
  <div class="cc-chart cc-chart--pie" :style="{ height: `${height}px` }">
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
