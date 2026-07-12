<script setup>
import { ExternalLink, Hash, MessageCircle, Play, Users } from '@lucide/vue'

import bilibiliIcon from '@/assets/icons/sites/bilibili.svg'
import { communityInfo } from '@/assets/info/community.js'
import Modal from '@/components/Modal.vue'
import PixelButton from '@/components/PixelButton.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show'])
const { tt } = useLocaleText()
</script>

<template>
  <Modal
    :show="show"
    width="700px"
    :title="tt('加入社区')"
    :aria-label="tt('加入社区')"
    @update:show="emit('update:show', $event)"
  >
    <p class="mb-5 text-sm font-semibold leading-7 text-[#59645b] dark:text-[#b8bdb7]">
      {{ tt('选择你常用的平台，关注工作室动态或参与地图汉化协作。') }}
    </p>

    <div class="grid gap-4 md:grid-cols-2">
      <section
        class="border-[3px] border-[var(--ink)] bg-[#dff6ff] p-4 text-[#172018] shadow-[5px_5px_0_var(--ink)] md:row-span-2 dark:bg-[#20404a] dark:text-[#f2f1e8] dark:shadow-[5px_5px_0_#000]"
      >
        <div class="flex items-start gap-3">
          <span
            class="grid size-11 shrink-0 place-items-center border-2 border-[#172018] bg-[#77d9ea] text-[#172018] shadow-[3px_3px_0_#172018]"
          >
            <Users class="size-5" stroke-width="2.5" />
          </span>
          <div>
            <h3 class="font-mono text-lg font-black">{{ tt('QQ 交流群') }}</h3>
            <p class="mt-1 text-xs font-bold leading-5 text-[#53665b] dark:text-[#c3cec6]">
              {{ tt('中文交流、项目反馈和协作讨论的主要社区。') }}
            </p>
          </div>
        </div>

        <div
          class="mt-5 border-2 border-[#172018] bg-white p-3 text-[#172018] dark:bg-[#182c32] dark:text-[#f2f1e8]"
        >
          <div
            class="flex items-center gap-2 text-xs font-black text-[#657168] dark:text-[#b8c3bb]"
          >
            <Hash class="size-4" stroke-width="2.5" />
            {{ tt('QQ 群号') }}
          </div>
          <code class="mt-2 block select-all font-mono text-2xl font-black tracking-wider">
            {{ communityInfo.qq.groupNumber }}
          </code>
        </div>

        <PixelButton
          class="mt-4"
          :text="tt('打开 QQ 申请加入')"
          :href="communityInfo.qq.joinUrl"
          width="100%"
          bg-color="#77d9ea"
          hover-bg-color="#91e5f2"
        >
          <template #left>
            <MessageCircle class="size-4" stroke-width="2.5" />
          </template>
          <template #right>
            <ExternalLink class="size-4" stroke-width="2.5" />
          </template>
        </PixelButton>

        <p class="mt-4 text-xs font-bold leading-5 text-[#5d6c62] dark:text-[#bdc8c0]">
          {{ tt('如果 QQ 加群页面无法打开，请在 QQ 中搜索上方群号。') }}
        </p>
      </section>

      <section
        class="border-[3px] border-[var(--ink)] bg-[#eef0ff] p-4 text-[#172018] shadow-[5px_5px_0_var(--ink)] dark:bg-[#292d4d] dark:text-[#f2f1e8] dark:shadow-[5px_5px_0_#000]"
      >
        <div class="flex items-center gap-3">
          <span
            class="grid size-10 shrink-0 place-items-center border-2 border-[#172018] bg-[#8993f5] text-[#172018] shadow-[3px_3px_0_#172018]"
          >
            <MessageCircle class="size-5" stroke-width="2.5" />
          </span>
          <div class="min-w-0">
            <h3 class="font-mono text-base font-black">{{ tt('Discord 社区') }}</h3>
            <p class="mt-1 text-xs font-bold text-[#626a76] dark:text-[#bdc1d8]">
              {{ tt('参与海外社区交流与项目协作。') }}
            </p>
          </div>
        </div>

        <PixelButton
          class="mt-4"
          :text="tt('前往 Discord')"
          :href="communityInfo.discord.url"
          target="_blank"
          rel="noopener noreferrer"
          width="100%"
          bg-color="#8993f5"
          hover-bg-color="#a6adff"
        >
          <template #right>
            <ExternalLink class="size-4" stroke-width="2.5" />
          </template>
        </PixelButton>
      </section>

      <section
        class="border-[3px] border-[var(--ink)] bg-[#fff0f5] p-4 text-[#172018] shadow-[5px_5px_0_var(--ink)] dark:bg-[#492b35] dark:text-[#f2f1e8] dark:shadow-[5px_5px_0_#000]"
      >
        <div class="flex items-center gap-3">
          <span
            class="grid size-10 shrink-0 place-items-center border-2 border-[#172018] bg-[#fb7299] text-[#172018] shadow-[3px_3px_0_#172018]"
          >
            <img :src="bilibiliIcon" alt="" class="size-6 [image-rendering:pixelated]" />
          </span>
          <div class="min-w-0">
            <h3 class="font-mono text-base font-black">{{ tt('Bilibili 官号') }}</h3>
            <p class="mt-1 truncate text-xs font-bold text-[#75636a] dark:text-[#d2bdc4]">
              {{ communityInfo.bilibili.name }}
            </p>
          </div>
        </div>

        <PixelButton
          class="mt-4"
          :text="tt('查看 Bilibili 主页')"
          :href="communityInfo.bilibili.url"
          target="_blank"
          rel="noopener noreferrer"
          width="100%"
          bg-color="#fb7299"
          hover-bg-color="#ff91b0"
        >
          <template #left>
            <Play class="size-4 fill-current" stroke-width="2" />
          </template>
          <template #right>
            <ExternalLink class="size-4" stroke-width="2.5" />
          </template>
        </PixelButton>
      </section>
    </div>
  </Modal>
</template>
