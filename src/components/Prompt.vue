<script setup>
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import { Check, ChevronDown, LoaderCircle } from '@lucide/vue'

import Modal from '@/components/Modal.vue'
import PixelButton from '@/components/PixelButton.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

defineOptions({ name: 'PixelPrompt' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: [Array, Function],
    default: () => [],
  },
  defaultValue: {
    type: String,
    default: '',
  },
  positiveText: {
    type: String,
    default: '',
  },
  negativeText: {
    type: String,
    default: '',
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  escClosable: {
    type: Boolean,
    default: true,
  },
  onPositiveClick: {
    type: Function,
    default: undefined,
  },
  onNegativeClick: {
    type: Function,
    default: undefined,
  },
})

const emit = defineEmits(['close', 'positive', 'negative'])

const { tt } = useLocaleText()
const componentId = useId()
const inputValue = ref(props.defaultValue)
const show = ref(true)
const inputRef = ref(null)
const resolvedOptions = ref([])
const isLoading = ref(false)
const isListOpen = ref(false)
const activeIndex = ref(-1)
const isComposing = ref(false)
let optionRequestId = 0
let settled = false

const listboxId = `pixel-prompt-${componentId}`
const confirmText = computed(() => props.positiveText || tt('确认'))
const cancelText = computed(() => props.negativeText || tt('取消'))
const isAutoComplete = computed(
  () =>
    typeof props.options === 'function' ||
    (Array.isArray(props.options) && props.options.length > 0),
)

const normalizeOptions = (options) =>
  (Array.isArray(options) ? options : [])
    .map((option) => {
      if (option && typeof option === 'object') {
        const value = option.value ?? option.label ?? ''
        return {
          ...option,
          value: String(value),
          label: String(option.label ?? value),
        }
      }

      return {
        value: String(option ?? ''),
        label: String(option ?? ''),
      }
    })
    .filter((option) => option.label)

const visibleOptions = computed(() => {
  if (typeof props.options === 'function') return resolvedOptions.value

  const query = inputValue.value.trim().toLocaleLowerCase()
  if (!query) return resolvedOptions.value

  return resolvedOptions.value.filter((option) => option.label.toLocaleLowerCase().includes(query))
})

const selectOption = (option) => {
  inputValue.value = option.value
  isListOpen.value = false
  activeIndex.value = -1
  nextTick(() => inputRef.value?.focus())
}

const finishNegative = () => {
  if (settled) return
  settled = true
  props.onNegativeClick?.()
  emit('negative')
}

const handlePositive = () => {
  if (settled) return
  settled = true
  show.value = false
  props.onPositiveClick?.(inputValue.value)
  emit('positive', inputValue.value)
}

const handleNegative = () => {
  finishNegative()
  show.value = false
}

const handleModalClose = () => {
  finishNegative()
}

const handleKeydown = (event) => {
  if (event.key === 'ArrowDown' && isAutoComplete.value) {
    event.preventDefault()
    isListOpen.value = true
    activeIndex.value = Math.min(activeIndex.value + 1, visibleOptions.value.length - 1)
    return
  }

  if (event.key === 'ArrowUp' && isAutoComplete.value) {
    event.preventDefault()
    isListOpen.value = true
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    return
  }

  if (event.key === 'Escape' && isListOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    isListOpen.value = false
    activeIndex.value = -1
    return
  }

  if (event.key !== 'Enter' || isComposing.value) return

  event.preventDefault()
  if (isListOpen.value && activeIndex.value >= 0) {
    selectOption(visibleOptions.value[activeIndex.value])
    return
  }

  handlePositive()
}

watch(
  [() => props.options, inputValue],
  async ([options, query]) => {
    optionRequestId += 1
    const requestId = optionRequestId
    activeIndex.value = -1

    if (Array.isArray(options)) {
      resolvedOptions.value = normalizeOptions(options)
      isLoading.value = false
      return
    }

    if (typeof options !== 'function') {
      resolvedOptions.value = []
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      const nextOptions = await options(query)
      if (requestId === optionRequestId) {
        resolvedOptions.value = normalizeOptions(nextOptions)
      }
    } catch {
      if (requestId === optionRequestId) resolvedOptions.value = []
    } finally {
      if (requestId === optionRequestId) isLoading.value = false
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
})
</script>

<template>
  <Modal
    v-model:show="show"
    :title="title"
    :aria-label="title"
    width="460px"
    :mask-closable="maskClosable"
    :close-on-esc="escClosable"
    @close="handleModalClose"
    @after-leave="emit('close')"
  >
    <div class="relative py-1">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        :role="isAutoComplete ? 'combobox' : undefined"
        :aria-autocomplete="isAutoComplete ? 'list' : undefined"
        :aria-expanded="isAutoComplete ? isListOpen : undefined"
        :aria-controls="isAutoComplete && isListOpen ? listboxId : undefined"
        class="h-12 w-full border-[3px] border-[var(--ink)] bg-[#f8fbf2] px-3 pr-11 text-sm font-bold text-[#172018] outline-none shadow-[4px_4px_0_var(--ink)] placeholder:text-[#7a847c] focus:bg-white dark:bg-[#282b29] dark:text-[#f2f1e8] dark:placeholder:text-[#9ca49e] dark:focus:bg-[#303331]"
        @focus="isListOpen = isAutoComplete"
        @blur="isListOpen = false"
        @keydown="handleKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />

      <span
        v-if="isAutoComplete"
        class="pointer-events-none absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center"
      >
        <LoaderCircle v-if="isLoading" class="size-4 animate-spin" stroke-width="2.5" />
        <ChevronDown v-else class="size-4" stroke-width="2.7" />
      </span>

      <div
        v-if="isAutoComplete && isListOpen"
        :id="listboxId"
        role="listbox"
        class="absolute left-0 top-[calc(100%+8px)] z-20 max-h-56 w-full overflow-y-auto border-[3px] border-[var(--ink)] bg-white p-1.5 shadow-[5px_5px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[5px_5px_0_#000]"
      >
        <button
          v-for="(option, index) in visibleOptions"
          :key="`${option.value}-${index}`"
          type="button"
          role="option"
          :aria-selected="inputValue === option.value"
          class="flex w-full items-center justify-between gap-3 border-2 px-3 py-2.5 text-left text-xs font-black transition-colors"
          :class="
            activeIndex === index || inputValue === option.value
              ? 'border-[var(--ink)] bg-[#d8f461] text-[#172018]'
              : 'border-transparent hover:border-[var(--ink)] hover:bg-[#eef3e9] dark:hover:bg-[#303431]'
          "
          @mousedown.prevent="selectOption(option)"
        >
          <span class="truncate">{{ option.label }}</span>
          <Check v-if="inputValue === option.value" class="size-4 shrink-0" stroke-width="3" />
        </button>

        <p
          v-if="!isLoading && !visibleOptions.length"
          class="px-3 py-4 text-center text-xs font-bold text-[#778179] dark:text-[#aab0ab]"
        >
          {{ tt('暂无匹配项') }}
        </p>
      </div>
    </div>

    <template #footer>
      <PixelButton
        :text="cancelText"
        min-width="88px"
        bg-color="#ff9b78"
        hover-bg-color="#ffb39a"
        @click="handleNegative"
      />
      <PixelButton
        :text="confirmText"
        min-width="88px"
        bg-color="#d8f461"
        hover-bg-color="#ecff91"
        @click="handlePositive"
      />
    </template>
  </Modal>
</template>
