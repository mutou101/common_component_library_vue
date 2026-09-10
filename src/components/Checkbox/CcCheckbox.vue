<script setup lang="ts">
/**
 * CcCheckbox — brand checkbox. Box radius {rounded.xs}, check in indigo.
 */
const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
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
    class="cc-checkbox"
    :class="{ 'cc-checkbox--disabled': disabled }"
  >
    <input
      v-model="model"
      type="checkbox"
      class="cc-checkbox__native"
      :disabled="disabled"
    >
    <span
      class="cc-checkbox__box"
      aria-hidden="true"
    >
      <svg
        class="cc-checkbox__check"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2.5 6.2l2.4 2.4 4.6-5"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span
      v-if="label"
      class="cc-checkbox__label"
    >{{ label }}</span>
    <slot />
  </label>
</template>

<style scoped>
.cc-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--cc-space-sm);
  font-family: var(--cc-font-family);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.cc-checkbox__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cc-checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-xs);
  background-color: var(--cc-canvas);
  color: transparent;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;
}

.cc-checkbox__check {
  stroke: currentColor;
}

.cc-checkbox__native:checked + .cc-checkbox__box {
  background-color: var(--cc-primary);
  border-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

.cc-checkbox__native:focus-visible + .cc-checkbox__box {
  box-shadow: var(--cc-focus-ring);
}

.cc-checkbox__native:indeterminate + .cc-checkbox__box {
  background-color: var(--cc-primary);
  border-color: var(--cc-primary);
}

.cc-checkbox__label {
  font-size: 15px;
  font-weight: 300;
  color: var(--cc-ink);
}

.cc-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
