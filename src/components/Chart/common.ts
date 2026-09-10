/**
 * Chart 组件共享类型与默认配置。
 * 色板取自 Stripe 风格设计令牌（--cc-primary 等），保证与 DESIGN.md 视觉语言一致。
 */

/** 图表系列数据：name 为系列名，data 为与类目一一对应的数值（null 表示断点）。 */
export interface CcChartSeries {
  name: string
  data: (number | string | null)[]
}

/** 饼图数据项。 */
export interface CcPieDatum {
  name: string
  value: number
}

/** 浅色模式默认色板（Stripe 品牌紫为主）。 */
export const CC_CHART_PALETTE = [
  '#533afd',
  '#635bff',
  '#00d4ff',
  '#00c48a',
  '#f6a609',
  '#ff5c8a',
  '#8a6bff',
  '#22d3ee',
]

/** 深色模式默认色板（亮化版本，适配 dashboard 深色底）。 */
export const CC_CHART_PALETTE_DARK = [
  '#635bff',
  '#00d4ff',
  '#00c48a',
  '#f6a609',
  '#ff5c8a',
  '#a78bfa',
  '#22d3ee',
  '#f472b6',
]

/** 轴标签文字颜色。 */
export const CC_CHART_TEXT_LIGHT = '#5b6472'
export const CC_CHART_TEXT_DARK = '#9aa3b5'

/** 轴线 / 分割线颜色。 */
export const CC_CHART_SPLIT_LIGHT = '#e6e8ef'
export const CC_CHART_SPLIT_DARK = 'rgba(255, 255, 255, 0.09)'

/** 深色模式 tooltip 底色（对应 --cc-brand-dark-900）。 */
export const CC_CHART_TOOLTIP_DARK = 'rgba(28, 30, 84, 0.96)'

/** 深色/浅色模式共用的 tooltip 样式。 */
export function tooltipStyle(dark: boolean): Record<string, unknown> {
  return {
    backgroundColor: dark ? CC_CHART_TOOLTIP_DARK : '#ffffff',
    borderColor: dark ? 'rgba(255, 255, 255, 0.12)' : '#e6e8ef',
    borderWidth: 1,
    padding: [8, 12],
    textStyle: {
      color: dark ? '#f4f5fa' : '#0d253d',
      fontSize: 12,
    },
    extraCssText: 'box-shadow: 0 8px 24px rgba(13, 37, 61, 0.12); border-radius: 10px;',
  }
}

/** 深色/浅色模式共用的图例样式。 */
export function legendStyle(dark: boolean): Record<string, unknown> {
  return {
    show: true,
    top: 0,
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 14,
    textStyle: {
      color: dark ? CC_CHART_TEXT_DARK : CC_CHART_TEXT_LIGHT,
      fontSize: 12,
    },
  }
}

/** 轴线 / 分割线样式。 */
export function axisLineStyle(dark: boolean): Record<string, unknown> {
  return {
    lineStyle: {
      color: dark ? 'rgba(255, 255, 255, 0.14)' : '#e6e8ef',
    },
    axisLabel: {
      color: dark ? CC_CHART_TEXT_DARK : CC_CHART_TEXT_LIGHT,
    },
    splitLine: {
      lineStyle: {
        color: dark ? 'rgba(255, 255, 255, 0.07)' : '#eef0f5',
      },
    },
  }
}
