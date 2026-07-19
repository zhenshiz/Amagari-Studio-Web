<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Check, ChevronDown, Languages, Menu, Moon, Search, Sun, X } from '@lucide/vue'

import logo from '@/assets/Amagari_logo.png'
import CommunityDialog from '@/components/CommunityDialog.vue'
import HoverLineLink from '@/components/HoverLineLink.vue'
import MapSearchDialog from '@/components/map/MapSearchDialog.vue'
import { useCommunityDialog } from '@/composables/useCommunityDialog.js'
import { i18nScope } from '@/languages/index.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const THEME_STORAGE_KEY = 'amagari-theme'

const route = useRoute()
const { activeLanguage, tt } = useLocaleText()
const { isCommunityDialogOpen } = useCommunityDialog()

const isMenuOpen = ref(false)
const isLanguageOpen = ref(false)
const isChangingLanguage = ref(false)
const isSearchOpen = ref(false)
const isMac = ref(false)
const theme = ref('light')
const languageMenuRef = ref(null)

const navItems = computed(() => [
  { label: tt('地图汉化'), href: '/map' },
  { label: tt('安装汉化'), href: '/install' },
  { label: tt('汉化工具'), href: '/tools' },
  { label: tt('关于我们'), href: '/about' },
])

const languageOptions = computed(() =>
  i18nScope.languages.map((language) => ({
    name: language.name,
    title: language.nativeTitle || language.title || language.name,
  })),
)

const activeLanguageTitle = computed(
  () =>
    languageOptions.value.find((language) => language.name === activeLanguage.value)?.title ||
    activeLanguage.value,
)

const shortcutLabel = computed(() => (isMac.value ? '⌘ K' : 'Ctrl K'))

const switchLanguage = async (language) => {
  if (language === activeLanguage.value || isChangingLanguage.value) {
    isLanguageOpen.value = false
    return
  }

  isChangingLanguage.value = true
  try {
    await i18nScope.change(language)
    document.documentElement.lang = language
  } finally {
    isChangingLanguage.value = false
    isLanguageOpen.value = false
  }
}

const applyTheme = (nextTheme) => {
  const isDark = nextTheme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = nextTheme
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  theme.value = nextTheme
}

const toggleTheme = async () => {
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!document.startViewTransition || prefersReducedMotion) {
    applyTheme(nextTheme)
    return
  }

  const originX = nextTheme === 'dark' ? window.innerWidth : 0
  const originY = nextTheme === 'dark' ? 0 : window.innerHeight
  const radius = Math.hypot(window.innerWidth, window.innerHeight)
  const transition = document.startViewTransition(() => applyTheme(nextTheme))

  await transition.ready
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${originX}px ${originY}px)`,
        `circle(${radius}px at ${originX}px ${originY}px)`,
      ],
    },
    {
      duration: 650,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      pseudoElement: '::view-transition-new(root)',
    },
  )
}

const openSearch = () => {
  isMenuOpen.value = false
  isLanguageOpen.value = false
  isCommunityDialogOpen.value = false
  isSearchOpen.value = true
}

const handleGlobalKeydown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
    return
  }

  if (event.key === 'Escape') {
    isLanguageOpen.value = false
    isMenuOpen.value = false
  }
}

const handleOutsideClick = (event) => {
  if (languageMenuRef.value && !languageMenuRef.value.contains(event.target)) {
    isLanguageOpen.value = false
  }
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  document.documentElement.lang = activeLanguage.value
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('pointerdown', handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('pointerdown', handleOutsideClick)
})

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
    isLanguageOpen.value = false
    isSearchOpen.value = false
    isCommunityDialogOpen.value = false
  },
)
</script>

<template>
  <div
    id="top"
    class="min-h-screen bg-[#f8fbf2] text-[#172018] transition-colors dark:bg-[#121313] dark:text-[#f2f1e8]"
  >
    <header
      class="sticky top-0 z-40 border-b border-[#d9ded6] bg-white/95 shadow-[0_1px_0_rgba(23,32,24,0.04)] backdrop-blur dark:border-[#343737] dark:bg-[#171818]/95 dark:shadow-none"
    >
      <div class="mx-auto flex h-[60px] max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <RouterLink
          to="/"
          class="flex min-w-0 shrink-0 items-center gap-2.5"
          :aria-label="tt('返回首页')"
        >
          <span class="grid h-9 w-14 -translate-y-0.5 shrink-0 place-items-center overflow-hidden">
            <img
              :src="logo"
              alt="Amagari Studio"
              class="size-full -translate-y-1 object-cover object-[center_100%] [image-rendering:pixelated]"
            />
          </span>
          <span class="hidden truncate text-[15px] font-extrabold tracking-tight sm:block">
            Amagari Studio
          </span>
        </RouterLink>

        <nav class="ml-auto hidden h-full items-center gap-1 lg:flex" :aria-label="tt('主导航')">
          <HoverLineLink
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            :is-router="!item.external"
            hover-line-type="toFlanks"
            line-color="currentColor"
            class="h-9 whitespace-nowrap px-2.5 text-sm font-semibold transition-colors hover:text-black dark:hover:text-white xl:px-3"
          >
            {{ item.label }}
          </HoverLineLink>
        </nav>

        <div class="ml-auto flex items-center gap-1.5 lg:ml-3">
          <button
            type="button"
            class="relative hidden h-9 w-44 items-center rounded-lg border border-transparent bg-[#f2f3f2] pl-9 pr-[58px] text-left text-sm font-medium text-[#8a918b] outline-none transition hover:border-[#c9ceca] hover:bg-white focus-visible:border-[#a8afa9] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#172018]/10 dark:bg-[#272929] dark:text-[#929893] dark:hover:border-[#555b57] dark:hover:bg-[#1f2120] dark:focus-visible:border-[#666d68] dark:focus-visible:bg-[#1f2120] dark:focus-visible:ring-white/10 lg:flex xl:w-52"
            :aria-label="tt('打开搜索')"
            @click="openSearch"
          >
            <Search
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#68706a] dark:text-[#9ca39d]"
              stroke-width="2"
            />
            <span class="truncate">{{ tt('搜索...') }}</span>
            <kbd
              class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[#dfe2df] bg-white px-1.5 py-0.5 text-[11px] font-medium leading-none text-[#757b76] dark:border-[#444846] dark:bg-[#343735] dark:text-[#b6bbb7]"
            >
              {{ shortcutLabel }}
            </kbd>
          </button>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg text-[#303632] transition hover:bg-[#eef0ee] dark:text-[#e1e3de] dark:hover:bg-[#292c2a] lg:hidden"
            :aria-label="tt('打开搜索')"
            @click="openSearch"
          >
            <Search class="size-5" stroke-width="2" />
          </button>

          <div ref="languageMenuRef" class="relative">
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold transition hover:bg-[#eef0ee] dark:hover:bg-[#292c2a]"
              :aria-label="tt('切换语言')"
              :aria-expanded="isLanguageOpen"
              @click="isLanguageOpen = !isLanguageOpen"
            >
              <Languages class="size-[18px] shrink-0" stroke-width="2" />
              <span class="hidden xl:inline">{{ activeLanguageTitle }}</span>
              <ChevronDown
                class="hidden size-4 transition-transform xl:block"
                :class="isLanguageOpen ? 'rotate-180' : ''"
                stroke-width="2"
              />
            </button>

            <div
              v-if="isLanguageOpen"
              class="absolute right-0 top-[44px] z-50 w-44 rounded-xl border border-[#e0e3e0] bg-white p-1.5 shadow-[0_14px_35px_rgba(20,24,21,0.16)] dark:border-[#383b39] dark:bg-[#202220] dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
            >
              <button
                v-for="language in languageOptions"
                :key="language.name"
                type="button"
                class="flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60"
                :class="
                  activeLanguage === language.name
                    ? 'bg-[#e8f5ff] text-[#172018] dark:bg-[#294052] dark:text-white'
                    : 'hover:bg-[#f1f3f1] dark:hover:bg-[#2d302e]'
                "
                :disabled="isChangingLanguage"
                @click="switchLanguage(language.name)"
              >
                <span>{{ language.title }}</span>
                <Check
                  v-if="activeLanguage === language.name"
                  class="size-4 text-[#278bff]"
                  stroke-width="2.5"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg transition hover:bg-[#eef0ee] dark:hover:bg-[#292c2a]"
            :aria-label="theme === 'dark' ? tt('切换到浅色模式') : tt('切换到深色模式')"
            @click="toggleTheme"
          >
            <Moon v-if="theme === 'dark'" class="size-5" stroke-width="2" />
            <Sun v-else class="size-5" stroke-width="2" />
          </button>

          <a
            href="https://github.com/zhenshiz/Amagari-Studio-Web"
            target="_blank"
            rel="noopener noreferrer"
            class="grid size-9 place-items-center rounded-lg transition hover:bg-[#eef0ee] dark:hover:bg-[#292c2a]"
            :aria-label="tt('查看 GitHub 仓库')"
            :title="tt('查看 GitHub 仓库')"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" class="size-5 fill-current">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.69c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg transition hover:bg-[#eef0ee] dark:hover:bg-[#292c2a] lg:hidden"
            :aria-label="isMenuOpen ? tt('关闭菜单') : tt('打开菜单')"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <X v-if="isMenuOpen" class="size-5" stroke-width="2" />
            <Menu v-else class="size-5" stroke-width="2" />
          </button>
        </div>
      </div>

      <div
        v-if="isMenuOpen"
        class="border-t border-[#e1e4e1] bg-white px-4 py-4 dark:border-[#343737] dark:bg-[#171818] lg:hidden"
      >
        <div class="mx-auto grid max-w-2xl gap-4">
          <nav class="grid grid-cols-2 gap-2" :aria-label="tt('移动端导航')">
            <HoverLineLink
              v-for="item in navItems"
              :key="item.href"
              :href="item.href"
              :is-router="!item.external"
              hover-line-type="none"
              class="!justify-start rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#eef0ee] dark:hover:bg-[#292c2a]"
              @callback="isMenuOpen = false"
            >
              {{ item.label }}
            </HoverLineLink>
          </nav>
        </div>
      </div>
    </header>

    <RouterView />
    <MapSearchDialog v-model:show="isSearchOpen" />
    <CommunityDialog v-model:show="isCommunityDialogOpen" />
  </div>
</template>
