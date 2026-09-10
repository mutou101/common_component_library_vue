<script setup lang="ts">
/**
 * CcTextarea — multi-line form field, same geometry language as CcInput.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    name?: string
    rows?: number
    disabled?: boolean
    readonly?: boolean
    error?: string
    hint?: string
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    name: undefined,
    rows: 4,
    disabled: false,
    readonly: false,
    error: undefined,
    hint: undefined,
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const hasError = computed(() => Boolean(props.error))

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div
    class="cc-textarea"
    :class="{ 'cc-textarea--error': hasError, 'cc-textarea--disabled': disabled }"
  >
    <label
      v-if="label"
      class="cc-textarea__label"
      :for="name"
    >{{ label }}</label>

    <textarea
      :id="name"
      class="cc-textarea__control"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :aria-invalid="hasError || undefined"
      @input="onInput"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)"
    />

    <p
      v-if="error"
      class="cc-textarea__message cc-textarea__message--error"
    >{{ error }}</p>
    <p
      v-else-if="hint"
      class="cc-textarea__message"
    >{{ hint }}</p>
  </div>
</template>

<style scoped>
.cc-textarea {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-xs);
  font-family: var(--cc-font-family);
}

.cc-textarea__label {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.39px;
  color: var(--cc-ink-secondary);
}

.cc-textarea__control {
  resize: vertical;
  min-height: 96px;
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-canvas);
  padding: 8px 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--cc-ink);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.cc-textarea__control::placeholder {
  color: var(--cc-ink-mute);
  opacity: 0.75;
}

.cc-textarea__control:focus {
  border-color: var(--cc-primary);
  box-shadow: var(--cc-focus-ring);
}

.cc-textarea--error .cc-textarea__control {
  border-color: var(--cc-error);
}

.cc-textarea__control:disabled {
  cursor: not-allowed;
  background-color: var(--cc-canvas-soft);
  color: var(--cc-ink-mute);
}

.cc-textarea__message {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--cc-ink-mute);
}

.cc-textarea__message--error {
  color: var(--cc-error);
}
</style>
