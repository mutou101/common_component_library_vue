<script setup lang="ts">
/**
 * CcModal — dialog. Teleported to body, canvas panel with radius lg and
 * level-2 shadow, dark navy overlay tinted with the brand shadow-blue.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    title?: string
    /** panel width */
    width?: string
    /** hide the close button (e.g. force-choice dialogs) */
    closable?: boolean
    /** close on overlay click */
    maskClosable?: boolean
    /** show a footer slot region */
    footer?: boolean
  }>(),
  {
    visible: false,
    title: undefined,
    width: '480px',
    closable: true,
    maskClosable: true,
    footer: true,
  },
)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const panel = ref<HTMLElement | null>(null)

function close() {
  emit('update:visible', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.visible && props.closable) {
    close()
  }
}

function onOverlayClick(event: MouseEvent) {
  if (props.maskClosable && event.target === event.currentTarget) {
    close()
  }
}

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      emit('open')
      await nextTick()
      panel.value?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cc-modal">
      <div
        v-if="visible"
        class="cc-modal"
        @click.self="onOverlayClick"
      >
        <div
          ref="panel"
          class="cc-modal__panel"
          :style="{ maxWidth: width }"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'dialog'"
          tabindex="-1"
        >
          <header class="cc-modal__header">
            <h3
              v-if="title"
              class="cc-modal__title"
            >{{ title }}</h3>
            <button
              v-if="closable"
              type="button"
              class="cc-modal__close"
              aria-label="close"
              @click="close"
            >
              <svg
                width="14"
                height="14"
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
          </header>

          <div class="cc-modal__body">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="cc-modal__footer"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cc-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--cc-space-xl);
  background-color: rgba(13, 37, 61, 0.45);
  backdrop-filter: blur(2px);
}

.cc-modal__panel {
  width: 100%;
  background-color: var(--cc-canvas);
  border-radius: var(--cc-radius-lg);
  box-shadow: var(--cc-shadow-level-2);
  padding: var(--cc-space-xl);
  outline: none;
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-lg);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}

.cc-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--cc-space-lg);
}

.cc-modal__title {
  font-size: 22px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.22px;
  color: var(--cc-ink);
}

.cc-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  padding: 6px;
  color: var(--cc-ink-mute);
  cursor: pointer;
  border-radius: var(--cc-radius-pill);
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
  flex-shrink: 0;
}

.cc-modal__close:hover {
  color: var(--cc-ink);
  background-color: var(--cc-canvas-soft);
}

.cc-modal__body {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--cc-ink);
}

.cc-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--cc-space-md);
  padding-top: var(--cc-space-md);
}

/* Transitions */
.cc-modal-enter-active,
.cc-modal-leave-active {
  transition: opacity 0.2s ease;
}

.cc-modal-enter-active .cc-modal__panel,
.cc-modal-leave-active .cc-modal__panel {
  transition: transform 0.2s ease;
}

.cc-modal-enter-from,
.cc-modal-leave-to {
  opacity: 0;
}

.cc-modal-enter-from .cc-modal__panel,
.cc-modal-leave-to .cc-modal__panel {
  transform: translateY(8px) scale(0.98);
}
</style>
