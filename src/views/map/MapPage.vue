<script setup>
import { computed, ref, watch } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Filter,
  MapPinned,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from '@lucide/vue'

import { MaintenanceStatus, MapLoader, maps } from '@/assets/info/map.js'
import MapCard from '@/components/map/MapCard.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import PixelSelect from '@/components/PixelSelect.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const ALL = 'ALL'

const { activeLanguage, tt } = useLocaleText()

const searchQuery = ref('')
const selectedVersion = ref(ALL)
const selectedLoader = ref(ALL)
const selectedStatus = ref(ALL)
const selectedOfficial = ref(ALL)
const sortBy = ref('UPDATED_DESC')
const pageSize = ref(12)
const currentPage = ref(1)
const isFilterOpen = ref(false)

const sortOptions = computed(() => [
  { value: 'UPDATED_DESC', label: tt('更新时间（新到旧）') },
  { value: 'UPDATED_ASC', label: tt('更新时间（旧到新）') },
  { value: 'VERSION_DESC', label: tt('MC 版本（新到旧）') },
  { value: 'VERSION_ASC', label: tt('MC 版本（旧到新）') },
  { value: 'NAME_ASC', label: tt('地图名称（A-Z）') },
])

const pageSizeOptions = [
  { value: 6, label: '6' },
  { value: 12, label: '12' },
  { value: 24, label: '24' },
]

const versionOptions = computed(() => {
  const counts = new Map()
  maps.forEach((map) => counts.set(map.gameVersion, (counts.get(map.gameVersion) || 0) + 1))

  const collator = new Intl.Collator(activeLanguage.value, { numeric: true })
  const versions = [...counts.entries()]
    .sort(([versionA], [versionB]) => collator.compare(versionB, versionA))
    .map(([value, count]) => ({ value, label: value, count }))

  return [{ value: ALL, label: tt('全部版本'), count: maps.length }, ...versions]
})

const loaderOptions = computed(() => [
  { value: ALL, label: tt('全部加载器'), count: maps.length },
  ...MapLoader.values().map((option) => ({
    ...option,
    label: tt(option.label),
    count: maps.filter((map) => map.loader === option.value).length,
  })),
])

const statusOptions = computed(() => [
  { value: ALL, label: tt('全部状态'), count: maps.length },
  ...MaintenanceStatus.values().map((option) => ({
    ...option,
    label: tt(option.label),
    count: maps.filter((map) => map.maintenanceStatus === option.value).length,
  })),
])

const officialOptions = computed(() => [
  { value: ALL, label: tt('全部授权类型'), count: maps.length },
  {
    value: 'OFFICIAL',
    label: tt('官方汉化'),
    count: maps.filter((map) => map.isOfficialLocalization).length,
  },
  {
    value: 'COMMUNITY',
    label: tt('社区汉化'),
    count: maps.filter((map) => !map.isOfficialLocalization).length,
  },
])

const filteredMaps = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase(activeLanguage.value)

  return maps.filter((map) => {
    const searchableText = [
      map.name,
      map.subtitle,
      map.description,
      map.author,
      map.bvid,
      map.gameVersion,
    ]
      .join(' ')
      .toLocaleLowerCase(activeLanguage.value)

    return (
      (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
      (selectedVersion.value === ALL || map.gameVersion === selectedVersion.value) &&
      (selectedLoader.value === ALL || map.loader === selectedLoader.value) &&
      (selectedStatus.value === ALL || map.maintenanceStatus === selectedStatus.value) &&
      (selectedOfficial.value === ALL ||
        (selectedOfficial.value === 'OFFICIAL' && map.isOfficialLocalization) ||
        (selectedOfficial.value === 'COMMUNITY' && !map.isOfficialLocalization))
    )
  })
})

const sortedMaps = computed(() => {
  const nextMaps = [...filteredMaps.value]
  const collator = new Intl.Collator(activeLanguage.value, { numeric: true })

  if (sortBy.value === 'UPDATED_ASC') {
    return nextMaps.sort((mapA, mapB) => mapA.lastUpdated.localeCompare(mapB.lastUpdated))
  }

  if (sortBy.value === 'NAME_ASC') {
    return nextMaps.sort((mapA, mapB) => collator.compare(tt(mapA.name), tt(mapB.name)))
  }

  if (sortBy.value === 'VERSION_DESC') {
    return nextMaps.sort((mapA, mapB) => collator.compare(mapB.gameVersion, mapA.gameVersion))
  }

  if (sortBy.value === 'VERSION_ASC') {
    return nextMaps.sort((mapA, mapB) => collator.compare(mapA.gameVersion, mapB.gameVersion))
  }

  return nextMaps.sort((mapA, mapB) => mapB.lastUpdated.localeCompare(mapA.lastUpdated))
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedMaps.value.length / pageSize.value)))
const pageStart = computed(() =>
  sortedMaps.value.length ? (currentPage.value - 1) * pageSize.value + 1 : 0,
)
const pageEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, sortedMaps.value.length),
)
const paginatedMaps = computed(() =>
  sortedMaps.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value,
  ),
)

const hasActiveFilters = computed(
  () =>
    searchQuery.value.trim() ||
    selectedVersion.value !== ALL ||
    selectedLoader.value !== ALL ||
    selectedStatus.value !== ALL ||
    selectedOfficial.value !== ALL,
)

const resetFilters = () => {
  searchQuery.value = ''
  selectedVersion.value = ALL
  selectedLoader.value = ALL
  selectedStatus.value = ALL
  selectedOfficial.value = ALL
}

watch(
  [
    searchQuery,
    selectedVersion,
    selectedLoader,
    selectedStatus,
    selectedOfficial,
    sortBy,
    pageSize,
  ],
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (nextTotalPages) => {
  currentPage.value = Math.min(currentPage.value, nextTotalPages)
})
</script>

<template>
  <main class="min-h-[calc(100vh-60px)] pb-14">
    <section
      class="pixel-grid border-b-[3px] border-[var(--ink)] bg-[#dcefb4] text-[#172018] dark:bg-[#26372c] dark:text-[#f2f1e8]"
    >
      <div
        class="mx-auto grid max-w-[1440px] gap-6 px-4 py-9 sm:px-6 sm:py-11 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <div
            class="mb-4 inline-flex items-center gap-2 border-2 border-[#172018] bg-[#f8fbf2] px-3 py-1.5 font-mono text-[11px] font-black uppercase text-[#172018] shadow-[3px_3px_0_#172018]"
          >
            <Database class="size-4" stroke-width="2.5" />
            AMAGARI · MAP LIBRARY
          </div>
          <h1 class="font-mono text-3xl font-black leading-tight sm:text-5xl">
            {{ tt('地图汉化') }}
          </h1>
          <p class="mt-3 max-w-2xl text-sm font-bold leading-7 opacity-75 sm:text-base">
            {{ tt('浏览已发布的地图汉化，点击地图卡片查看完整介绍、汉化内容与发布信息。') }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
            class="border-2 border-[#172018] bg-[#f8fbf2] px-4 py-3 text-[#172018] shadow-[4px_4px_0_#172018]"
          >
            <strong class="block font-mono text-2xl font-black">{{ maps.length }}</strong>
            <span class="text-[11px] font-black">{{ tt('汉化地图') }}</span>
          </div>
          <div
            class="border-2 border-[#172018] bg-[#77d9ea] px-4 py-3 text-[#172018] shadow-[4px_4px_0_#172018]"
          >
            <strong class="block font-mono text-2xl font-black">
              {{ maps.filter((map) => map.isOfficialLocalization).length }}
            </strong>
            <span class="text-[11px] font-black">{{ tt('官方授权') }}</span>
          </div>
          <div
            class="col-span-2 border-2 border-[#172018] bg-[#ff9b78] px-4 py-3 text-[#172018] shadow-[4px_4px_0_#172018] sm:col-span-1"
          >
            <strong class="block font-mono text-2xl font-black">
              {{ new Set(maps.map((map) => map.gameVersion)).size }}
            </strong>
            <span class="text-[11px] font-black">{{ tt('游戏版本') }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:py-9">
      <div
        class="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[312px_minmax(0,1fr)]"
      >
        <PixelFrame bg-color="#ffffff" shadow-x="5px" shadow-y="5px" class="lg:sticky lg:top-20">
          <aside class="p-3 sm:p-4" :aria-label="tt('筛选地图')">
            <div class="flex items-center justify-between gap-3">
              <h2 class="flex items-center gap-2 font-mono text-sm font-black">
                <Filter class="size-4" stroke-width="2.5" />
                {{ tt('筛选地图') }}
              </h2>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 text-[11px] font-black underline decoration-2 underline-offset-4 disabled:cursor-not-allowed disabled:opacity-35"
                  :disabled="!hasActiveFilters"
                  @click="resetFilters"
                >
                  <RotateCcw class="size-3.5" stroke-width="2.5" />
                  {{ tt('重置') }}
                </button>
                <button
                  type="button"
                  class="text-[11px] font-black lg:hidden"
                  :aria-expanded="isFilterOpen"
                  @click="isFilterOpen = !isFilterOpen"
                >
                  {{ tt(isFilterOpen ? '收起筛选' : '展开筛选') }}
                </button>
              </div>
            </div>

            <div
              class="map-filter-groups mt-4 border-t-2 border-dashed border-[#a7b0a8] pt-4 dark:border-[#555b57]"
              :class="{ 'is-open': isFilterOpen }"
            >
              <section>
                <h3 class="font-mono text-xs font-black">{{ tt('MC 版本') }}</h3>
                <div class="mt-2 grid gap-1">
                  <button
                    v-for="option in versionOptions"
                    :key="option.value"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 border-2 px-3 py-2.5 text-left text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                    :class="
                      selectedVersion === option.value
                        ? 'border-[var(--ink)] bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_var(--ink)]'
                        : 'border-transparent hover:border-[var(--ink)] hover:bg-[#f1f4ec] dark:hover:bg-[#2a2e2b]'
                    "
                    :disabled="option.count === 0"
                    @click="selectedVersion = option.value"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <Check
                        v-if="selectedVersion === option.value"
                        class="size-3.5 shrink-0"
                        stroke-width="3"
                      />
                      <span v-else class="size-3.5 shrink-0" />
                      <span class="truncate">{{ option.label }}</span>
                    </span>
                    <span class="font-mono">{{ option.count }}</span>
                  </button>
                </div>
              </section>

              <section
                class="mt-5 border-t-2 border-dashed border-[#a7b0a8] pt-5 dark:border-[#555b57]"
              >
                <h3 class="font-mono text-xs font-black">{{ tt('加载器') }}</h3>
                <div class="mt-2 grid gap-1">
                  <button
                    v-for="option in loaderOptions"
                    :key="option.value"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 border-2 px-3 py-2.5 text-left text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                    :class="
                      selectedLoader === option.value
                        ? 'border-[var(--ink)] bg-[#77d9ea] text-[#172018] shadow-[3px_3px_0_var(--ink)]'
                        : 'border-transparent hover:border-[var(--ink)] hover:bg-[#f1f4ec] dark:hover:bg-[#2a2e2b]'
                    "
                    :disabled="option.count === 0"
                    @click="selectedLoader = option.value"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <Check
                        v-if="option.value === ALL && selectedLoader === option.value"
                        class="size-3.5 shrink-0"
                        stroke-width="3"
                      />
                      <img
                        v-else-if="option.icon"
                        :src="option.icon"
                        alt=""
                        class="size-3.5 shrink-0 [image-rendering:pixelated]"
                      />
                      <span v-else class="size-3.5 shrink-0" />
                      <span class="truncate">{{ option.label }}</span>
                    </span>
                    <span class="font-mono">{{ option.count }}</span>
                  </button>
                </div>
              </section>

              <section
                class="mt-5 border-t-2 border-dashed border-[#a7b0a8] pt-5 dark:border-[#555b57]"
              >
                <h3 class="font-mono text-xs font-black">{{ tt('维护状态') }}</h3>
                <div class="mt-2 grid gap-1">
                  <button
                    v-for="option in statusOptions"
                    :key="option.value"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 border-2 px-3 py-2.5 text-left text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                    :class="
                      selectedStatus === option.value
                        ? 'border-[var(--ink)] bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_var(--ink)]'
                        : 'border-transparent hover:border-[var(--ink)] hover:bg-[#f1f4ec] dark:hover:bg-[#2a2e2b]'
                    "
                    :disabled="option.count === 0"
                    @click="selectedStatus = option.value"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <Check
                        v-if="option.value === ALL && selectedStatus === option.value"
                        class="size-3.5 shrink-0"
                        stroke-width="3"
                      />
                      <span
                        v-else-if="option.background"
                        class="size-3 shrink-0 border border-black/10"
                        :style="{ backgroundColor: option.background }"
                      />
                      <span v-else class="size-3.5 shrink-0" />
                      <span class="truncate">{{ option.label }}</span>
                    </span>
                    <span class="font-mono">{{ option.count }}</span>
                  </button>
                </div>
              </section>

              <section
                class="mt-5 border-t-2 border-dashed border-[#a7b0a8] pt-5 dark:border-[#555b57]"
              >
                <h3 class="font-mono text-xs font-black">{{ tt('汉化授权') }}</h3>
                <div class="mt-2 grid gap-1">
                  <button
                    v-for="option in officialOptions"
                    :key="option.value"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 border-2 px-3 py-2.5 text-left text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                    :class="
                      selectedOfficial === option.value
                        ? 'border-[var(--ink)] bg-[#77d9ea] text-[#172018] shadow-[3px_3px_0_var(--ink)]'
                        : 'border-transparent hover:border-[var(--ink)] hover:bg-[#f1f4ec] dark:hover:bg-[#2a2e2b]'
                    "
                    :disabled="option.count === 0"
                    @click="selectedOfficial = option.value"
                  >
                    <span class="flex min-w-0 items-center gap-2">
                      <Check
                        v-if="selectedOfficial === option.value"
                        class="size-3.5 shrink-0"
                        stroke-width="3"
                      />
                      <span v-else class="size-3.5 shrink-0" />
                      <span class="truncate">{{ option.label }}</span>
                    </span>
                    <span class="font-mono">{{ option.count }}</span>
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </PixelFrame>

        <div class="min-w-0">
          <PixelFrame bg-color="#ffffff" shadow-x="5px" shadow-y="5px">
            <div
              class="grid gap-3 p-3 sm:p-4 xl:grid-cols-[minmax(220px,1fr)_auto_auto] xl:items-center"
            >
              <label class="relative block">
                <span class="sr-only">{{ tt('搜索地图') }}</span>
                <Search
                  class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#637067] dark:text-[#aeb5af]"
                  stroke-width="2.4"
                />
                <input
                  v-model="searchQuery"
                  type="search"
                  :placeholder="tt('搜索地图名、副标题、作者或 BV 号...')"
                  class="map-search-input h-11 w-full border-2 border-[var(--ink)] bg-[#f8fbf2] pl-10 pr-3 text-sm font-bold text-[#172018] outline-none transition-shadow placeholder:text-[#737d75] focus:shadow-[3px_3px_0_var(--ink)] dark:bg-[#282b29] dark:text-[#f2f1e8] dark:placeholder:text-[#9ca49e]"
                />
              </label>

              <div class="grid grid-cols-[auto_200px] items-center gap-2 text-xs font-black">
                <span class="inline-flex items-center gap-1.5">
                  <SlidersHorizontal class="size-4" stroke-width="2.4" />
                  {{ tt('排序') }}
                </span>
                <PixelSelect
                  v-model="sortBy"
                  :options="sortOptions"
                  :aria-label="tt('排序')"
                  :empty-text="tt('暂无选项')"
                />
              </div>

              <div class="grid grid-cols-[auto_88px] items-center gap-2 text-xs font-black">
                <span>{{ tt('每页') }}</span>
                <PixelSelect
                  v-model="pageSize"
                  :options="pageSizeOptions"
                  :aria-label="tt('每页')"
                  :empty-text="tt('暂无选项')"
                />
              </div>
            </div>
          </PixelFrame>

          <div class="mb-4 mt-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p
                class="font-mono text-[11px] font-black uppercase text-[#68746b] dark:text-[#a8b0aa]"
              >
                FILTERED RESULTS
              </p>
              <h2 class="mt-1 flex items-center gap-2 font-mono text-xl font-black">
                <MapPinned class="size-5" stroke-width="2.5" />
                {{ tt('地图列表') }}
              </h2>
            </div>
            <p class="text-xs font-black text-[#68746b] dark:text-[#a8b0aa]">
              {{ tt('显示') }} {{ pageStart }}–{{ pageEnd }} · {{ tt('共') }}
              {{ filteredMaps.length }} {{ tt('项') }}
            </p>
          </div>

          <div v-if="paginatedMaps.length" class="grid gap-5">
            <MapCard v-for="map in paginatedMaps" :key="map.id" :map="map" />
          </div>

          <PixelFrame v-else bg-color="#ffffff" shadow-x="6px" shadow-y="6px">
            <div class="grid min-h-64 place-items-center p-8 text-center">
              <div>
                <span
                  class="mx-auto grid size-14 place-items-center border-[3px] border-[var(--ink)] bg-[#77d9ea] text-[#172018] shadow-[5px_5px_0_var(--ink)]"
                >
                  <Search class="size-6" stroke-width="2.5" />
                </span>
                <h3 class="mt-5 font-mono text-xl font-black">
                  {{ tt('没有找到符合条件的地图') }}
                </h3>
                <p class="mt-2 text-sm font-bold text-[#68746b] dark:text-[#a8b0aa]">
                  {{ tt('换一个关键词，或重置左侧筛选后再试。') }}
                </p>
                <button
                  type="button"
                  class="mt-5 inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[#d8f461] px-4 py-2 text-xs font-black text-[#172018] shadow-[4px_4px_0_var(--ink)]"
                  @click="resetFilters"
                >
                  <RotateCcw class="size-4" stroke-width="2.5" />
                  {{ tt('重置筛选') }}
                </button>
              </div>
            </div>
          </PixelFrame>

          <nav
            v-if="totalPages > 1"
            class="mt-8 flex items-center justify-center gap-3"
            :aria-label="tt('地图列表分页')"
          >
            <button
              type="button"
              class="grid size-10 place-items-center border-2 border-[var(--ink)] bg-white shadow-[3px_3px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-35 dark:bg-[#1d1f1e]"
              :aria-label="tt('上一页')"
              :disabled="currentPage === 1"
              @click="currentPage -= 1"
            >
              <ArrowLeft class="size-4" stroke-width="2.5" />
            </button>
            <span class="min-w-20 text-center font-mono text-xs font-black">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              type="button"
              class="grid size-10 place-items-center border-2 border-[var(--ink)] bg-white shadow-[3px_3px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-35 dark:bg-[#1d1f1e]"
              :aria-label="tt('下一页')"
              :disabled="currentPage === totalPages"
              @click="currentPage += 1"
            >
              <ArrowRight class="size-4" stroke-width="2.5" />
            </button>
          </nav>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.map-search-input::-webkit-search-cancel-button {
  cursor: pointer;
}

.map-filter-groups {
  display: none;
}

.map-filter-groups.is-open {
  display: block;
}

@media (min-width: 1024px) {
  .map-filter-groups {
    display: block;
  }
}
</style>
