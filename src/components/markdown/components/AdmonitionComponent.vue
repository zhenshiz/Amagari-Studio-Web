<template>
  <node-view-wrapper class="admonition-wrapper my-5">
    <div
      class="admonition-container border-2 shadow-[4px_4px_0_var(--ink)] transition-colors duration-100"
      :class="[theme.container, theme.textColor]"
    >
      <div class="admo-icon-fixed pointer-events-none flex items-center px-4 py-2">
        <component :is="theme.icon" class="mr-2 size-5" stroke-width="2.5" />
      </div>

      <node-view-content class="admo-editor-root" />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'
import { CircleAlert, Info, TriangleAlert } from '@lucide/vue'

const props = defineProps(nodeViewProps)

const themeMap = {
  info: {
    container: 'bg-[#eaf8fb] border-[#24798a] dark:bg-[#183238] dark:border-[#77d9ea]',
    textColor: 'text-[#1c5f6c] dark:text-[#aeeaf3]',
    icon: Info,
  },
  warning: {
    container: 'bg-[#fff0eb] border-[#c45d3b] dark:bg-[#3b211a] dark:border-[#ff9b78]',
    textColor: 'text-[#8f3e26] dark:text-[#ffc1aa]',
    icon: TriangleAlert,
  },
  important: {
    container: 'bg-[#f3fad2] border-[#668b2b] dark:bg-[#2d3519] dark:border-[#d8f461]',
    textColor: 'text-[#49651f] dark:text-[#e9ffa1]',
    icon: CircleAlert,
  },
}

const theme = computed(() => themeMap[props.node.attrs.type] || themeMap.info)
</script>

<style lang="scss" scoped>
.admonition-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.admo-icon-fixed {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  color: currentColor;
}

:deep(.admo-editor-root) {
  display: flex;
  flex-direction: column;
  color: inherit;

  & > [data-type='admonition-title'] {
    padding: 0.5rem 1rem 0.5rem 3rem;
    font-weight: bold;
    outline: none;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    color: inherit;
    border-bottom: 1px solid rgba(var(--border-color, 0, 0, 0), 0.1);
  }

  & > [data-type='admonition-content'] {
    padding: 0.75rem 1rem;
    font-size: 14px;
    line-height: 1.6;
    outline: none;
    min-height: 3rem;
    color: inherit; // 正文也使用匹配的颜色

    p {
      color: inherit;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
