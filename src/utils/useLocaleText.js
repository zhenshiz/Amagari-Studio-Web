import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { i18nScope, t } from '@/languages/index.js'

export function useLocaleText() {
  const version = ref(0)

  const handleChange = () => {
    version.value += 1
  }

  onMounted(() => {
    i18nScope.on('change', handleChange)
  })

  onBeforeUnmount(() => {
    i18nScope.off('change', handleChange)
  })

  const tt = (message, vars) => {
    version.value
    return t(message, vars)
  }

  const activeLanguage = computed(() => {
    version.value
    return i18nScope.activeLanguage
  })

  return {
    activeLanguage,
    tt,
  }
}
