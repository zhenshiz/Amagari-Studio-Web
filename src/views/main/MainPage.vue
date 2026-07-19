<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  ExternalLink,
  FileText,
  ImageOff,
  Languages,
  MapPinned,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue'

import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { maps } from '@/assets/info/map.js'
import { useCommunityDialog } from '@/composables/useCommunityDialog.js'
import { getBilibiliCover } from '@/utils/getBilibiliCover.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const CAROUSEL_INTERVAL = 6000
const featuredMaps = [...maps]
  .sort((firstMap, secondMap) => secondMap.lastUpdated.localeCompare(firstMap.lastUpdated))
  .slice(0, 3)

const { tt } = useLocaleText()
const { openCommunityDialog } = useCommunityDialog()
const selectedWorkIndex = ref(0)
const isCarouselPaused = ref(false)
const coverUrls = ref({})
const resolvedCoverIds = ref(new Set())
let carouselTimer

const selectedWork = computed(() => featuredMaps[selectedWorkIndex.value] || featuredMaps[0])
const selectedBilibiliUrl = computed(
  () => `https://www.bilibili.com/video/${selectedWork.value.bvid}/`,
)

const selectWork = (index) => {
  selectedWorkIndex.value = index
}

const showPreviousWork = () => {
  selectedWorkIndex.value =
    (selectedWorkIndex.value - 1 + featuredMaps.length) % featuredMaps.length
}

const showNextWork = () => {
  selectedWorkIndex.value = (selectedWorkIndex.value + 1) % featuredMaps.length
}

const markCoverFailed = (mapId) => {
  coverUrls.value = { ...coverUrls.value, [mapId]: '' }
}

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
  { label: tt('游戏版本'), value: `Minecraft ${selectedWork.value.gameVersion}` },
  { label: tt('原作者'), value: selectedWork.value.author },
  { label: tt('最后更新'), value: selectedWork.value.lastUpdated },
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

onMounted(() => {
  featuredMaps.forEach(async (map) => {
    const coverUrl = await getBilibiliCover(map.bvid)

    coverUrls.value = { ...coverUrls.value, [map.id]: coverUrl }
    resolvedCoverIds.value = new Set([...resolvedCoverIds.value, map.id])
  })

  carouselTimer = window.setInterval(() => {
    if (!isCarouselPaused.value) showNextWork()
  }, CAROUSEL_INTERVAL)
})

onBeforeUnmount(() => {
  window.clearInterval(carouselTimer)
})
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
        <div class="mb-6">
          <div>
            <p class="font-mono text-xs font-black uppercase text-[#617065] dark:text-[#9fa9a1]">
              {{ tt('Featured Work') }}
            </p>
            <h2 class="mt-1 font-mono text-3xl font-black sm:text-4xl">
              {{ tt('地图汉化作品') }}
            </h2>
          </div>
        </div>

        <article
          class="grid overflow-hidden border-[3px] border-[var(--ink)] bg-white shadow-[7px_7px_0_var(--ink)] dark:bg-[#1d1f1e] lg:grid-cols-[1.18fr_0.82fr]"
          @mouseenter="isCarouselPaused = true"
          @mouseleave="isCarouselPaused = false"
          @focusin="isCarouselPaused = true"
          @focusout="isCarouselPaused = false"
        >
          <div
            class="group relative block aspect-video overflow-hidden border-b-[3px] border-[var(--ink)] bg-[#77d9ea] lg:aspect-auto lg:min-h-[390px] lg:border-b-0 lg:border-r-[3px]"
          >
            <a
              :href="selectedBilibiliUrl"
              target="_blank"
              rel="noreferrer"
              class="absolute inset-0"
              :aria-label="`${tt('观看发布视频')}：${tt(selectedWork.name)}`"
            >
              <Transition
                mode="out-in"
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div :key="selectedWork.id" class="absolute inset-0">
                  <img
                    v-if="coverUrls[selectedWork.id]"
                    :src="coverUrls[selectedWork.id]"
                    :alt="`${tt(selectedWork.name)} ${tt('视频封面')}`"
                    referrerpolicy="no-referrer"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    @error="markCoverFailed(selectedWork.id)"
                  />
                  <span
                    v-else
                    class="pixel-grid grid size-full place-items-center text-[#172018] dark:bg-[#315d66]"
                  >
                    <span
                      v-if="!resolvedCoverIds.has(selectedWork.id)"
                      class="size-8 animate-pulse bg-[#d8f461] shadow-[4px_4px_0_#172018]"
                    />
                    <span
                      v-else
                      class="grid size-14 place-items-center border-2 border-[#172018] bg-white shadow-[4px_4px_0_#172018]"
                    >
                      <ImageOff class="size-6" stroke-width="2.5" />
                    </span>
                  </span>
                </div>
              </Transition>
            </a>

            <a
              :href="selectedBilibiliUrl"
              target="_blank"
              rel="noreferrer"
              class="absolute bottom-3 left-3 inline-flex items-center gap-2 border-2 border-[#172018] bg-[#d8f461] px-3 py-2 font-mono text-xs font-black text-[#172018] shadow-[3px_3px_0_#172018]"
            >
              <Play class="size-4 fill-current" stroke-width="2" />
              BILIBILI · {{ selectedWork.bvid }}
            </a>

            <span class="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                class="grid size-9 place-items-center border-2 border-[#172018] bg-white text-[#172018] shadow-[3px_3px_0_#172018] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                :aria-label="tt('上一页')"
                @click="showPreviousWork"
              >
                <ChevronLeft class="size-5" stroke-width="3" />
              </button>
              <button
                type="button"
                class="grid size-9 place-items-center border-2 border-[#172018] bg-white text-[#172018] shadow-[3px_3px_0_#172018] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                :aria-label="tt('下一页')"
                @click="showNextWork"
              >
                <ChevronRight class="size-5" stroke-width="3" />
              </button>
            </span>
          </div>

          <div class="flex min-w-0 flex-col p-5 sm:p-6" aria-live="polite">
            <div class="flex items-start justify-between gap-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="selectedWork.isOfficialLocalization"
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

              <div class="flex shrink-0 gap-1.5">
                <button
                  v-for="(map, index) in featuredMaps"
                  :key="map.id"
                  type="button"
                  class="h-3 border-2 border-[var(--ink)] transition-[width,background-color]"
                  :class="
                    selectedWorkIndex === index
                      ? 'w-8 bg-[#d8f461]'
                      : 'w-3 bg-white dark:bg-[#343836]'
                  "
                  :aria-pressed="selectedWorkIndex === index"
                  :aria-label="`${tt('地图汉化作品')} ${index + 1}：${tt(map.name)}`"
                  @click="selectWork(index)"
                />
              </div>
            </div>

            <h3 class="mt-5 font-mono text-3xl font-black leading-tight">
              {{ tt(selectedWork.name) }}
            </h3>
            <p class="mt-1 font-mono text-sm font-black text-[#657168] dark:text-[#adb5af]">
              {{ selectedWork.subtitle }}
            </p>
            <p class="mt-4 text-sm font-semibold leading-7 text-[#536054] dark:text-[#b8bdb7]">
              {{ tt(selectedWork.description) }}
            </p>

            <dl class="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div
                v-for="item in workMeta"
                :key="item.label"
                class="min-w-0 border-2 border-[var(--ink)] bg-[#f5f8f2] px-3 py-2 dark:bg-[#282b29]"
              >
                <dt class="text-[11px] font-black text-[#667169] dark:text-[#aeb5af]">
                  {{ item.label }}
                </dt>
                <dd class="mt-1 break-words text-xs font-black">{{ item.value }}</dd>
              </div>
            </dl>

            <div class="mt-6">
              <PixelButton
                :text="tt('观看发布视频')"
                :href="selectedBilibiliUrl"
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
