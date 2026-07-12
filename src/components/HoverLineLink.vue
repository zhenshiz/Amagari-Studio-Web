<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  isRouter: {
    type: Boolean,
    default: true,
  },
  // none | normal | toLeft | toRight | toCenter | toFlanks
  hoverLineType: {
    type: String,
    default: 'none',
    validator(value) {
      return ['none', 'normal', 'toLeft', 'toRight', 'toCenter', 'toFlanks'].includes(value)
    },
  },
  lineColor: {
    type: String,
    default: '#00c0f5',
  },
})

const emit = defineEmits(['callback'])

const rootStyle = computed(() => ({
  '--hover-line-color': props.lineColor,
}))

const resolvedHref = computed(() => {
  if (!props.href || !props.isRouter || props.href.startsWith('#')) return props.href
  return router.resolve(props.href).href
})

const goto = async () => {
  if (!props.href) {
    emit('callback')
    return
  }

  if (props.href.startsWith('#')) {
    const target = document.querySelector(props.href)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', props.href)
  } else if (props.isRouter) {
    await router.push(props.href)
  } else {
    window.open(props.href, '_blank', 'noopener,noreferrer')
  }

  emit('callback')
}
</script>

<template>
  <a
    :href="resolvedHref || undefined"
    :target="!isRouter && href ? '_blank' : undefined"
    :rel="!isRouter && href ? 'noopener noreferrer' : undefined"
    :role="href ? undefined : 'button'"
    :tabindex="href ? undefined : 0"
    class="hover-line-link"
    :class="hoverLineType"
    :style="rootStyle"
    @click.prevent="goto"
    @keydown.enter.prevent="goto"
    @keydown.space.prevent="goto"
  >
    <slot />
  </a>
</template>

<style scoped>
.hover-line-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.hover-line-link::before,
.hover-line-link::after {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 2px;
  pointer-events: none;
  content: '';
  background: var(--hover-line-color);
  transition: width 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.none::before,
.none::after {
  display: none;
}

.normal::before {
  right: 0;
  transition: none;
}

.normal:hover::before,
.normal:focus-visible::before {
  width: 100%;
}

.toLeft::before {
  right: 0;
}

.toLeft:hover::before,
.toLeft:focus-visible::before {
  width: 100%;
}

.toRight::before {
  left: 0;
}

.toRight:hover::before,
.toRight:focus-visible::before {
  width: 100%;
}

.toCenter::before {
  right: 0;
}

.toCenter::after {
  left: 0;
}

.toCenter:hover::before,
.toCenter:hover::after,
.toCenter:focus-visible::before,
.toCenter:focus-visible::after {
  width: 50%;
}

.toFlanks::before {
  left: 50%;
  transform: translateX(-50%);
}

.toFlanks:hover::before,
.toFlanks:focus-visible::before {
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .hover-line-link::before,
  .hover-line-link::after {
    transition: none;
  }
}
</style>
