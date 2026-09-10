<script setup lang="ts">
/**
 * CcDivider — hairline separator, optional centered label.
 * Design: Stripe-inspired; hairline uses {colors.hairline}.
 */
withDefaults(
  defineProps<{
    /** vertical | horizontal */
    orientation?: 'horizontal' | 'vertical'
    /** length for vertical dividers */
    height?: string
  }>(),
  {
    orientation: 'horizontal',
    height: '1em',
  },
)
</script>

<template>
  <div
    class="cc-divider"
    :class="[`cc-divider--${orientation}`]"
    role="separator"
    :style="orientation === 'vertical' ? { height } : undefined"
  >
    <span
      v-if="$slots.default"
      class="cc-divider__label"
    >
      <slot />
    </span>
  </div>
</template>

<style scoped>
.cc-divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
}

.cc-divider--horizontal {
  height: 1px;
  background-color: var(--cc-hairline);
}

.cc-divider--horizontal.cc-divider:has(.cc-divider__label) {
  background-color: transparent;
}

.cc-divider__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--cc-space-lg);
  color: var(--cc-ink-mute);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.39px;
  white-space: nowrap;
}

.cc-divider__label::before,
.cc-divider__label::after {
  content: "";
  width: 48px;
  height: 1px;
  background-color: var(--cc-hairline);
}

/* Vertical */
.cc-divider--vertical {
  width: 1px;
  height: 100%;
  align-self: stretch;
  background-color: var(--cc-hairline);
}
</style>
