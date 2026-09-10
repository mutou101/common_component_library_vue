/**
 * 多主题系统 — 组件库公开的主题切换 API。
 *
 * 用法（三种方式等效）：
 *   1. 声明式：<CcThemeProvider theme="linear"> <App/> </CcThemeProvider>
 *   2. 命令式：import { setTheme } from 'common_component_library_vue'; setTheme('linear')
 *   3. HTML：  <html data-cc-theme="linear">
 *
 * 主题实际生效于 CSS 选择器 [data-cc-theme="xxx"]，作用于 <html> 根节点，
 * 覆盖 :root 中的默认（Stripe）令牌，切换即时生效、无需刷新。
 */

/** 组件库支持的设计风格。stripe 为默认风格（无需任何主题文件）。 */
export type CcTheme = 'stripe' | 'linear' | 'vercel' | 'notion' | 'raycast'

/** 全部可用主题。 */
export const CC_THEMES: readonly CcTheme[] = ['stripe', 'linear', 'vercel', 'notion', 'raycast']

/** 主题中文标签（演示与选择器展示用），value 保持英文主题名不变。 */
export const CC_THEME_LABELS: Record<CcTheme, string> = {
  stripe: 'Stripe · 经典紫',
  linear: 'Linear · 深色薰衣草',
  vercel: 'Vercel · 黑白极简',
  notion: 'Notion · 纸张笔记',
  raycast: 'Raycast · 暗夜白键',
}

/** <html> 上的主题属性名。 */
export const CC_THEME_ATTR = 'data-cc-theme'

/** inject/provide 当前主题的注入键（可读取响应式主题）。 */
export const CC_THEME_KEY: unique symbol = Symbol('cc-theme')

const DEFAULT_THEME: CcTheme = 'stripe'

/** 校验是否为合法的内置主题名。 */
export function isCcTheme(value: unknown): value is CcTheme {
  return typeof value === 'string' && (CC_THEMES as readonly string[]).includes(value)
}

/**
 * 切换组件库主题。
 * @param theme 目标主题名；传入 'stripe' 或移除主题时恢复默认。
 */
export function setTheme(theme: CcTheme): void {
  if (typeof document === 'undefined') {
    return
  }
  const root = document.documentElement
  if (theme === 'stripe') {
    root.removeAttribute(CC_THEME_ATTR)
    return
  }
  root.setAttribute(CC_THEME_ATTR, theme)
}

/** 读取当前生效的主题名。 */
export function getTheme(): CcTheme {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME
  }
  const current = document.documentElement.getAttribute(CC_THEME_ATTR)
  if (isCcTheme(current)) {
    return current
  }
  return DEFAULT_THEME
}

/** 恢复默认主题（Stripe）。 */
export function resetTheme(): void {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.removeAttribute(CC_THEME_ATTR)
}
