<script setup lang="ts">
/**
 * CcRadio — radio option. Pairs with a shared v-model to form a group
 * (native radio semantics). Dot fills with indigo when selected.
 */
const model = defineModel<string | number>({ default: '' })

withDefaults(
  defineProps<{
    /** the value this option represents */
    value: string | number
    label?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    disabled: false,
  },
)
</script>

<template>
  <label
    class="cc-radio"
    :class="{ 'cc-radio--disabled': disabled }"
  >
    <input
      v-model="model"
      type="radio"
      class="cc-radio__native"
      :value="value"
      :disabled="disabled"
    >
    <span
      class="cc-radio__dot"
      aria-hidden="true"
    />
    <span
      v-if="label"
      class="cc-radio__label"
    >{{ label }}</span>
    <slot />
  </label>
</template>

<style scoped>
.cc-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--cc-space-sm);
  font-family: var(--cc-font-family);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.cc-radio__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cc-radio__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-pill);
  background-color: var(--cc-canvas);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  flex-shrink: 0;
}

.cc-radio__dot::after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: var(--cc-radius-pill);
  background-color: var(--cc-primary);
  transform: scale(0);
  transition: transform 0.15s ease;
}

.cc-radio__native:checked + .cc-radio__dot {
  border-color: var(--cc-primary);
}

.cc-radio__native:checked + .cc-radio__dot::after {
  transform: scale(1);
}

.cc-radio__native:focus-visible + .cc-radio__dot {
  box-shadow: var(--cc-focus-ring);
}

.cc-radio__label {
  font-size: 15px;
  font-weight: 300;
  color: var(--cc-ink);
}

.cc-radio--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
