<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowRight, MapPinned, Search } from '@lucide/vue'
import { useRouter } from 'vue-router'

import { maps } from '@/assets/info/map.js'
import Modal from '@/components/Modal.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show'])

const router = useRouter()
const { tt } = useLocaleText()
const searchInput = ref(null)
const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase())

const searchResults = computed(() => {
  if (!normalizedQuery.value) return []

  return maps.filter((map) =>
    [map.name, map.subtitle].some((text) =>
      text.toLocaleLowerCase().includes(normalizedQuery.value),
    ),
  )
})

const close = () => emit('update:show', false)

const openResult = async (map) => {
  if (!map) return

  close()
  await router.push({ name: 'map-detail', params: { mapId: map.id } })
}

const resetSearch = () => {
  query.value = ''
}

watch(
  () => props.show,
  async (show) => {
    if (!show) return

    await nextTick()
    requestAnimationFrame(() => searchInput.value?.focus())
  },
)
</script>

<template>
  <Modal
    :show="show"
    width="680px"
    :title="tt('搜索地图')"
    :aria-label="tt('搜索地图')"
    @update:show="emit('update:show', $event)"
    @after-leave="resetSearch"
  >
    <template #header>
      <label class="relative block min-w-0 flex-1">
        <span class="sr-only">{{ tt('搜索地图') }}</span>
        <Search
          class="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-[#657168] dark:text-[#adb5af]"
          stroke-width="2.4"
        />
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          role="searchbox"
          :placeholder="tt('输入地图名称或副标题...')"
          class="h-10 w-full bg-transparent pl-8 pr-3 text-base font-black outline-none placeholder:font-semibold placeholder:text-[#8a948c] dark:text-[#f2f1e8] dark:placeholder:text-[#858d87]"
          @keydown.enter.prevent="openResult(searchResults[0])"
        />
      </label>
    </template>

    <div v-if="normalizedQuery" class="grid gap-3">
      <div class="flex items-center justify-between gap-4">
        <p
          class="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#63715f] dark:text-[#aeb7aa]"
        >
          {{ tt('搜索结果') }}
        </p>
        <span class="text-xs font-black text-[#7a857c] dark:text-[#9da59f]">
          {{ searchResults.length }}
        </span>
      </div>

      <div v-if="searchResults.length" class="grid max-h-[52vh] gap-3 overflow-y-auto pr-2">
        <button
          v-for="map in searchResults"
          :key="map.id"
          type="button"
          class="group flex w-full items-center gap-4 border-2 border-[#172018] bg-[#f8fbf2] p-4 text-left shadow-[4px_4px_0_#172018] transition-[transform,box-shadow,background-color] duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#eff8d8] hover:shadow-[6px_6px_0_#172018] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#172018] dark:border-[#d8d3c5] dark:bg-[#252826] dark:shadow-[4px_4px_0_#000] dark:hover:bg-[#2d332c] dark:hover:shadow-[6px_6px_0_#000] dark:focus-visible:outline-[#f2f1e8]"
          @click="openResult(map)"
        >
          <span
            class="grid size-11 shrink-0 place-items-center border-2 border-[#172018] bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_#172018]"
          >
            <MapPinned class="size-5" stroke-width="2.5" />
          </span>

          <span class="min-w-0 flex-1">
            <span class="block truncate font-mono text-base font-black">{{ map.name }}</span>
            <span class="mt-1 block truncate text-xs font-black text-[#637067] dark:text-[#b7beb8]">
              {{ map.subtitle }}
            </span>
            <span
              class="mt-2 line-clamp-2 block text-sm font-semibold leading-6 text-[#59645b] dark:text-[#aeb6b0]"
            >
              {{ map.description }}
            </span>
          </span>

          <ArrowRight
            class="size-5 shrink-0 transition-transform group-hover:translate-x-1"
            stroke-width="2.5"
          />
        </button>
      </div>

      <div
        v-else
        class="grid min-h-44 place-items-center border-2 border-dashed border-[#aab2ac] bg-[#f7f9f3] px-5 py-8 text-center dark:border-[#555b57] dark:bg-[#242725]"
      >
        <div>
          <Search class="mx-auto size-8 text-[#7a857c] dark:text-[#9da59f]" stroke-width="2" />
          <p class="mt-3 font-mono text-base font-black">{{ tt('没有找到相关地图') }}</p>
          <p class="mt-2 text-sm font-semibold text-[#68736a] dark:text-[#aeb6b0]">
            {{ tt('尝试输入其他地图名称或副标题。') }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="grid min-h-44 place-items-center border-2 border-dashed border-[#aab2ac] bg-[#f7f9f3] px-5 py-8 text-center dark:border-[#555b57] dark:bg-[#242725]"
    >
      <div>
        <MapPinned class="mx-auto size-8 text-[#657168] dark:text-[#adb5af]" stroke-width="2" />
        <p class="mt-3 font-mono text-base font-black">{{ tt('搜索地图') }}</p>
        <p class="mt-2 text-sm font-semibold text-[#68736a] dark:text-[#aeb6b0]">
          {{ tt('输入地图名称或副标题开始搜索。') }}
        </p>
      </div>
    </div>
  </Modal>
</template>
