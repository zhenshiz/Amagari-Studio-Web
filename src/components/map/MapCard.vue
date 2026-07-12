<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, CalendarDays, ImageOff } from '@lucide/vue'

import { MapLoader, MaintenanceStatus } from '@/assets/info/map.js'
import { getBilibiliCover } from '@/utils/getBilibiliCover.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
})

const { activeLanguage, tt } = useLocaleText()

const coverUrl = ref('')
const coverFailed = ref(false)
const isCoverLoading = ref(true)

const loaderMeta = computed(() => MapLoader.getMeta(props.map.loader) || {})
const statusMeta = computed(() => MaintenanceStatus.getMeta(props.map.maintenanceStatus) || {})
const detailUrl = computed(() => `/map/${encodeURIComponent(props.map.id)}`)

const formattedDate = computed(() => {
  const date = new Date(`${props.map.lastUpdated}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return props.map.lastUpdated
  }

  return new Intl.DateTimeFormat(activeLanguage.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
})

watch(
  () => props.map.bvid,
  async (bvid) => {
    coverUrl.value = ''
    coverFailed.value = false
    isCoverLoading.value = true

    const resolvedCover = await getBilibiliCover(bvid)

    if (bvid === props.map.bvid) {
      coverUrl.value = resolvedCover
      isCoverLoading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <RouterLink
    :to="detailUrl"
    class="group block border-[3px] border-[var(--ink)] bg-white shadow-[6px_6px_0_var(--ink)] transition-[transform,box-shadow] duration-100 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[6px_6px_0_#000] dark:hover:shadow-[8px_8px_0_#000]"
    :aria-label="`${tt('查看地图详情')}：${tt(map.name)}`"
  >
    <article class="grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[168px_minmax(0,1fr)]">
      <div class="p-3 sm:p-4">
        <div
          class="relative aspect-square overflow-hidden border-2 border-[var(--ink)] bg-[#77d9ea] shadow-[3px_3px_0_var(--ink)]"
        >
          <img
            v-if="coverUrl && !coverFailed"
            :src="coverUrl"
            :alt="`${tt(map.name)} ${tt('视频封面')}`"
            referrerpolicy="no-referrer"
            class="absolute inset-0 size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            @error="coverFailed = true"
          />

          <div v-else class="pixel-grid absolute inset-0 grid place-items-center text-[#172018]">
            <span
              class="grid size-10 place-items-center border-2 border-[#172018] bg-[#f8fbf2] shadow-[3px_3px_0_#172018]"
            >
              <span v-if="isCoverLoading" class="size-4 animate-pulse bg-[#d8f461]" />
              <ImageOff v-else class="size-5" stroke-width="2.5" />
            </span>
          </div>
        </div>
      </div>

      <div class="flex min-w-0 flex-col p-3 pl-1 sm:p-5 sm:pl-2">
        <div class="flex min-w-0 items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate font-mono text-lg font-black leading-tight sm:text-2xl">
              {{ tt(map.name) }}
            </h2>
            <p
              class="mt-1 truncate font-mono text-[11px] font-black text-[#657168] dark:text-[#adb5af] sm:text-xs"
            >
              {{ map.subtitle }}
            </p>
          </div>
          <ArrowRight
            class="mt-0.5 size-5 shrink-0 transition-transform group-hover:translate-x-1"
            stroke-width="2.5"
          />
        </div>

        <p
          class="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[#536054] dark:text-[#b8bdb7] sm:mt-3 sm:text-sm sm:leading-6"
        >
          {{ tt(map.description) }}
        </p>

        <div class="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          <span
            class="border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-black sm:text-[11px]"
            :style="{
              backgroundColor: statusMeta.background,
              color: statusMeta.foreground,
            }"
          >
            {{ tt(statusMeta.label) }}
          </span>
          <span
            class="inline-flex items-center gap-1 border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-black sm:text-[11px]"
            :style="{
              backgroundColor: loaderMeta.background,
              color: loaderMeta.foreground,
            }"
          >
            <img :src="loaderMeta.icon" alt="" class="size-3.5 [image-rendering:pixelated]" />
            {{ tt(loaderMeta.label) }}
          </span>
          <span
            class="border-2 border-[var(--ink)] bg-[#d8f461] px-2 py-1 text-[10px] font-black text-[#172018] sm:text-[11px]"
          >
            MC {{ map.gameVersion }}
          </span>
        </div>

        <div
          class="mt-auto flex items-center gap-1.5 pt-3 text-[10px] font-black text-[#68746b] dark:text-[#a8b0aa] sm:text-xs"
        >
          <CalendarDays class="size-3.5 shrink-0" stroke-width="2.4" />
          <span>{{ tt('最后更新') }}：{{ formattedDate }}</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>
