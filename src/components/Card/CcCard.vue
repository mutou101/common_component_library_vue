<script setup lang="ts">
/**
 * CcCard — surface container.
 * Variants map to DESIGN.md tokens:
 *  feature          → {card-feature-light}      canvas, 32px pad, radius lg, hairline + level-1 shadow
 *  pricing          → {card-pricing}            canvas, heading-lg title, CTA pinned bottom
 *  pricing-featured → {card-pricing-featured}   brand-dark-900 fill, on-primary text
 *  cream            → {card-cream-band}         canvas-cream warm interlude
 *  dashboard        → {card-dashboard-mockup}   tabular type, level-2 shadow
 *  plain            → bare canvas + hairline
 */
withDefaults(
  defineProps<{
    variant?: 'feature' | 'pricing' | 'pricing-featured' | 'cream' | 'dashboard' | 'plain'
    title?: string
    description?: string
    /** remove padding for full-bleed content */
    flush?: boolean
  }>(),
  {
    variant: 'feature',
    title: undefined,
    description: undefined,
    flush: false,
  },
)
</script>

<template>
  <article
    class="cc-card"
    :class="[`cc-card--${variant}`, { 'cc-card--flush': flush }]"
  >
    <slot name="header">
      <header
        v-if="title || description"
        class="cc-card__header"
      >
        <h3
          v-if="title"
          class="cc-card__title"
        >{{ title }}</h3>
        <p
          v-if="description"
          class="cc-card__desc"
        >{{ description }}</p>
      </header>
    </slot>

    <div class="cc-card__body">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="cc-card__footer"
    >
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.cc-card {
  position: relative;
  border-radius: var(--cc-radius-lg);
  padding: var(--cc-space-xxl);
  font-family: var(--cc-font-family);
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-lg);
}

.cc-card--flush {
  padding: 0;
}

/* ---- Variants ---- */
.cc-card--feature,
.cc-card--pricing {
  background-color: var(--cc-canvas);
  color: var(--cc-ink);
  border: 1px solid var(--cc-hairline);
  box-shadow: var(--cc-shadow-level-1);
}

.cc-card--pricing-featured {
  background-color: var(--cc-brand-dark-900);
  color: var(--cc-on-primary);
  border: 1px solid transparent;
  box-shadow: var(--cc-shadow-level-2);
}

.cc-card--cream {
  background-color: var(--cc-canvas-cream);
  color: var(--cc-ink);
  border: 1px solid transparent;
}

.cc-card--dashboard {
  background-color: var(--cc-canvas);
  color: var(--cc-ink);
  border: 1px solid var(--cc-hairline);
  box-shadow: var(--cc-shadow-level-2);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

.cc-card--plain {
  background-color: var(--cc-canvas);
  color: var(--cc-ink);
  border: 1px solid var(--cc-hairline);
}

/* ---- Header ---- */
.cc-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-xs);
}

.cc-card__title {
  font-size: 22px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.22px;
  color: inherit;
}

.cc-card--pricing-featured .cc-card__title {
  color: var(--cc-on-primary);
}

.cc-card__desc {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--cc-ink-mute);
}

.cc-card--pricing-featured .cc-card__desc {
  color: rgba(255, 255, 255, 0.72);
}

/* ---- Body ---- */
.cc-card__body {
  flex: 1;
}

.cc-card--dashboard .cc-card__body {
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.42px;
}

/* ---- Footer ---- */
.cc-card__footer {
  display: flex;
  align-items: center;
  gap: var(--cc-space-md);
  padding-top: var(--cc-space-lg);
}
</style>
