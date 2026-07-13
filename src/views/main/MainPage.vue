<script setup>
import { computed } from 'vue'
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  FileText,
  Languages,
  MapPinned,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue'

import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { useCommunityDialog } from '@/composables/useCommunityDialog.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const bilibiliUrl = 'https://www.bilibili.com/video/BV12ZcEzJE1B/'
const bilibiliCover =
  'https://i1.hdslb.com/bfs/archive/fd23d87eb87925569c2947a38d80cbcd78f32c1e.jpg'

const { tt } = useLocaleText()
const { openCommunityDialog } = useCommunityDialog()

const studioHighlights = computed(() => [
  {
    icon: Languages,
    title: tt('地图汉化'),
    text: tt('文本、图片与游戏内体验'),
  },
  {
    icon: ShieldCheck,
    title: tt('授权优先'),
    text: tt('尊重作者与发布规则'),
  },
  {
    icon: Clapperboard,
    title: tt('中文宣传'),
    text: tt('让作品被更多玩家看见'),
  },
])

const workMeta = computed(() => [
  { label: tt('游戏版本'), value: 'Minecraft 1.21.11' },
  { label: tt('原作者'), value: 'Surena Studio' },
  { label: tt('发布时间'), value: '2026-02-13' },
])

const collaborationSteps = computed(() => [
  {
    step: '01',
    icon: ShieldCheck,
    title: tt('权限确认'),
    text: tt('开始前确认作品授权、可修改范围与发布方式，保护原作者和协作者。'),
  },
  {
    step: '02',
    icon: FileText,
    title: tt('翻译与校对'),
    text: tt('根据游戏语境统一术语，处理剧情、提示、图片文字并完成校对。'),
  },
  {
    step: '03',
    icon: Sparkles,
    title: tt('发布支持'),
    text: tt('准备中文介绍、视频与发布信息，让作品更顺畅地抵达中文玩家。'),
  },
])

const scrollToWorks = () => {
  document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="overflow-hidden">
    <section id="studio" class="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
      <div class="grid items-center gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:gap-10">
        <div>
          <div
            class="mb-5 inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-white px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0_var(--ink)] dark:bg-[#1d1f1e]"
          >
            <Blocks class="size-4" stroke-width="2.5" />
            {{ tt('Minecraft 本地化工作室') }}
          </div>

          <h1
            class="max-w-2xl text-balance font-mono text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-[56px]"
          >
            Amagari Studio
          </h1>

          <h2 class="mt-4 max-w-2xl text-xl font-black leading-8 sm:text-2xl">
            {{ tt('专注地图汉化，让优秀作品跨越语言抵达更多玩家。') }}
          </h2>

          <p
            class="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#536054] dark:text-[#b8bdb7] sm:text-base"
          >
            {{
              tt(
                '我们为 Minecraft 地图提供文本翻译、图片汉化、校对与中文发布支持，并始终尊重原作者的授权边界。',
              )
            }}
          </p>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PixelButton
              :text="tt('浏览汉化作品')"
              min-width="196px"
              bg-color="#d8f461"
              hover-bg-color="#ecff91"
              @click="scrollToWorks"
            >
              <template #left>
                <MapPinned class="size-4 shrink-0" stroke-width="2.5" />
              </template>
              <template #right>
                <ArrowRight class="size-4 shrink-0" stroke-width="2.5" />
              </template>
            </PixelButton>

            <PixelButton
              :text="tt('加入社区')"
              min-width="168px"
              bg-color="#77d9ea"
              hover-bg-color="#91e5f2"
              @click="openCommunityDialog"
            >
              <template #left>
                <MessageCircle class="size-4 shrink-0" stroke-width="2.5" />
              </template>
            </PixelButton>
          </div>

          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <PixelFrame
              v-for="item in studioHighlights"
              :key="item.title"
              bg-color="#ffffff"
              shadow-x="4px"
              shadow-y="4px"
            >
              <article class="flex h-full gap-3 px-3 py-3">
                <component :is="item.icon" class="mt-0.5 size-5 shrink-0" stroke-width="2.5" />
                <div>
                  <h3 class="font-mono text-sm font-black leading-tight">{{ item.title }}</h3>
                  <p class="mt-1 text-xs font-bold leading-5 text-[#5c685f] dark:text-[#b8bdb7]">
                    {{ item.text }}
                  </p>
                </div>
              </article>
            </PixelFrame>
          </div>
        </div>

        <div
          class="relative min-h-[340px] overflow-hidden border-[3px] border-[var(--ink)] bg-[#87d7e6] shadow-[7px_7px_0_var(--ink)] dark:bg-[#315d66] sm:min-h-[400px]"
          aria-hidden="true"
        >
          <div
            class="flex h-10 items-center justify-between border-b-[3px] border-[var(--ink)] bg-[#1f3339] px-3 font-mono text-[11px] font-black text-[#d7eff1]"
          >
            <span>AMAGARI_LOCALIZATION.EXE</span>
            <span class="flex gap-1.5">
              <i class="size-2 bg-[#d8f461]" />
              <i class="size-2 bg-[#77d9ea]" />
              <i class="size-2 bg-[#ff9b78]" />
            </span>
          </div>

          <div
            class="absolute left-[7%] top-[20%] size-12 bg-[#d8f461] shadow-[4px_4px_0_#172018]"
          />
          <div
            class="absolute right-[8%] top-[16%] h-10 w-20 bg-[#f7fbf2] shadow-[4px_4px_0_#172018]"
          />
          <div
            class="absolute right-[5%] top-[43%] size-14 bg-[#ff9b78] shadow-[4px_4px_0_#172018]"
          />

          <div
            class="absolute left-1/2 top-[48%] w-[76%] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#172018] bg-[#f8fbf2] p-4 text-[#172018] shadow-[7px_7px_0_#172018] sm:p-5"
          >
            <div class="flex items-center justify-between gap-3 border-b-2 border-[#172018] pb-3">
              <span class="font-mono text-xs font-black">SOURCE_EN_US</span>
              <ArrowRight class="size-5" stroke-width="2.5" />
              <span class="font-mono text-xs font-black">TARGET_ZH_CN</span>
            </div>

            <div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div class="grid gap-2">
                <span class="h-2 w-full bg-[#263b3f]" />
                <span class="h-2 w-4/5 bg-[#587174]" />
                <span class="h-2 w-2/3 bg-[#8ba0a2]" />
              </div>
              <Languages class="size-7" stroke-width="2.3" />
              <div class="grid gap-2">
                <span class="h-2 w-full bg-[#263b3f]" />
                <span class="h-2 w-3/4 bg-[#587174]" />
                <span class="h-2 w-5/6 bg-[#8ba0a2]" />
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 font-mono text-[10px] font-black">
              <span class="border-2 border-[#172018] bg-[#d8f461] px-2 py-1">TEXT</span>
              <span class="border-2 border-[#172018] bg-[#77d9ea] px-2 py-1">IMAGE</span>
              <span class="border-2 border-[#172018] bg-[#ff9b78] px-2 py-1">REVIEW</span>
            </div>
          </div>

          <div
            class="absolute inset-x-0 bottom-0 h-[72px] border-t-[3px] border-[#172018] bg-[#725038]"
          >
            <div class="h-4 bg-[#75a843]" />
            <div
              class="h-[55px] bg-[linear-gradient(90deg,#725038_25%,#61432f_25%,#61432f_50%,#725038_50%,#725038_75%,#61432f_75%)] bg-[length:40px_20px]"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      id="works"
      class="border-y-2 border-[var(--ink)] bg-[#edf3ec] px-4 py-10 dark:bg-[#171918] sm:px-5 lg:px-6 lg:py-12"
    >
      <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="font-mono text-xs font-black uppercase text-[#617065] dark:text-[#9fa9a1]">
              {{ tt('Featured Work') }}
            </p>
            <h2 class="mt-1 font-mono text-3xl font-black sm:text-4xl">
              {{ tt('地图汉化作品') }}
            </h2>
          </div>
          <p class="max-w-xl text-sm font-semibold leading-6 text-[#536054] dark:text-[#b8bdb7]">
            {{ tt('目前先展示已发布的地图汉化项目，后续会继续补充更多作品。') }}
          </p>
        </div>

        <article
          class="grid overflow-hidden border-[3px] border-[var(--ink)] bg-white shadow-[7px_7px_0_var(--ink)] dark:bg-[#1d1f1e] lg:grid-cols-[1.18fr_0.82fr]"
        >
          <a
            :href="bilibiliUrl"
            target="_blank"
            rel="noreferrer"
            class="group relative block overflow-hidden border-b-[3px] border-[var(--ink)] lg:border-b-0 lg:border-r-[3px]"
          >
            <img
              :src="bilibiliCover"
              :alt="tt('小鬼当“架”视频封面')"
              referrerpolicy="no-referrer"
              class="aspect-video size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span
              class="absolute bottom-3 left-3 inline-flex items-center gap-2 border-2 border-[#172018] bg-[#d8f461] px-3 py-2 font-mono text-xs font-black text-[#172018] shadow-[3px_3px_0_#172018]"
            >
              <Play class="size-4 fill-current" stroke-width="2" />
              BILIBILI · BV12ZcEzJE1B
            </span>
          </a>

          <div class="flex flex-col p-5 sm:p-6">
            <div class="flex flex-wrap gap-2">
              <span
                class="border-2 border-[var(--ink)] bg-[#d8f461] px-2 py-1 text-xs font-black text-[#172018]"
              >
                {{ tt('官方汉化发布') }}
              </span>
              <span
                class="border-2 border-[var(--ink)] bg-[#77d9ea] px-2 py-1 text-xs font-black text-[#172018]"
              >
                {{ tt('Minecraft 地图') }}
              </span>
            </div>

            <h3 class="mt-5 font-mono text-3xl font-black leading-tight">
              {{ tt('小鬼当“架”') }}
            </h3>
            <p class="mt-1 font-mono text-sm font-black text-[#657168] dark:text-[#adb5af]">
              From The shElves
            </p>
            <p class="mt-4 text-sm font-semibold leading-7 text-[#536054] dark:text-[#b8bdb7]">
              {{
                tt(
                  '节日前夜，误以为家中进贼的孩子撞上了正在准备惊喜的精灵，一场地图追逐小游戏就此开始。',
                )
              }}
            </p>

            <dl class="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div
                v-for="item in workMeta"
                :key="item.label"
                class="border-2 border-[var(--ink)] bg-[#f5f8f2] px-3 py-2 dark:bg-[#282b29]"
              >
                <dt class="text-[11px] font-black text-[#667169] dark:text-[#aeb5af]">
                  {{ item.label }}
                </dt>
                <dd class="mt-1 text-xs font-black">{{ item.value }}</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PixelButton
                :text="tt('观看发布视频')"
                :href="bilibiliUrl"
                target="_blank"
                rel="noreferrer"
                min-width="190px"
                bg-color="#77d9ea"
                hover-bg-color="#91e5f2"
              >
                <template #left>
                  <Play class="size-4 shrink-0 fill-current" stroke-width="2" />
                </template>
                <template #right>
                  <ExternalLink class="size-4 shrink-0" stroke-width="2.5" />
                </template>
              </PixelButton>
              <span class="text-xs font-bold text-[#6c776e] dark:text-[#9fa8a1]">
                {{ tt('封面来自该 Bilibili 视频') }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="collaboration" class="mx-auto max-w-6xl px-4 py-10 sm:px-5 lg:px-6 lg:py-12">
      <div class="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
        <div>
          <p class="font-mono text-xs font-black uppercase text-[#617065] dark:text-[#9fa9a1]">
            {{ tt('Collaboration') }}
          </p>
          <h2 class="mt-1 text-balance font-mono text-3xl font-black leading-tight sm:text-4xl">
            {{ tt('与创作者一起完成可靠的本地化') }}
          </h2>
          <p class="mt-4 text-sm font-semibold leading-7 text-[#536054] dark:text-[#b8bdb7]">
            {{ tt('从接入文本到中文发布，每一步都保持清晰、可确认，也尊重作品本来的表达。') }}
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <PixelFrame
            v-for="item in collaborationSteps"
            :key="item.step"
            bg-color="#ffffff"
            shadow-x="4px"
            shadow-y="4px"
          >
            <article class="h-full p-4">
              <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-2xl font-black">{{ item.step }}</span>
                <component :is="item.icon" class="size-6" stroke-width="2.5" />
              </div>
              <h3 class="mt-5 font-mono text-lg font-black">{{ item.title }}</h3>
              <p class="mt-3 text-sm font-semibold leading-6 text-[#536054] dark:text-[#b8bdb7]">
                {{ item.text }}
              </p>
            </article>
          </PixelFrame>
        </div>
      </div>

      <div
        class="mt-8 grid gap-5 border-[3px] border-[var(--ink)] bg-[#d8f461] p-5 text-[#172018] shadow-[6px_6px_0_var(--ink)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
      >
        <div>
          <div class="flex items-center gap-2 font-mono text-xs font-black uppercase">
            <CheckCircle2 class="size-4" stroke-width="2.5" />
            {{ tt('Open Collaboration') }}
          </div>
          <h3 class="mt-2 font-mono text-2xl font-black">
            {{ tt('有地图汉化需求或想加入协作？') }}
          </h3>
          <p class="mt-2 max-w-2xl text-sm font-bold leading-6">
            {{ tt('带上作品信息、授权情况或你的特长，到社区里和我们聊聊。') }}
          </p>
        </div>

        <PixelButton
          :text="tt('加入社区')"
          min-width="176px"
          bg-color="#ffffff"
          hover-bg-color="#f4f7ef"
          @click="openCommunityDialog"
        >
          <template #left>
            <MessageCircle class="size-4 shrink-0" stroke-width="2.5" />
          </template>
          <template #right>
            <ArrowRight class="size-4 shrink-0" stroke-width="2.5" />
          </template>
        </PixelButton>
      </div>
    </section>
  </main>
</template>
