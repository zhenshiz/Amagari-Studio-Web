<template>
  <node-view-wrapper class="relative my-6">
    <div
      class="overflow-hidden border-2 border-[var(--ink)] bg-[#171918] text-[#f2f1e8] shadow-[4px_4px_0_var(--ink)] transition-[outline] duration-100 dark:shadow-[4px_4px_0_#000]"
      :class="isFocused ? 'outline outline-2 outline-offset-2 outline-[#77d9ea]' : ''"
    >
      <div
        class="flex select-none items-center justify-between border-b-2 border-[#56605a] bg-[#232725] px-4 py-2"
      >
        <div class="flex items-center gap-3">
          <div class="mr-2 flex gap-1.5">
            <div class="size-2.5 bg-[#ff9b78]"></div>
            <div class="size-2.5 bg-[#d8f461]"></div>
            <div class="size-2.5 bg-[#77d9ea]"></div>
          </div>
          <span class="font-mono text-[10px] font-black uppercase tracking-widest text-[#d8f461]">
            {{ node.attrs.language || 'text' }}
          </span>
        </div>

        <button
          type="button"
          class="flex items-center gap-1.5 border border-[#7b847e] px-2 py-1 font-mono text-[11px] text-[#d5dad6] transition-colors hover:border-[#d8f461] hover:bg-[#d8f461] hover:text-[#172018]"
          @click="copyCode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          {{ copied ? tt('已复制') : tt('复制代码') }}
        </button>
      </div>

      <div class="relative overflow-x-auto bg-[#171918]">
        <code class="block min-w-full p-4 font-mono text-sm leading-6">
          <node-view-content />
        </code>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const props = defineProps(nodeViewProps)
const copied = ref(false)
const { tt } = useLocaleText()

const isFocused = computed(() => props.selected || false)

const copyCode = () => {
  const code = props.node.textContent
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
