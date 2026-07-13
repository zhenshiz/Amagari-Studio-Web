<script setup>
import { nextTick, ref, watch } from 'vue'
import { X } from '@lucide/vue'

import { useLocaleText } from '@/utils/useLocaleText.js'

defineOptions({ name: 'PixelModal' })

let pageScrollLockCount = 0
let previousDocumentOverflow = ''
let previousBodyOverflow = ''

const lockPageScroll = () => {
  if (pageScrollLockCount === 0) {
    previousDocumentOverflow = document.documentElement.style.overflow
    previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }

  pageScrollLockCount += 1
}

const unlockPageScroll = () => {
  pageScrollLockCount = Math.max(0, pageScrollLockCount - 1)
  if (pageScrollLockCount > 0) return

  document.documentElement.style.overflow = previousDocumentOverflow
  document.body.style.overflow = previousBodyOverflow
}

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '480px',
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:show', 'close', 'after-leave', 'mask-click', 'esc'])

const { tt } = useLocaleText()
const dialogRef = ref(null)
let previousActiveElement = null

const modalWidth = () => (typeof props.width === 'number' ? `${props.width}px` : props.width)

const close = (reason) => {
  emit('close', reason)
  emit('update:show', false)
}

const handleMaskClick = () => {
  emit('mask-click')
  if (props.maskClosable) close('mask')
}

const handleEsc = () => {
  emit('esc')
  if (props.closeOnEsc) close('esc')
}

const handleAfterLeave = () => {
  if (previousActiveElement instanceof HTMLElement) {
    previousActiveElement.focus()
  }
  previousActiveElement = null
  emit('after-leave')
}

watch(
  () => props.show,
  async (show, _, onCleanup) => {
    if (!show) return

    lockPageScroll()
    onCleanup(unlockPageScroll)

    previousActiveElement = document.activeElement
    await nextTick()
    dialogRef.value?.focus()
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-120 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[1000] grid place-items-center overflow-y-auto bg-[#172018]/65 p-4 backdrop-blur-[2px] dark:bg-black/75"
        @click.self="handleMaskClick"
        @keydown.esc.stop="handleEsc"
      >
        <section
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel || title || undefined"
          :style="{ width: modalWidth(), maxWidth: 'calc(100vw - 2rem)' }"
          tabindex="-1"
          class="my-auto max-h-[calc(100vh-2rem)] max-w-full overflow-y-auto border-[3px] border-[#172018] bg-white text-[#172018] shadow-[8px_8px_0_#172018] outline-none dark:border-[#f2f1e8] dark:bg-[#1d1f1e] dark:text-[#f2f1e8] dark:shadow-[8px_8px_0_#59645c]"
        >
          <header
            class="flex min-h-14 items-center justify-between gap-4 border-b-2 border-dashed border-[#9da79f] px-4 py-3 dark:border-[#555b57]"
          >
            <slot name="header">
              <h2 class="font-mono text-lg font-black">{{ title }}</h2>
            </slot>

            <button
              type="button"
              class="grid size-8 shrink-0 place-items-center border-2 border-transparent transition-colors hover:border-[var(--ink)] hover:bg-[#eef3e9] focus-visible:border-[var(--ink)] focus-visible:outline-none dark:hover:bg-[#303431]"
              :aria-label="tt('关闭对话框')"
              @click="close('button')"
            >
              <X class="size-5" stroke-width="2.7" />
            </button>
          </header>

          <div class="px-4 py-4 sm:px-5">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex flex-wrap items-center justify-end gap-3 border-t-2 border-dashed border-[#9da79f] px-4 py-4 dark:border-[#555b57] sm:px-5"
          >
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
