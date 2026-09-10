<script setup lang="ts">
/**
 * CcSpinner — loading indicator
 * Design: Stripe-inspired (DESIGN.md); color defaults to the brand indigo.
 */
withDefaults(
  defineProps<{
    /** Spinner diameter in px */
    size?: number
    /** Stroke color */
    color?: string
  }>(),
  {
    size: 20,
    color: 'var(--cc-primary)',
  },
)
</script>

<template>
  <svg
    class="cc-spinner"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    role="status"
    aria-label="loading"
  >
    <circle
      class="cc-spinner__track"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width="3"
    />
    <path
      class="cc-spinner__arc"
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.cc-spinner {
  color: v-bind(color);
  animation: cc-spin 0.8s linear infinite;
}

.cc-spinner__arc {
  stroke: currentColor;
}

@keyframes cc-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
