<script setup>
import { computed } from 'vue'
import { Check, Info, TriangleAlert, X } from '@lucide/vue'

defineOptions({ name: 'PixelMessage' })

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warn', 'success', 'error'].includes(value),
  },
  isRichText: {
    type: Boolean,
    default: false,
  },
})

const config = computed(() => {
  const map = {
    info: { icon: Info, className: 'message-info' },
    warn: { icon: TriangleAlert, className: 'message-warn' },
    success: { icon: Check, className: 'message-success' },
    error: { icon: X, className: 'message-error' },
  }

  return map[props.type] || map.info
})
</script>

<template>
  <div
    class="pointer-events-none fixed left-1/2 top-[84px] z-[1100] w-[min(calc(100%-2rem),560px)] -translate-x-1/2"
    :role="type === 'error' || type === 'warn' ? 'alert' : 'status'"
    :aria-live="type === 'error' || type === 'warn' ? 'assertive' : 'polite'"
  >
    <div
      class="message-enter pixel-grid flex items-start gap-3 border-[3px] bg-white px-4 py-3 text-[#172018] shadow-[6px_6px_0_#172018] dark:bg-[#1d1f1e] dark:text-[#f2f1e8] dark:shadow-[6px_6px_0_#000]"
      :class="config.className"
    >
      <span class="message-icon grid size-7 shrink-0 place-items-center border-2 border-current">
        <component :is="config.icon" class="size-4" stroke-width="3" />
      </span>

      <span v-if="!isRichText" class="min-w-0 break-words pt-0.5 text-sm font-bold leading-6">
        {{ message }}
      </span>
      <span
        v-else
        class="message-rich min-w-0 break-words pt-0.5 text-sm font-bold leading-6"
        v-html="message"
      />
    </div>
  </div>
</template>

<style scoped>
.message-enter {
  animation: message-enter 180ms steps(3, end) both;
}

.message-info {
  border-color: #24798a;
}

.message-info .message-icon {
  color: #24798a;
  background: #c9f3fa;
}

.message-warn {
  border-color: #b98513;
}

.message-warn .message-icon {
  color: #805d0a;
  background: #ffe69a;
}

.message-success {
  border-color: #35804b;
}

.message-success .message-icon {
  color: #28633a;
  background: #c9efcf;
}

.message-error {
  border-color: #b84137;
}

.message-error .message-icon {
  color: #8f3029;
  background: #ffd0c5;
}

.message-rich :deep(a) {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

@keyframes message-enter {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .message-enter {
    animation: none;
  }
}
</style>
