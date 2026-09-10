<script setup lang="ts">
/**
 * CcThemeProvider — 声明式主题容器组件。
 *
 * 用法：
 *   <CcThemeProvider theme="linear" persist>
 *     <App />
 *   </CcThemeProvider>
 *
 * - 挂载时把主题写入 <html data-cc-theme>，theme 变化时即时切换；
 * - persist 开启时优先读取 localStorage 中保存的主题，切换后自动持久化；
 * - 自身不渲染任何 DOM，仅包裹子内容。
 */
import { onMounted, provide, ref, watch } from 'vue'
import { CC_THEME_KEY, isCcTheme, setTheme, type CcTheme } from '../../theme'

const props = withDefaults(
  defineProps<{
    /** 目标主题名，默认 stripe。 */
    theme?: CcTheme
    /** 是否把主题持久化到 localStorage（key: cc-library-theme）。 */
    persist?: boolean
  }>(),
  {
    theme: 'stripe',
    persist: false,
  },
)

const emit = defineEmits<{
  (event: 'change', theme: CcTheme): void
}>()

/** 当前主题（响应式），可通过 inject(CC_THEME_KEY) 读取。 */
const current = ref<CcTheme>(props.theme)
provide(CC_THEME_KEY, current)

/** 读取持久化主题（persist 开启时优先）。 */
function resolveInitialTheme(): CcTheme {
  if (!props.persist) {
    return props.theme
  }
  try {
    const saved = localStorage.getItem('cc-library-theme')
    if (isCcTheme(saved)) {
      return saved
    }
  } catch {
    // localStorage 不可用时忽略。
  }
  return props.theme
}

function applyTheme(theme: CcTheme): void {
  current.value = theme
  setTheme(theme)
  if (props.persist) {
    try {
      localStorage.setItem('cc-library-theme', theme)
    } catch {
      // 持久化失败不影响切换。
    }
  }
  emit('change', theme)
}

onMounted(() => {
  applyTheme(resolveInitialTheme())
})

watch(
  () => props.theme,
  (value) => {
    if (isCcTheme(value)) {
      applyTheme(value)
    }
  },
)
</script>

<template>
  <slot />
</template>
