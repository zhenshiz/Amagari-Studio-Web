<script setup>
import { computed } from 'vue'
import { BookOpen, Download, ExternalLink, PackageOpen, ShieldCheck } from '@lucide/vue'

import Modal from '@/components/Modal.vue'
import PixelButton from '@/components/PixelButton.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

defineOptions({ name: 'MapDownloadDialog' })

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  map: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:show'])

const { tt } = useLocaleText()

const downloadInfo = computed(() => ({
  provider: props.map.localizationDownload?.provider || tt('下载页面'),
  url: props.map.localizationDownload?.url || props.map.downloadUrl || '',
  installGuideUrl: props.map.localizationDownload?.installGuideUrl || '/install',
}))

const close = () => {
  emit('update:show', false)
}
</script>

<template>
  <Modal
    :show="show"
    width="580px"
    :title="tt('下载汉化')"
    :aria-label="tt('下载汉化')"
    @update:show="emit('update:show', $event)"
  >
    <template #header>
      <div class="flex min-w-0 items-center gap-3">
        <span
          class="grid size-9 shrink-0 place-items-center border-2 border-[#172018] bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_#172018]"
        >
          <Download class="size-5" stroke-width="2.8" />
        </span>
        <h2 class="font-mono text-lg font-black">{{ tt('下载汉化') }}</h2>
      </div>
    </template>

    <div class="space-y-4">
      <div
        class="inline-flex items-center gap-2 border-2 border-[var(--ink)] px-2.5 py-1 text-[11px] font-black"
        :class="
          map.isOfficialLocalization ? 'bg-[#d8f461] text-[#172018]' : 'bg-[#77d9ea] text-[#172018]'
        "
      >
        <ShieldCheck v-if="map.isOfficialLocalization" class="size-4" stroke-width="2.7" />
        <PackageOpen v-else class="size-4" stroke-width="2.7" />
        {{ tt(map.isOfficialLocalization ? '官方汉化' : '社区汉化') }}
      </div>

      <div>
        <h3 class="font-mono text-xl font-black">
          {{ tt(map.isOfficialLocalization ? '官方汉化地图可直接下载' : '请单独下载汉化资源包') }}
        </h3>
        <p class="mt-2 text-sm font-semibold leading-7 text-[#536054] dark:text-[#c0c5bf]">
          {{
            tt(
              map.isOfficialLocalization
                ? '该项目已经获得原作者的官方汉化授权，下载文件包含完整地图与中文内容，不需要额外安装汉化资源包。'
                : '该项目属于社区汉化，原地图和汉化资源包需要分别下载。请先准备原地图，再将汉化资源包按照安装教程放入游戏。',
            )
          }}
        </p>
      </div>

      <div
        class="pixel-grid border-[3px] border-[var(--ink)] bg-[#eef3e9] p-4 text-[#172018] shadow-[4px_4px_0_var(--ink)] dark:bg-[#282b29] dark:text-[#f2f1e8] dark:shadow-[4px_4px_0_#000]"
      >
        <div class="flex items-start gap-3">
          <span
            class="grid size-10 shrink-0 place-items-center border-2 border-[#172018] bg-white text-[#172018] shadow-[2px_2px_0_#172018]"
          >
            <Download class="size-5" stroke-width="2.7" />
          </span>
          <div class="min-w-0">
            <p class="font-mono text-xs font-black uppercase">{{ tt('下载来源') }}</p>
            <p class="mt-1 break-words text-sm font-black">{{ downloadInfo.provider }}</p>
            <p class="mt-1 text-xs font-semibold leading-5 opacity-70">
              {{
                tt(
                  map.isOfficialLocalization
                    ? '打开下载页面并获取已经整合汉化内容的完整地图。'
                    : '打开网盘页面并下载汉化资源包文件。',
                )
              }}
            </p>
          </div>
        </div>
      </div>

      <a
        v-if="!map.isOfficialLocalization && map.downloadUrl"
        :href="map.downloadUrl"
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-black underline decoration-2 underline-offset-4 hover:text-[#24798a] dark:hover:text-[#77d9ea]"
      >
        {{ tt('前往原地图下载页') }}
        <ExternalLink class="size-3.5" stroke-width="2.5" />
      </a>
    </div>

    <template #footer>
      <PixelButton
        :text="tt('取消')"
        width="88px"
        bg-color="#ff9b78"
        hover-bg-color="#ffb39a"
        @click="close"
      />

      <PixelButton
        v-if="!map.isOfficialLocalization"
        :text="tt('安装教程')"
        :to="downloadInfo.installGuideUrl"
        min-width="116px"
        bg-color="#77d9ea"
        hover-bg-color="#91e5f2"
        @click="close"
      >
        <template #left>
          <BookOpen class="size-4" stroke-width="2.5" />
        </template>
      </PixelButton>

      <PixelButton
        :text="tt(map.isOfficialLocalization ? '下载完整地图' : '下载资源包')"
        :href="downloadInfo.url"
        target="_blank"
        rel="noreferrer"
        min-width="132px"
        :disabled="!downloadInfo.url"
        bg-color="#d8f461"
        hover-bg-color="#ecff91"
        @click="close"
      >
        <template #left>
          <ExternalLink class="size-4" stroke-width="2.5" />
        </template>
      </PixelButton>
    </template>
  </Modal>
</template>
