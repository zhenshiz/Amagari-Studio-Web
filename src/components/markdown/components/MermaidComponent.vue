<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps(nodeViewProps)
const localCode = ref(props.node.attrs.code)
const previewContainer = ref(null)
const error = ref('')
const isDark = ref(false)
let themeObserver
let mermaidApi

const syncTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

const getMermaid = async () => {
  if (!mermaidApi) {
    mermaidApi = (await import('mermaid')).default
  }
  return mermaidApi
}

const initMermaid = async () => {
  const mermaid = await getMermaid()
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
    themeVariables: {
      primaryColor: '#80ccff',
      mainBkg: isDark.value ? '#1e293b' : '#f8fafc',
      lineColor: '#80ccff',
      fontSize: '14px',
    },
  })
  return mermaid
}

const renderChart = async () => {
  if (!localCode.value) return
  try {
    error.value = ''
    const mermaid = await initMermaid()
    const id = `mmd-${Math.random().toString(36).substring(2, 7)}`
    const { svg } = await mermaid.render(id, localCode.value)
    if (previewContainer.value) {
      previewContainer.value.innerHTML = svg
    }
  } catch (e) {
    error.value = e.message || 'Syntax Error'
  }
}

// 监听主题变化，实时重绘图表
watch(isDark, renderChart)

watch(
  () => props.node.attrs.code,
  (next) => {
    localCode.value = next
    renderChart()
  },
)

onMounted(() => {
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  renderChart()
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
})
</script>

<template>
  <node-view-wrapper
    class="my-5 overflow-hidden border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_var(--ink)] transition-colors dark:bg-[#171918] dark:shadow-[4px_4px_0_#000]"
    :class="[isDark ? 'hover:border-[#d8f461]' : 'hover:border-[#24798a]']"
  >
    <div
      ref="previewContainer"
      class="relative flex min-h-[100px] justify-center bg-[#f5f8f2] p-6 transition-colors dark:bg-[#171918]"
    >
      <div
        v-if="error"
        class="absolute inset-0 flex items-center justify-center bg-[#fff0eb]/95 p-4 text-center font-mono text-sm text-[#9b442a] dark:bg-[#3b211a]/95 dark:text-[#ffc1aa]"
      >
        ⚠️ {{ error }}
      </div>
    </div>
  </node-view-wrapper>
</template>
