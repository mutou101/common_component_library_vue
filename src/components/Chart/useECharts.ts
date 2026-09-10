/**
 * useECharts — 图表组件共享的 ECharts 生命周期封装。
 * 按需注册 Bar / Line / Pie 三类图表与必要组件，控制打包体积。
 */
import { onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
])

/** 当前组件库用到的 ECharts 配置类型组合。 */
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
>

/**
 * 初始化图表并处理尺寸自适应与销毁。
 * 用法：const chartEl = ref<HTMLElement>()；const { setOption } = useECharts(chartEl)。
 */
export function useECharts(containerRef: Ref<HTMLElement | undefined>) {
  const chart = shallowRef<echarts.ECharts | undefined>(undefined)
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!containerRef.value) {
      return
    }
    chart.value = echarts.init(containerRef.value)
    observer = new ResizeObserver(() => {
      chart.value?.resize()
    })
    observer.observe(containerRef.value)
  })

  /** 合并更新图表配置（notMerge 保证配置变化时完全重绘）。 */
  function setOption(option: ECOption) {
    if (chart.value) {
      chart.value.setOption(option, { notMerge: true })
    }
  }

  onBeforeUnmount(() => {
    observer?.disconnect()
    chart.value?.dispose()
    chart.value = undefined
  })

  return { chart, setOption }
}
