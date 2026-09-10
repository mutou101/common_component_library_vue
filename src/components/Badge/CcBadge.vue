<script setup lang="ts">
/**
 * CcBadge — numeric count pill (e.g. notification count).
 * Tabular figures for the number — the brand's financial-data signal.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** numeric content; anything else is rendered as-is */
    count?: number | string
    max?: number
    /** soft | solid | dot */
    variant?: 'soft' | 'solid' | 'dot'
    /** render as a standalone dot with no number */
    dot?: boolean
  }>(),
  {
    count: 0,
    max: 99,
    variant: 'soft',
    dot: false,
  },
)

const display = computed(() => {
  if (props.dot) return ''
  const n = Number(props.count)
  if (!Number.isNaN(n)) {
    return n > props.max ? `${props.max}+` : String(n)
  }
  return String(props.count)
})
</script>

<template>
  <span
    class="cc-badge"
    :class="[`cc-badge--${variant}`, { 'cc-badge--dot-only': dot }]"
  ><span class="cc-badge__text tnum">{{ display }}</span></span>
</template>

<style scoped>
.cc-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--cc-radius-pill);
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  vertical-align: middle;
}

.cc-badge--soft {
  background-color: var(--cc-primary-subdued);
  color: var(--cc-primary-deep);
}

.cc-badge--solid {
  background-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

.cc-badge--dot {
  background-color: var(--cc-ruby);
  color: var(--cc-on-primary);
}

.cc-badge--dot-only {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
  background-color: var(--cc-ruby);
}

.cc-badge--dot-only .cc-badge__text {
  display: none;
}
</style>
