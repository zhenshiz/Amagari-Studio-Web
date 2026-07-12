<template>
  <node-view-wrapper class="steps-wrapper my-8">
    <div
      class="steps-main-container border-2 border-[var(--ink)] bg-[#f5f8f2] p-4 shadow-[4px_4px_0_var(--ink)] transition-colors dark:bg-[#222422] dark:shadow-[4px_4px_0_#000]"
    >
      <div class="mb-6 flex select-none items-center justify-center gap-4">
        <div v-for="(_, index) in stepCount" :key="index" class="flex flex-1 items-center">
          <div
            class="flex size-10 cursor-pointer items-center justify-center border-2 border-[var(--ink)] font-mono font-black transition-colors"
            :class="
              currentStep === index
                ? 'bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_var(--ink)]'
                : 'bg-white text-[#687269] dark:bg-[#1d1f1e] dark:text-[#b8bdb7]'
            "
            @click.stop="selectStep(index)"
          >
            {{ index + 1 }}
          </div>
          <div v-if="index < stepCount - 1" class="mx-2 h-0.5 flex-1 bg-[var(--ink)]"></div>
        </div>
      </div>

      <div class="steps-content-area min-h-[120px]">
        <node-view-content class="steps-mount-point" :data-active-index="currentStep" />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, ref } from 'vue'

const props = defineProps(nodeViewProps)

const stepCount = computed(() => props.node.childCount)
const readOnlyStep = ref(0)
const currentStep = computed(() => readOnlyStep.value)

const selectStep = (index) => {
  readOnlyStep.value = index
}
</script>

<style lang="scss" scoped>
.steps-mount-point {
  display: block;
  position: relative;

  :deep(> *) {
    display: none !important;
  }

  /* 使用属性选择器精准控制当前步骤显示 */
  @for $i from 0 through 15 {
    &[data-active-index='#{$i}'] {
      :deep(> *:nth-child(#{$i + 1})) {
        display: block !important;
        animation: stepFadeIn 0.3s ease-out;
      }
    }
  }
}

/* 深色模式样式优化 */
:deep([data-type='step-item']) {
  @apply border-2 border-[var(--ink)] bg-white transition-colors;
  @apply dark:bg-[#1d1f1e];

  [data-type='admonition-title'] {
    @apply border-b-2 border-[var(--ink)] bg-[#d8f461] px-4 py-2 font-mono text-sm font-black text-[#172018];
  }

  [data-type='admonition-content'] {
    @apply min-h-[80px] p-4 text-[#536054] dark:text-[#b8bdb7];
    outline: none !important;
  }
}

@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
