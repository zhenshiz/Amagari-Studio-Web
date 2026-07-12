<script setup>
import { computed } from 'vue'
import { ArrowRight, Languages, MessageCircle, ShieldCheck, Sparkles, Users } from '@lucide/vue'

import darkLogo from '@/assets/Amagari_logo_font.png'
import lightLogo from '@/assets/Amagari_logo_font_light.png'
import { teamMembers } from '@/assets/info/team.js'
import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { useCommunityDialog } from '@/composables/useCommunityDialog.js'
import { useLocaleText } from '@/utils/useLocaleText.js'

const { tt } = useLocaleText()
const { openCommunityDialog } = useCommunityDialog()

const getMinecraftAvatarUrl = (skinId) =>
  `https://minotar.net/avatar/${encodeURIComponent(skinId)}/128`

const translatedMembers = computed(() =>
  teamMembers.map((member) => ({
    ...member,
    role: tt(member.role),
    description: tt(member.description),
  })),
)

const teamValues = computed(() => [
  {
    icon: Languages,
    title: tt('用心做本地化'),
    description: tt('结合游戏语境处理文本、图片与说明，让中文玩家自然地进入作品。'),
  },
  {
    icon: ShieldCheck,
    title: tt('尊重创作者'),
    description: tt('在开始协作前确认授权、修改范围与发布方式，保留作品原本的表达。'),
  },
  {
    icon: Sparkles,
    title: tt('让好作品被看见'),
    description: tt('整理中文介绍、宣传素材与发布信息，帮助优秀地图触达更多玩家。'),
  },
])
</script>

<template>
  <main class="overflow-hidden">
    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-5 lg:px-6 lg:py-14">
      <div class="grid items-center gap-8 lg:grid-cols-[1fr_0.72fr] lg:gap-12">
        <div>
          <div
            class="mb-5 inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[#d8f461] px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0_var(--ink)] dark:bg-[#b9d844] dark:text-[#172018]"
          >
            <Users class="size-4" stroke-width="2.5" />
            {{ tt('About Us') }}
          </div>

          <h1 class="font-mono text-4xl font-black tracking-tight sm:text-5xl">
            {{ tt('关于我们') }}
          </h1>
          <p class="mt-5 max-w-2xl text-lg font-black leading-8 sm:text-xl">
            {{ tt('我们是 Amagari Studio，一个专注 Minecraft 地图汉化与中文发布的创作团队。') }}
          </p>
          <p
            class="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#536054] dark:text-[#b8bdb7] sm:text-base"
          >
            {{
              tt(
                '我们与地图创作者合作，完成文本翻译、图片汉化、校对、中文宣传与发布维护，让语言不再成为体验优秀作品的障碍。',
              )
            }}
          </p>

          <PixelButton
            class="mt-7"
            :text="tt('加入社区')"
            width="168px"
            bg-color="#77d9ea"
            hover-bg-color="#91e5f2"
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

        <PixelFrame bg-color="#ffffff" shadow-x="7px" shadow-y="7px">
          <div
            class="grid min-h-64 place-items-center bg-[linear-gradient(90deg,rgba(23,32,24,0.06)_1px,transparent_1px),linear-gradient(rgba(23,32,24,0.06)_1px,transparent_1px)] bg-[size:18px_18px] p-8 dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]"
          >
            <img
              :src="lightLogo"
              alt="Amagari Studio"
              class="w-full max-w-[290px] [image-rendering:pixelated] dark:hidden"
            />
            <img
              :src="darkLogo"
              alt="Amagari Studio"
              class="hidden w-full max-w-[290px] [image-rendering:pixelated] dark:block"
            />
          </div>
        </PixelFrame>
      </div>
    </section>

    <section class="border-y-2 border-[var(--ink)] bg-[#eef7d6] dark:bg-[#1b241c]">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-5 lg:px-6 lg:py-12">
        <p
          class="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#63715f] dark:text-[#aeb7aa]"
        >
          {{ tt('What We Value') }}
        </p>
        <h2 class="mt-2 font-mono text-3xl font-black">{{ tt('我们在意的事') }}</h2>

        <div class="mt-7 grid gap-5 md:grid-cols-3">
          <PixelFrame
            v-for="value in teamValues"
            :key="value.title"
            bg-color="#ffffff"
            shadow-x="4px"
            shadow-y="4px"
          >
            <article class="h-full p-5">
              <div
                class="grid size-11 place-items-center border-2 border-[var(--ink)] bg-[#d8f461] text-[#172018] shadow-[3px_3px_0_var(--ink)]"
              >
                <component :is="value.icon" class="size-5" stroke-width="2.5" />
              </div>
              <h3 class="mt-5 font-mono text-lg font-black">{{ value.title }}</h3>
              <p class="mt-3 text-sm font-semibold leading-6 text-[#59645b] dark:text-[#b8bdb7]">
                {{ value.description }}
              </p>
            </article>
          </PixelFrame>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-5 lg:px-6 lg:py-14">
      <p
        class="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#63715f] dark:text-[#aeb7aa]"
      >
        {{ tt('Team Members') }}
      </p>
      <h2 class="mt-2 font-mono text-3xl font-black">{{ tt('团队成员') }}</h2>
      <p class="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#59645b] dark:text-[#b8bdb7]">
        {{ tt('认识正在参与项目翻译、制作与维护的成员。') }}
      </p>

      <div class="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PixelFrame
          v-for="member in translatedMembers"
          :key="member.name"
          bg-color="#ffffff"
          shadow-x="5px"
          shadow-y="5px"
        >
          <article class="flex h-full flex-col p-5">
            <div class="flex items-center gap-4">
              <div
                class="grid size-16 shrink-0 place-items-center border-2 border-[var(--ink)] bg-[#f2f4e9] dark:bg-[#292c2a]"
              >
                <img
                  :src="getMinecraftAvatarUrl(member.minecraftSkinId)"
                  :alt="`${member.name} Minecraft skin`"
                  class="size-full object-cover [image-rendering:pixelated]"
                />
              </div>
              <div class="min-w-0">
                <h3 class="truncate font-mono text-xl font-black">{{ member.name }}</h3>
                <p class="mt-1 text-sm font-black text-[#687568] dark:text-[#b5bcb5]">
                  {{ member.role }}
                </p>
              </div>
            </div>

            <p class="mt-5 text-sm font-semibold leading-6 text-[#59645b] dark:text-[#b8bdb7]">
              {{ member.description }}
            </p>
          </article>
        </PixelFrame>
      </div>
    </section>
  </main>
</template>
