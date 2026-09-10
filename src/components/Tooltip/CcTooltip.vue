<script setup lang="ts">
/**
 * CcTooltip — hover tooltip. Dark navy (brand-dark-900) bubble with
 * white text; placement top | bottom | left | right.
 */
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    /** delay before showing (ms) */
    delay?: number
  }>(),
  {
    content: undefined,
    placement: 'top',
    delay: 0,
  },
)

const show = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const visible = computed(() => show.value)

function onEnter() {
  if (props.delay > 0) {
    timer = setTimeout(() => (show.value = true), props.delay)
  } else {
    show.value = true
  }
}

function onLeave() {
  if (timer) clearTimeout(timer)
  show.value = false
}
</script>

<template>
  <span
    class="cc-tooltip"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onEnter"
    @focusout="onLeave"
  >
    <slot />
    <span
      v-if="visible && (content || $slots.tip)"
      class="cc-tooltip__bubble"
      :class="`cc-tooltip--${placement}`"
      role="tooltip"
    >
      <slot name="tip">{{ content }}</slot>
    </span>
  </span>
</template>

<style scoped>
.cc-tooltip {
  position: relative;
  display: inline-flex;
}

.cc-tooltip__bubble {
  position: absolute;
  z-index: 900;
  max-width: 240px;
  padding: 6px 10px;
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-brand-dark-900);
  color: var(--cc-on-primary);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.24px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--cc-shadow-level-2);
}

.cc-tooltip--top {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}

.cc-tooltip--bottom {
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}

.cc-tooltip--left {
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}

.cc-tooltip--right {
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}

/* Small arrow */
.cc-tooltip__bubble::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: var(--cc-brand-dark-900);
  transform: rotate(45deg);
}

.cc-tooltip--top::after {
  top: 100%;
  left: 50%;
  margin: -3px 0 0 -3px;
}

.cc-tooltip--bottom::after {
  bottom: 100%;
  left: 50%;
  margin: 0 0 -3px -3px;
}

.cc-tooltip--left::after {
  left: 100%;
  top: 50%;
  margin: -3px 0 0 -3px;
}

.cc-tooltip--right::after {
  right: 100%;
  top: 50%;
  margin: -3px -3px 0 0;
}
</style>
