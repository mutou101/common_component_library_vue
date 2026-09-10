<script setup lang="ts">
/**
 * CcSwitch — pill toggle. Track follows the brand pill geometry;
 * checked state fills with the indigo primary.
 */
const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    label: undefined,
    disabled: false,
    size: 'md',
  },
)

function toggle() {
  if (!props.disabled) model.value = !model.value
}
</script>

<template>
  <button
    type="button"
    class="cc-switch"
    :class="[
      `cc-switch--${size}`,
      { 'cc-switch--checked': model, 'cc-switch--disabled': disabled },
    ]"
    role="switch"
    :aria-checked="model"
    :aria-label="label || 'switch'"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="cc-switch__track">
      <span class="cc-switch__knob" />
    </span>
    <span
      v-if="label"
      class="cc-switch__label"
    >{{ label }}</span>
  </button>
</template>

<style scoped>
.cc-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--cc-space-sm);
  border: 0;
  background: transparent;
  padding: 0;
  font-family: var(--cc-font-family);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.cc-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 40px;
  height: 22px;
  border-radius: var(--cc-radius-pill);
  background-color: var(--cc-hairline);
  border: 1px solid var(--cc-hairline-input);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  flex-shrink: 0;
  box-sizing: border-box;
}

.cc-switch--checked .cc-switch__track {
  background-color: var(--cc-primary);
  border-color: var(--cc-primary);
}

.cc-switch--sm .cc-switch__track {
  width: 32px;
  height: 18px;
}

.cc-switch__knob {
  width: 16px;
  height: 16px;
  border-radius: var(--cc-radius-pill);
  background-color: var(--cc-canvas);
  box-shadow: rgba(0, 55, 112, 0.2) 0 1px 2px;
  margin-left: 2px;
  transition: transform 0.2s ease;
}

.cc-switch--sm .cc-switch__knob {
  width: 12px;
  height: 12px;
}

.cc-switch--checked .cc-switch__knob {
  transform: translateX(18px);
}

.cc-switch--sm.cc-switch--checked .cc-switch__knob {
  transform: translateX(14px);
}

.cc-switch__label {
  font-size: 15px;
  font-weight: 300;
  color: var(--cc-ink);
}

.cc-switch:focus-visible {
  outline: none;
}

.cc-switch:focus-visible .cc-switch__track {
  box-shadow: var(--cc-focus-ring);
}

.cc-switch--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
