<script setup>
import { Home, SearchX } from '@lucide/vue'

import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const { tt } = useLocaleText()
</script>

<template>
  <main class="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
    <PixelFrame bg-color="#ffffff" shadow-x="6px" shadow-y="6px" class="w-full max-w-xl">
      <section class="p-6 text-center sm:p-8">
        <div
          class="mx-auto mb-5 grid size-14 place-items-center border-2 border-[var(--ink)] bg-[var(--leaf)]"
        >
          <SearchX class="size-7" stroke-width="2.5" />
        </div>

        <p class="font-mono text-5xl font-black leading-none">404</p>
        <h1 class="mt-3 font-mono text-2xl font-black">{{ tt('这个方块还没生成') }}</h1>
        <p class="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[#536054]">
          {{ tt('当前页面不存在，返回首页继续浏览 Amagari Studio 的内容。') }}
        </p>

        <div class="mt-6 flex justify-center">
          <PixelButton :text="tt('返回首页')" to="/" min-width="150px">
            <template #left>
              <Home class="size-4 shrink-0" stroke-width="2.5" />
            </template>
          </PixelButton>
        </div>
      </section>
    </PixelFrame>
  </main>
</template>
