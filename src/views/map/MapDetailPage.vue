<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  AlertTriangle,
  ChevronLeft,
  Download,
  ExternalLink,
  ImageOff,
  Link2,
  RefreshCw,
  UserRound,
} from '@lucide/vue'

import { MaintenanceStatus, MapLoader, RelatedSite, maps } from '@/assets/info/map.js'
import { mapDocuments } from '@/assets/info/mapDocuments.js'
import MapDownloadDialog from '@/components/map/MapDownloadDialog.vue'
import MarkDownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { getBilibiliCover } from '@/utils/getBilibiliCover.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const localeFiles = {
  'zh-CN': 'zh_CN.md',
  'zh-TW': 'zh_TW.md',
  'en-US': 'en_US.md',
}

const route = useRoute()
const { activeLanguage, tt } = useLocaleText()

const markdown = ref('')
const loadState = ref('loading')
const markdownRenderer = ref(null)
const coverUrl = ref('')
const coverFailed = ref(false)
const isCoverLoading = ref(true)
const showDownloadDialog = ref(false)
let loadVersion = 0

const mapId = computed(() => String(route.params.mapId || '').trim())
const mapInfo = computed(() => maps.find((map) => map.id === mapId.value))
const loaderMeta = computed(() => MapLoader.getMeta(mapInfo.value?.loader) || {})
const statusMeta = computed(() => MaintenanceStatus.getMeta(mapInfo.value?.maintenanceStatus) || {})
const markdownFileName = computed(
  () => localeFiles[activeLanguage.value] || `${activeLanguage.value.replace('-', '_')}.md`,
)
const markdownDisplayPath = computed(
  () => `src/assets/map-documents/${mapId.value}/${markdownFileName.value}`,
)
const tocHeadings = computed(() => markdownRenderer.value?.headings || [])
const relatedLinks = computed(() =>
  (mapInfo.value?.relatedLinks || []).map((link) => ({
    ...link,
    meta: RelatedSite.getMeta(link.site) || {},
  })),
)

const loadMarkdown = async () => {
  const currentVersion = ++loadVersion
  markdown.value = ''
  loadState.value = 'loading'

  try {
    const content = mapDocuments[mapId.value]?.[activeLanguage.value]

    if (!content) {
      throw new Error('Markdown file not found')
    }

    if (currentVersion !== loadVersion) return

    markdown.value = content
    loadState.value = 'ready'
    await nextTick()
  } catch {
    if (currentVersion !== loadVersion) return
    loadState.value = 'missing'
  }
}

const scrollToHeading = (id) => {
  markdownRenderer.value?.scrollToHeading(id)
}

watch([mapId, activeLanguage], loadMarkdown, { immediate: true })

watch(
  () => mapInfo.value?.bvid,
  async (bvid) => {
    coverUrl.value = ''
    coverFailed.value = false
    isCoverLoading.value = true

    const resolvedCover = await getBilibiliCover(bvid)

    if (bvid === mapInfo.value?.bvid) {
      coverUrl.value = resolvedCover
      isCoverLoading.value = false
    }
  },
  { immediate: true },
)

watch(mapId, () => {
  showDownloadDialog.value = false
})

onBeforeUnmount(() => {
  loadVersion += 1
})
</script>

<template>
  <main class="mx-auto min-h-[calc(100vh-60px)] max-w-6xl px-4 py-7 sm:px-5 sm:py-9 lg:px-6">
    <header
      v-if="mapInfo"
      class="mb-7 border-[3px] border-[var(--ink)] bg-white p-4 shadow-[6px_6px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[6px_6px_0_#000] sm:p-5"
    >
      <div class="border-b-2 border-dashed border-[#a7b0a8] pb-3 dark:border-[#555b57]">
        <RouterLink
          to="/map"
          class="inline-flex items-center gap-1 font-mono text-xs font-black uppercase text-[#536054] transition-colors hover:text-[#24798a] dark:text-[#b8bdb7] dark:hover:text-[#77d9ea]"
        >
          <ChevronLeft class="size-4" stroke-width="2.5" />
          {{ tt('返回地图列表') }}
        </RouterLink>
      </div>

      <div
        class="mt-5 grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5 lg:grid-cols-[144px_minmax(0,1fr)_220px] lg:items-center lg:gap-6"
      >
        <div
          class="relative aspect-square overflow-hidden border-[3px] border-[var(--ink)] bg-[#77d9ea] shadow-[4px_4px_0_var(--ink)] dark:shadow-[4px_4px_0_#000]"
        >
          <img
            v-if="coverUrl && !coverFailed"
            :src="coverUrl"
            :alt="`${tt(mapInfo.name)} ${tt('视频封面')}`"
            referrerpolicy="no-referrer"
            class="absolute inset-0 size-full object-cover"
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

        <div class="min-w-0">
          <div class="flex flex-wrap gap-2">
            <span
              class="border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-black"
              :style="{
                backgroundColor: statusMeta.background,
                color: statusMeta.foreground,
              }"
            >
              {{ tt(statusMeta.label) }}
            </span>
            <span
              class="border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-black text-[#172018]"
              :class="mapInfo.isOfficialLocalization ? 'bg-[#d8f461]' : 'bg-[#77d9ea]'"
            >
              {{ tt(mapInfo.isOfficialLocalization ? '官方汉化' : '社区汉化') }}
            </span>
          </div>

          <h1 class="mt-3 font-mono text-2xl font-black leading-tight sm:text-3xl">
            {{ tt(mapInfo.name) }}
          </h1>
          <p
            class="mt-1.5 font-mono text-xs font-black text-[#657168] dark:text-[#adb5af] sm:text-sm"
          >
            {{ mapInfo.subtitle }}
          </p>
          <p class="mt-3 flex items-center gap-2 text-xs font-bold sm:text-sm">
            <UserRound class="size-4 shrink-0" stroke-width="2.5" />
            <span class="text-[#657168] dark:text-[#adb5af]">{{ tt('原作者') }}</span>
            <strong>{{ mapInfo.author }}</strong>
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              class="border-2 border-[var(--ink)] bg-[#eef3e9] px-2.5 py-1.5 font-mono text-[10px] font-black dark:bg-[#282b29]"
            >
              MC {{ mapInfo.gameVersion }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 border-2 border-[var(--ink)] px-2.5 py-1.5 text-[10px] font-black"
              :style="{
                backgroundColor: loaderMeta.background,
                color: loaderMeta.foreground,
              }"
            >
              <img
                v-if="loaderMeta.icon"
                :src="loaderMeta.icon"
                alt=""
                class="size-3.5 [image-rendering:pixelated]"
              />
              {{ tt(loaderMeta.label) }}
            </span>
            <span
              class="border-2 border-[var(--ink)] bg-[#77d9ea] px-2.5 py-1.5 font-mono text-[10px] font-black text-[#172018]"
            >
              {{ tt('汉化版本') }} {{ mapInfo.adaptedVersion }}
            </span>
          </div>
        </div>

        <div
          class="col-span-2 border-t-2 border-dashed border-[#a7b0a8] pt-5 dark:border-[#555b57] lg:col-span-1 lg:border-l-2 lg:border-t-0 lg:pl-6 lg:pt-0"
        >
          <PixelButton
            :text="tt('下载汉化')"
            width="100%"
            bg-color="#d8f461"
            hover-bg-color="#ecff91"
            @click="showDownloadDialog = true"
          >
            <template #left>
              <Download class="size-4" stroke-width="2.7" />
            </template>
          </PixelButton>
          <p
            class="mt-3 text-center text-[11px] font-bold leading-5 text-[#657168] dark:text-[#adb5af]"
          >
            {{
              tt(
                mapInfo.isOfficialLocalization
                  ? '下载包含汉化内容的完整地图'
                  : '下载汉化资源包并查看安装说明',
              )
            }}
          </p>
        </div>
      </div>
    </header>

    <MapDownloadDialog v-if="mapInfo" v-model:show="showDownloadDialog" :map="mapInfo" />

    <section v-if="loadState === 'loading'" aria-live="polite">
      <PixelFrame bg-color="#ffffff" shadow-x="5px" shadow-y="5px">
        <div class="flex min-h-72 items-center justify-center gap-3 p-6 font-mono font-black">
          <RefreshCw class="size-5 animate-spin motion-reduce:animate-none" stroke-width="2.5" />
          {{ tt('正在加载地图文档...') }}
        </div>
      </PixelFrame>
    </section>

    <section v-else-if="loadState === 'missing'" aria-live="polite">
      <PixelFrame bg-color="#ffffff" shadow-x="5px" shadow-y="5px">
        <div
          class="mx-auto flex min-h-72 max-w-2xl flex-col items-center justify-center p-6 text-center"
        >
          <div
            class="grid size-14 place-items-center border-2 border-[var(--ink)] bg-[#ff9b78] text-[#172018] shadow-[3px_3px_0_var(--ink)]"
          >
            <AlertTriangle class="size-7" stroke-width="2.5" />
          </div>
          <h2 class="mt-5 font-mono text-2xl font-black">
            {{ tt('当前语言暂无地图文档') }}
          </h2>
          <p class="mt-3 text-sm font-semibold leading-6 text-[#536054] dark:text-[#b8bdb7]">
            {{ tt('请切换语言或在以下位置补充对应的 Markdown 文件。') }}
          </p>
          <code
            class="mt-4 max-w-full overflow-x-auto border-2 border-[var(--ink)] bg-[#eef3e9] px-3 py-2 font-mono text-xs font-black dark:bg-[#282b29]"
          >
            {{ markdownDisplayPath }}
          </code>
          <div class="mt-6">
            <PixelButton
              :text="tt('重新加载')"
              width="148px"
              bg-color="#77d9ea"
              hover-bg-color="#91e5f2"
              @click="loadMarkdown"
            >
              <template #left>
                <RefreshCw class="size-4" stroke-width="2.5" />
              </template>
            </PixelButton>
          </div>
        </div>
      </PixelFrame>
    </section>

    <div v-else class="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_240px]">
      <PixelFrame tag="article" bg-color="#ffffff" shadow-x="6px" shadow-y="6px" class="min-w-0">
        <MarkDownReadOnly
          :key="`${mapId}-${markdownFileName}`"
          ref="markdownRenderer"
          :content="markdown"
        />
      </PixelFrame>

      <aside v-if="relatedLinks.length || tocHeadings.length" class="hidden self-stretch xl:block">
        <div class="sticky top-20 grid gap-5">
          <section
            v-if="relatedLinks.length"
            class="border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[4px_4px_0_#000]"
            :aria-labelledby="`related-links-${mapId}`"
          >
            <h2
              :id="`related-links-${mapId}`"
              class="mb-3 flex items-center gap-2 border-b-2 border-[var(--ink)] pb-2 font-mono text-xs font-black uppercase"
            >
              <Link2 class="size-4" stroke-width="2.5" />
              {{ tt('相关链接') }}
            </h2>

            <ul class="grid gap-2">
              <li v-for="link in relatedLinks" :key="`${link.site}-${link.url}`">
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex min-w-0 items-center gap-2.5 border-2 border-[var(--ink)] bg-[#f8fbf2] p-2 text-[#172018] transition-transform hover:-translate-y-0.5 dark:bg-[#282b29] dark:text-[#f2f1e8]"
                >
                  <span
                    class="grid size-8 shrink-0 place-items-center border-2 border-[var(--ink)]"
                    :style="{
                      backgroundColor: link.meta.background,
                      color: link.meta.foreground,
                    }"
                  >
                    <img
                      v-if="link.meta.icon"
                      :src="link.meta.icon"
                      alt=""
                      class="size-5 [image-rendering:pixelated]"
                    />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-[11px] font-black leading-4">
                      {{ tt(link.text || link.meta.label) }}
                    </span>
                    <span
                      class="mt-0.5 block truncate text-[9px] font-bold text-[#68746b] dark:text-[#aeb5af]"
                    >
                      {{ tt(link.meta.label) }}
                    </span>
                  </span>
                  <ExternalLink
                    class="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    stroke-width="2.5"
                  />
                </a>
              </li>
            </ul>
          </section>

          <nav
            v-if="tocHeadings.length"
            class="border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--ink)] dark:bg-[#1d1f1e] dark:shadow-[4px_4px_0_#000]"
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
        </div>
      </aside>
    </div>
  </main>
</template>
