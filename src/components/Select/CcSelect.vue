<script setup lang="ts">
/**
 * CcSelect — styled native select.
 * Same field language as {text-input}: canvas bg, hairline-input border,
 * radius {rounded.sm}, 40px min height; chevron uses the brand indigo.
 */
import { computed } from 'vue'

export interface CcSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options?: CcSelectOption[]
    label?: string
    placeholder?: string
    name?: string
    disabled?: boolean
    error?: string
    hint?: string
  }>(),
  {
    modelValue: '',
    options: () => [],
    label: undefined,
    placeholder: undefined,
    name: undefined,
    disabled: false,
    error: undefined,
    hint: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', event: Event): void
}>()

const hasError = computed(() => Boolean(props.error))

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', event)
}
</script>

<template>
  <div
    class="cc-select"
    :class="{ 'cc-select--error': hasError, 'cc-select--disabled': disabled }"
  >
    <label
      v-if="label"
      class="cc-select__label"
      :for="name"
    >{{ label }}</label>

    <div class="cc-select__wrap">
      <select
        :id="name"
        class="cc-select__control"
        :value="modelValue"
        :name="name"
        :disabled="disabled"
        :aria-invalid="hasError || undefined"
        @change="onChange"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          selected
        >{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="String(opt.value)"
          :value="opt.value"
          :disabled="opt.disabled"
        >{{ opt.label }}</option>
      </select>
      <svg
        class="cc-select__chevron"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <p
      v-if="error"
      class="cc-select__message cc-select__message--error"
    >{{ error }}</p>
    <p
      v-else-if="hint"
      class="cc-select__message"
    >{{ hint }}</p>
  </div>
</template>

<style scoped>
.cc-select {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-xs);
  font-family: var(--cc-font-family);
}

.cc-select__label {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.39px;
  color: var(--cc-ink-secondary);
}

.cc-select__wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.cc-select__control {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-height: var(--cc-input-height);
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-canvas);
  padding: 8px 36px 8px 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--cc-ink);
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.cc-select__control:focus {
  border-color: var(--cc-primary);
  box-shadow: var(--cc-focus-ring);
}

.cc-select__control:disabled {
  cursor: not-allowed;
  background-color: var(--cc-canvas-soft);
  color: var(--cc-ink-mute);
}

.cc-select--error .cc-select__control {
  border-color: var(--cc-error);
}

.cc-select__chevron {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: var(--cc-primary);
}

.cc-select__message {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--cc-ink-mute);
}

.cc-select__message--error {
  color: var(--cc-error);
}
</style>
