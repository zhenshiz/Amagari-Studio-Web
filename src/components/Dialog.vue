<script setup>
import { computed, ref } from 'vue'
import { Check, Info, TriangleAlert, X } from '@lucide/vue'

import Modal from '@/components/Modal.vue'
import PixelButton from '@/components/PixelButton.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

defineOptions({ name: 'PixelDialog' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
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
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warn', 'success', 'error'].includes(value),
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
  onMaskClick: {
    type: Function,
    default: undefined,
  },
  onEscClick: {
    type: Function,
    default: undefined,
  },
})

const emit = defineEmits(['close', 'positive', 'negative'])

const { tt } = useLocaleText()
const show = ref(true)

const confirmText = computed(() => props.positiveText || tt('确定'))
const cancelText = computed(() => props.negativeText || tt('取消'))

const iconConfig = computed(() => {
  const map = {
    info: { icon: Info, color: '#24798a', background: '#c9f3fa' },
    warn: { icon: TriangleAlert, color: '#805d0a', background: '#ffe69a' },
    success: { icon: Check, color: '#28633a', background: '#c9efcf' },
    error: { icon: X, color: '#8f3029', background: '#ffd0c5' },
  }

  return map[props.type] || map.info
})

const handlePositive = () => {
  show.value = false
  props.onPositiveClick?.()
  emit('positive')
}

const handleNegative = () => {
  show.value = false
  props.onNegativeClick?.()
  emit('negative')
}
</script>

<template>
  <Modal
    v-model:show="show"
    width="420px"
    :title="title"
    :aria-label="title"
    :mask-closable="maskClosable"
    :close-on-esc="escClosable"
    @mask-click="onMaskClick?.()"
    @esc="onEscClick?.()"
    @after-leave="emit('close')"
  >
    <template #header>
      <div class="flex min-w-0 items-center gap-3">
        <span
          class="grid size-9 shrink-0 place-items-center border-2 border-[#172018] shadow-[3px_3px_0_#172018]"
          :style="{ color: iconConfig.color, backgroundColor: iconConfig.background }"
        >
          <component :is="iconConfig.icon" class="size-5" stroke-width="2.8" />
        </span>
        <h2 class="min-w-0 font-mono text-lg font-black leading-tight">
          {{ title }}
        </h2>
      </div>
    </template>

    <slot>
      <p
        class="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-[#536054] dark:text-[#c0c5bf]"
      >
        {{ content }}
      </p>
    </slot>

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
