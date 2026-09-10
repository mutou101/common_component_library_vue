<script setup lang="ts">
/**
 * CcInput — standard form field.
 * Design tokens: {text-input}/{text-input-focused}; background canvas,
 * text ink, type {typography.body-md}, radius {rounded.sm}, 1px
 * {colors.hairline-input} border; focus swaps border to primary.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
    name?: string
    disabled?: boolean
    readonly?: boolean
    error?: string
    hint?: string
    /** prefix content inside the field (e.g. currency symbol) */
    prefix?: string
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search'
    min?: number
    max?: number
    step?: number
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    type: 'text',
    name: undefined,
    disabled: false,
    readonly: false,
    error: undefined,
    hint: undefined,
    prefix: undefined,
    autocomplete: undefined,
    inputmode: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}>()

const hasError = computed(() => Boolean(props.error))

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div
    class="cc-input"
    :class="{ 'cc-input--error': hasError, 'cc-input--disabled': disabled }"
  >
    <label
      v-if="label"
      class="cc-input__label"
      :for="name"
    >
      {{ label }}
    </label>

    <div
      class="cc-input__field"
      :class="{ 'cc-input__field--prefix': prefix }"
    >
      <span
        v-if="prefix"
        class="cc-input__prefix tnum"
      >{{ prefix }}</span>
      <input
        :id="name"
        class="cc-input__control tnum"
        :type="type"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :min="min"
        :max="max"
        :step="step"
        :aria-invalid="hasError || undefined"
        @input="onInput"
        @focus="(e) => emit('focus', e)"
        @blur="(e) => emit('blur', e)"
        @change="(e) => emit('change', e)"
      >
    </div>

    <p
      v-if="error"
      class="cc-input__message cc-input__message--error"
    >{{ error }}</p>
    <p
      v-else-if="hint"
      class="cc-input__message"
    >{{ hint }}</p>
  </div>
</template>

<style scoped>
.cc-input {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-xs);
  font-family: var(--cc-font-family);
}

.cc-input__label {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.39px;
  color: var(--cc-ink-secondary);
}

.cc-input__field {
  display: flex;
  align-items: center;
  min-height: var(--cc-input-height);
  background-color: var(--cc-canvas);
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-sm);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.cc-input__field:focus-within {
  border-color: var(--cc-primary);
  box-shadow: var(--cc-focus-ring);
}

.cc-input--error .cc-input__field {
  border-color: var(--cc-error);
}

.cc-input--error .cc-input__field:focus-within {
  box-shadow: 0 0 0 3px rgba(234, 34, 97, 0.15);
}

.cc-input__control {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--cc-ink);
}

.cc-input__control::placeholder {
  color: var(--cc-ink-mute);
  opacity: 0.75;
}

.cc-input__control:disabled {
  cursor: not-allowed;
  background-color: var(--cc-canvas-soft);
  color: var(--cc-ink-mute);
}

.cc-input__prefix {
  padding-left: 12px;
  font-size: 15px;
  font-weight: 300;
  color: var(--cc-ink-mute);
}

.cc-input__field--prefix .cc-input__control {
  padding-left: 6px;
}

.cc-input__message {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--cc-ink-mute);
}

.cc-input__message--error {
  color: var(--cc-error);
}
</style>
