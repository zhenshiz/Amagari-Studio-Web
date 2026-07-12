<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
  borderColor: {
    type: String,
    default: '#172018',
  },
  shadowColor: {
    type: String,
    default: '#172018',
  },
  shadowX: {
    type: [String, Number],
    default: '5px',
  },
  shadowY: {
    type: [String, Number],
    default: '5px',
  },
})

const toCssSize = (value) => (typeof value === 'number' ? `${value}px` : value)

const cssVars = computed(() => ({
  '--pixel-frame-bg': props.bgColor,
  '--pixel-frame-border': props.borderColor,
  '--pixel-frame-shadow': props.shadowColor,
  '--pixel-frame-shadow-x': toCssSize(props.shadowX),
  '--pixel-frame-shadow-y': toCssSize(props.shadowY),
}))
</script>

<template>
  <component
    :is="tag"
    :style="cssVars"
    class="border-2 border-[var(--pixel-frame-border)] bg-[var(--pixel-frame-bg)] shadow-[var(--pixel-frame-shadow-x)_var(--pixel-frame-shadow-y)_0_var(--pixel-frame-shadow)] dark:border-[#d8d3c5] dark:bg-[#1d1f1e] dark:shadow-[var(--pixel-frame-shadow-x)_var(--pixel-frame-shadow-y)_0_#000000]"
  >
    <slot />
  </component>
</template>
