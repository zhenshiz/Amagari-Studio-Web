<script setup>
import { computed, ref } from 'vue'

import enUS from '@/assets/tools/en-US.md?raw'
import zhCN from '@/assets/tools/zh-CN.md?raw'
import zhTW from '@/assets/tools/zh-TW.md?raw'
import MarkDownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const markdownByLanguage = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
}

const { activeLanguage, tt } = useLocaleText()
const markdownRenderer = ref(null)

const markdown = computed(() => markdownByLanguage[activeLanguage.value] || zhCN)
const tocHeadings = computed(() => markdownRenderer.value?.headings || [])

const scrollToHeading = (id) => {
  markdownRenderer.value?.scrollToHeading(id)
}
</script>

<template>
  <main class="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-4 py-7 sm:px-5 sm:py-9 lg:px-6">
    <div class="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_240px]">
      <PixelFrame tag="article" bg-color="#ffffff" shadow-x="6px" shadow-y="6px" class="min-w-0">
        <MarkDownReadOnly :key="activeLanguage" ref="markdownRenderer" :content="markdown" />
      </PixelFrame>

      <aside v-if="tocHeadings.length" class="hidden xl:block">
        <nav
          class="fixed right-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] top-20 max-h-[calc(100vh-6.5rem)] w-[240px] overflow-y-auto border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[4px_4px_0_#000]"
          :aria-label="tt('文档目录')"
        >
          <p
            class="mb-3 border-b-2 border-[var(--ink)] pb-2 font-mono text-xs font-black uppercase"
          >
            {{ tt('文档目录') }}
          </p>
          <ul class="grid gap-1">
            <li v-for="heading in tocHeadings" :key="`${heading.id}-${heading.pos}`">
              <a
                :href="`#${heading.id}`"
                class="block border-l-2 py-1.5 pr-1 text-xs font-bold leading-5 transition-colors"
                :class="
                  heading.isActive && !heading.isScrolledOver
                    ? 'border-[#668b2b] bg-[#eef6cd] text-[#314611] dark:border-[#d8f461] dark:bg-[#30381d] dark:text-[#e9ffa1]'
                    : 'border-transparent text-[#657168] hover:border-[var(--ink)] hover:text-[var(--ink)] dark:text-[#adb5af]'
                "
                :style="{ paddingLeft: `${Math.max(0, heading.level - 1) * 10 + 8}px` }"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.textContent }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </main>
</template>
