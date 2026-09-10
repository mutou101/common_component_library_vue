<script setup lang="ts">
/**
 * CcButton — pill button, the brand's dominant CTA system.
 * Design tokens: {button-primary-pill}, {button-primary-pill-pressed},
 * {button-secondary}, {button-on-dark}; type {typography.button-md|sm};
 * geometry {rounded.pill} with tight 8px 16px padding.
 */
import { computed } from 'vue'
import CcSpinner from '../Spinner/CcSpinner.vue'

type Variant = 'primary' | 'secondary' | 'on-dark' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** primary = filled indigo · secondary = indigo outline · on-dark = navy fill · ghost = quiet · link = inline */
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    /** render as <a> with href */
    href?: string
    target?: string
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** native aria-label override */
    ariaLabel?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    href: undefined,
    target: undefined,
    block: false,
    type: 'button',
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const spinnerColor = computed(() =>
  props.variant === 'primary' || props.variant === 'on-dark'
    ? 'var(--cc-on-primary)'
    : 'var(--cc-primary)',
)

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="cc-btn"
    :class="[
      `cc-btn--${variant}`,
      `cc-btn--${size}`,
      { 'cc-btn--block': block, 'cc-btn--loading': loading },
    ]"
    :href="href || undefined"
    :target="href ? target : undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="cc-btn__spinner"
    >
      <CcSpinner :size="size === 'sm' ? 14 : 16" :color="spinnerColor" />
    </span>
    <span class="cc-btn__content">
      <slot />
    </span>
  </component>
</template>

<style scoped>
.cc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--cc-space-sm);
  border: 0;
  border-radius: var(--cc-radius-pill);
  padding: 8px 16px; /* tight pill — the transactional signature */
  font-family: var(--cc-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.05s ease;
  -webkit-tap-highlight-color: transparent;
}

.cc-btn:focus-visible {
  outline: none;
  box-shadow: var(--cc-focus-ring);
}

.cc-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

/* ---- Variants ---- */
.cc-btn--primary {
  background-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

.cc-btn--primary:hover:not(:disabled) {
  background-color: var(--cc-primary-deep);
}

.cc-btn--primary:active:not(:disabled) {
  background-color: var(--cc-primary-press);
}

.cc-btn--secondary {
  background-color: var(--cc-canvas);
  color: var(--cc-primary);
  border: 1px solid var(--cc-primary);
  padding: 7px 15px; /* 1px border compensation keeps 8x16 geometry */
}

.cc-btn--secondary:hover:not(:disabled) {
  background-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

.cc-btn--secondary:active:not(:disabled) {
  background-color: var(--cc-primary-press);
  border-color: var(--cc-primary-press);
}

.cc-btn--on-dark {
  background-color: var(--cc-brand-dark-900);
  color: var(--cc-on-primary);
}

.cc-btn--on-dark:hover:not(:disabled) {
  background-color: #252866;
}

.cc-btn--on-dark:active:not(:disabled) {
  background-color: #13153f;
}

.cc-btn--ghost {
  background-color: transparent;
  color: var(--cc-ink);
}

.cc-btn--ghost:hover:not(:disabled) {
  background-color: var(--cc-canvas-soft);
  color: var(--cc-ink);
}

.cc-btn--ghost:active:not(:disabled) {
  background-color: var(--cc-hairline);
}

.cc-btn--link {
  background-color: transparent;
  color: var(--cc-primary);
  padding: 2px 4px;
}

.cc-btn--link:hover:not(:disabled) {
  text-decoration: underline;
}

/* ---- Sizes ---- */
.cc-btn--sm {
  font-size: 14px;
  padding: 6px 12px;
}

.cc-btn--sm.cc-btn--secondary {
  padding: 5px 11px;
}

.cc-btn--lg {
  font-size: 16px;
  padding: 12px 24px;
}

.cc-btn--lg.cc-btn--secondary {
  padding: 11px 23px;
}

/* ---- Block ---- */
.cc-btn--block {
  display: flex;
  width: 100%;
}

/* ---- Loading ---- */
.cc-btn--loading {
  cursor: wait;
}

.cc-btn__spinner {
  display: inline-flex;
}

.cc-btn__content {
  display: inline-flex;
  align-items: center;
}
</style>
