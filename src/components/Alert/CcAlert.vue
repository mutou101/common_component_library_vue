<script setup lang="ts">
/**
 * CcAlert — status message with optional title, description, dismiss.
 * Semantic tones live in dashboard-product UI (per DESIGN.md notes):
 * info (indigo) · success (green) · warning (lemon) · error (ruby).
 */
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'error'
    title?: string
    description?: string
    closable?: boolean
  }>(),
  {
    variant: 'info',
    title: undefined,
    description: undefined,
    closable: false,
  },
)

const visible = ref(true)

const iconColor = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'var(--cc-success)'
    case 'warning':
      return 'var(--cc-warning)'
    case 'error':
      return 'var(--cc-error)'
    default:
      return 'var(--cc-primary)'
  }
})
</script>

<template>
  <div
    v-if="visible"
    class="cc-alert"
    :class="`cc-alert--${variant}`"
    role="alert"
  >
    <span
      class="cc-alert__icon"
      :style="{ color: iconColor }"
      aria-hidden="true"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 1.5l6.5 11.25H1.5L8 1.5z"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
        <path
          d="M8 6v3.2"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        />
        <circle
          cx="8"
          cy="11.2"
          r="0.9"
          fill="currentColor"
        />
      </svg>
    </span>

    <div class="cc-alert__content">
      <p
        v-if="title"
        class="cc-alert__title"
      >{{ title }}</p>
      <p
        v-if="description || $slots.default"
        class="cc-alert__desc"
      ><slot>{{ description }}</slot></p>
    </div>

    <button
      v-if="closable"
      type="button"
      class="cc-alert__close"
      aria-label="dismiss"
      @click="visible = false"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 1l8 8M9 1l-8 8"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.cc-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--cc-space-md);
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-md);
  background-color: var(--cc-canvas-soft);
  padding: var(--cc-space-lg);
  font-family: var(--cc-font-family);
}

.cc-alert__icon {
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 1px;
}

.cc-alert__content {
  flex: 1;
  min-width: 0;
}

.cc-alert__title {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--cc-ink);
}

.cc-alert__desc {
  margin-top: 2px;
  font-size: 13px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--cc-ink-mute);
}

.cc-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  padding: 4px;
  color: var(--cc-ink-mute);
  cursor: pointer;
  border-radius: var(--cc-radius-xs);
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.cc-alert__close:hover {
  color: var(--cc-ink);
  background-color: var(--cc-hairline);
}
</style>
