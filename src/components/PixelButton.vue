<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  href: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object],
    default: null,
  },
  target: {
    type: String,
    default: '',
  },
  rel: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: 'auto',
  },
  minWidth: {
    type: [String, Number],
    default: '0px',
  },
  bgColor: {
    type: String,
    default: '#d9f45f',
  },
  hoverBgColor: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '#142017',
  },
})

const toCssSize = (value) => (typeof value === 'number' ? `${value}px` : value)

const rootTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'RouterLink'
  return 'button'
})

const rootAttrs = computed(() => {
  if (props.href) {
    return {
      href: props.disabled ? undefined : props.href,
      target: props.target || undefined,
      rel: props.rel || undefined,
      'aria-label': props.ariaLabel || undefined,
      'aria-disabled': props.disabled ? 'true' : undefined,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  if (props.to) {
    return {
      to: props.disabled ? undefined : props.to,
      'aria-label': props.ariaLabel || undefined,
      'aria-disabled': props.disabled ? 'true' : undefined,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  return {
    type: props.type,
    disabled: props.disabled,
    'aria-label': props.ariaLabel || undefined,
  }
})

const cssVars = computed(() => ({
  '--pixel-button-width': toCssSize(props.width),
  '--pixel-button-min-width': toCssSize(props.minWidth),
  '--pixel-button-bg': props.bgColor,
  '--pixel-button-hover-bg': props.hoverBgColor || props.bgColor,
  '--pixel-button-text': props.textColor,
}))

const buttonClasses = [
  'inline-flex h-[42px] select-none items-center justify-center gap-2 whitespace-nowrap border-[2px] border-[#142017] px-4 text-[14px] font-extrabold leading-none no-underline outline-none',
  '[width:var(--pixel-button-width)] [min-width:var(--pixel-button-min-width)]',
  'bg-[var(--pixel-button-bg)] text-[var(--pixel-button-text)] shadow-[5px_5px_0_#142017] dark:shadow-[5px_5px_0_#59645c]',
  'transition-[transform,box-shadow,background-color] duration-75 ease-out',
  'hover:bg-[var(--pixel-button-hover-bg)]',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#142017]',
  'active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_#142017] dark:active:shadow-[2px_2px_0_#59645c]',
  'disabled:pointer-events-none disabled:translate-x-[3px] disabled:translate-y-[3px] disabled:opacity-60 disabled:shadow-[2px_2px_0_#142017] dark:disabled:shadow-[2px_2px_0_#59645c]',
  'aria-disabled:pointer-events-none aria-disabled:translate-x-[3px] aria-disabled:translate-y-[3px] aria-disabled:opacity-60 aria-disabled:shadow-[2px_2px_0_#142017] dark:aria-disabled:shadow-[2px_2px_0_#59645c]',
]
</script>

<template>
  <component :is="rootTag" v-bind="rootAttrs" :class="buttonClasses" :style="cssVars">
    <slot name="left" />
    <span v-if="text">{{ text }}</span>
    <slot />
    <slot name="right" />
  </component>
</template>
