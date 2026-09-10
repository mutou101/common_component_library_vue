<script setup lang="ts">
/**
 * CcTag — small pill label.
 * soft (default) → {pill-tag-soft}: subdued indigo fill #b9b9f9 + primary-deep text,
 *                  micro-cap type (10px, all-caps eyebrow)
 * outline         → hairline border + ink-mute text
 * dark            → brand-dark-900 fill, on-primary text
 * solid           → primary fill, on-primary text
 */
withDefaults(
  defineProps<{
    variant?: 'soft' | 'outline' | 'dark' | 'solid'
    size?: 'sm' | 'md'
    /** show a leading status dot */
    dot?: boolean
    closable?: boolean
  }>(),
  {
    variant: 'soft',
    size: 'md',
    dot: false,
    closable: false,
  },
)

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()
</script>

<template>
  <span
    class="cc-tag"
    :class="[`cc-tag--${variant}`, `cc-tag--${size}`]"
  >
    <span
      v-if="dot"
      class="cc-tag__dot"
    />
    <slot />
    <button
      v-if="closable"
      type="button"
      class="cc-tag__close"
      :aria-label="`close tag`"
      @click.stop="(e) => emit('close', e)"
    >
      <svg
        width="10"
        height="10"
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
  </span>
</template>

<style scoped>
.cc-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--cc-space-xs);
  border-radius: var(--cc-radius-pill);
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: 0.1px;
  text-transform: uppercase;
  white-space: nowrap;
  vertical-align: middle;
}

.cc-tag--sm {
  padding: 2px 6px;
  font-size: 9px;
}

/* ---- Variants ---- */
.cc-tag--soft {
  background-color: var(--cc-primary-subdued);
  color: var(--cc-primary-deep);
}

.cc-tag--outline {
  background-color: transparent;
  color: var(--cc-ink-mute);
  border: 1px solid var(--cc-hairline);
  padding: 3px 7px;
}

.cc-tag--dark {
  background-color: var(--cc-brand-dark-900);
  color: var(--cc-on-primary);
}

.cc-tag--solid {
  background-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

/* ---- Dot ---- */
.cc-tag__dot {
  width: 5px;
  height: 5px;
  border-radius: var(--cc-radius-pill);
  background-color: currentColor;
  opacity: 0.8;
}

/* ---- Close ---- */
.cc-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.cc-tag__close:hover {
  opacity: 1;
}
</style>
