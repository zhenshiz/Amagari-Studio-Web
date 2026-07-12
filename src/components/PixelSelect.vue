<script setup>
import { computed, nextTick, ref, useId, watch } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '100%',
  },
  ignoreCase: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  emptyText: {
    type: String,
    default: '暂无数据',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const componentId = useId()
const rootRef = ref(null)
const triggerRef = ref(null)
const optionRefs = ref([])
const isOpen = ref(false)
const activeIndex = ref(-1)

const listboxId = `pixel-select-${componentId}`
const optionId = (index) => `${listboxId}-option-${index}`

const isValueMatch = (valueA, valueB) => {
  if (valueA === valueB) return true
  if (!props.ignoreCase || valueA == null || valueB == null) return false
  if (typeof valueA === 'object' || typeof valueB === 'object') return false

  return String(valueA).toLocaleLowerCase() === String(valueB).toLocaleLowerCase()
}

const selectedIndex = computed(() =>
  props.options.findIndex((option) => isValueMatch(option.value, props.modelValue)),
)
const selectedOption = computed(() => props.options[selectedIndex.value])

const findEnabledIndex = (startIndex, direction) => {
  if (!props.options.length) return -1

  let nextIndex = startIndex

  for (let index = 0; index < props.options.length; index += 1) {
    nextIndex = (nextIndex + direction + props.options.length) % props.options.length

    if (!props.options[nextIndex]?.disabled) {
      return nextIndex
    }
  }

  return -1
}

const scrollActiveOptionIntoView = async () => {
  await nextTick()
  optionRefs.value[activeIndex.value]?.scrollIntoView({ block: 'nearest' })
}

const open = () => {
  if (props.disabled) return

  isOpen.value = true
  activeIndex.value =
    selectedIndex.value >= 0 && !props.options[selectedIndex.value]?.disabled
      ? selectedIndex.value
      : findEnabledIndex(-1, 1)
  scrollActiveOptionIntoView()
}

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const handleSelect = (option) => {
  if (props.disabled || option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
  nextTick(() => triggerRef.value?.focus())
}

const moveActive = (direction) => {
  const nextIndex = findEnabledIndex(activeIndex.value, direction)

  if (nextIndex >= 0) {
    activeIndex.value = nextIndex
    scrollActiveOptionIntoView()
  }
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (isOpen.value) moveActive(1)
      else open()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) moveActive(-1)
      else open()
      break
    case 'Home':
      if (!isOpen.value) return
      event.preventDefault()
      activeIndex.value = findEnabledIndex(-1, 1)
      scrollActiveOptionIntoView()
      break
    case 'End':
      if (!isOpen.value) return
      event.preventDefault()
      activeIndex.value = findEnabledIndex(0, -1)
      scrollActiveOptionIntoView()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        open()
      } else if (activeIndex.value >= 0) {
        handleSelect(props.options[activeIndex.value])
      }
      break
    case 'Escape':
      if (!isOpen.value) return
      event.preventDefault()
      close()
      break
    case 'Tab':
      close()
      break
    default:
      break
  }
}

const setOptionRef = (element, index) => {
  if (element) optionRefs.value[index] = element
}

onClickOutside(rootRef, close)

watch(
  () => props.modelValue,
  () => {
    if (isOpen.value) activeIndex.value = selectedIndex.value
  },
)

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  },
)
</script>

<template>
  <div ref="rootRef" class="relative inline-block" :style="{ width }">
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-label="ariaLabel || placeholder"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
      :disabled="disabled"
      class="flex h-11 w-full select-none items-center justify-between gap-3 border-2 border-[var(--ink)] bg-[#f8fbf2] px-3 text-left text-xs font-black text-[#172018] outline-none transition-[transform,box-shadow,background-color] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#282b29] dark:text-[#f2f1e8]"
      :class="
        isOpen
          ? 'translate-x-0.5 translate-y-0.5 bg-[#ecff91] text-[#172018] shadow-[2px_2px_0_var(--ink)] dark:bg-[#3c4428] dark:text-[#f2f1e8]'
          : 'hover:bg-[#eef3e9] focus-visible:shadow-[3px_3px_0_var(--ink)] dark:hover:bg-[#333735]'
      "
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="flex min-w-0 items-center gap-2">
        <img
          v-if="selectedOption?.icon"
          :src="selectedOption.icon"
          alt=""
          class="size-5 shrink-0 object-contain [image-rendering:pixelated]"
        />
        <span class="truncate" :class="selectedOption ? '' : 'text-[#7b847d] dark:text-[#9da49f]'">
          {{ selectedOption?.label || placeholder }}
        </span>
      </span>
      <ChevronDown
        class="size-4 shrink-0 transition-transform duration-150"
        :class="isOpen ? 'rotate-180' : ''"
        stroke-width="2.8"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 top-[calc(100%+6px)] z-[70] w-max min-w-full max-w-[calc(100vw-2rem)] border-2 border-[var(--ink)] bg-white p-1.5 shadow-[5px_5px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[5px_5px_0_#000]"
      >
        <ul
          :id="listboxId"
          role="listbox"
          :aria-label="ariaLabel || placeholder"
          class="pixel-select-scrollbar grid max-h-64 gap-1 overflow-y-auto"
        >
          <li
            v-for="(option, index) in options"
            :id="optionId(index)"
            :key="option.value ?? index"
            :ref="(element) => setOptionRef(element, index)"
            role="option"
            :aria-selected="isValueMatch(option.value, modelValue)"
            :aria-disabled="option.disabled || undefined"
            class="flex min-w-0 cursor-pointer select-none items-center gap-2 border-2 px-2.5 py-2 text-xs font-bold outline-none transition-colors"
            :class="[
              isValueMatch(option.value, modelValue)
                ? 'border-[var(--ink)] bg-[#77d9ea] text-[#172018] shadow-[2px_2px_0_var(--ink)]'
                : activeIndex === index
                  ? 'border-[var(--ink)] bg-[#eef3e9] dark:bg-[#343835]'
                  : 'border-transparent hover:border-[var(--ink)] hover:bg-[#f2f6ee] dark:hover:bg-[#2d302e]',
              option.disabled ? 'pointer-events-none opacity-40' : '',
            ]"
            @mouseenter="activeIndex = index"
            @mousedown.prevent
            @click="handleSelect(option)"
          >
            <img
              v-if="option.icon"
              :src="option.icon"
              alt=""
              class="size-5 shrink-0 object-contain [image-rendering:pixelated]"
            />
            <span class="min-w-0 flex-1 whitespace-nowrap">{{ option.label }}</span>
            <Check
              v-if="isValueMatch(option.value, modelValue)"
              class="size-4 shrink-0"
              stroke-width="3"
            />
          </li>

          <li v-if="!options.length" class="px-4 py-3 text-center text-xs font-bold opacity-60">
            {{ emptyText }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pixel-select-scrollbar {
  scrollbar-color: color-mix(in srgb, var(--ink) 45%, transparent) transparent;
  scrollbar-width: thin;
}

.pixel-select-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.pixel-select-scrollbar::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ink) 45%, transparent);
}
</style>
