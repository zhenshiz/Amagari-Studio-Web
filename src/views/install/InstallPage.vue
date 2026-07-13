<script setup>
import { computed } from 'vue'
import {
  Archive,
  BookOpenCheck,
  Box,
  Check,
  Download,
  FolderArchive,
  FolderOpen,
  Gamepad2,
  MapPinned,
  PackageOpen,
} from '@lucide/vue'

import PixelButton from '@/components/PixelButton.vue'
import PixelFrame from '@/components/PixelFrame.vue'
import { useLocaleText } from '@/utils/useLocaleText.js'

const { tt } = useLocaleText()

const officialSteps = computed(() => [
  {
    icon: Download,
    title: tt('下载完整地图'),
    text: tt('在地图详情页点击“下载汉化”，从提供的下载页面获取已经包含中文内容的地图。'),
  },
  {
    icon: FolderArchive,
    title: tt('解压地图文件'),
    text: tt('解压下载文件，并确认地图文件夹中可以看到 level.dat。'),
  },
  {
    icon: Gamepad2,
    title: tt('放入存档并启动'),
    text: tt('把地图文件夹放入 saves 目录，然后使用详情页标注的 Minecraft 版本进入游戏。'),
  },
])

const communitySteps = computed(() => [
  {
    icon: MapPinned,
    title: tt('下载原地图'),
    text: tt('先从地图详情页提供的原作链接下载原地图，并将地图文件夹放入 saves 目录。'),
  },
  {
    icon: PackageOpen,
    title: tt('下载汉化资源包'),
    text: tt('再从“下载汉化”弹窗提供的网盘链接获取汉化资源包。资源包通常不需要解压。'),
  },
  {
    icon: Check,
    title: tt('启用汉化资源包'),
    text: tt('将资源包放入 resourcepacks 目录，在游戏设置中把它移动到已选资源包一侧。'),
  },
])
</script>

<template>
  <main class="min-h-[calc(100vh-60px)] pb-14">
    <section
      class="pixel-grid border-b-[3px] border-[var(--ink)] bg-[#dcefb4] text-[#172018] dark:bg-[#26372c] dark:text-[#f2f1e8]"
    >
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div
          class="inline-flex items-center gap-2 border-2 border-[#172018] bg-[#f8fbf2] px-3 py-1.5 font-mono text-[11px] font-black text-[#172018] shadow-[3px_3px_0_#172018]"
        >
          <BookOpenCheck class="size-4" stroke-width="2.6" />
          AMAGARI · INSTALL GUIDE
        </div>
        <h1 class="mt-5 font-mono text-3xl font-black leading-tight sm:text-5xl">
          {{ tt('安装汉化') }}
        </h1>
        <p class="mt-3 max-w-3xl text-sm font-bold leading-7 opacity-75 sm:text-base">
          {{
            tt(
              '根据地图的汉化授权方式选择对应流程。官方汉化通常直接下载完整地图，社区汉化则需要单独安装资源包。',
            )
          }}
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div class="grid gap-7 lg:grid-cols-2">
        <PixelFrame bg-color="#ffffff" shadow-x="6px" shadow-y="6px">
          <article class="p-4 sm:p-6">
            <div class="flex items-start gap-4">
              <span
                class="grid size-12 shrink-0 place-items-center border-[3px] border-[var(--ink)] bg-[#d8f461] text-[#172018] shadow-[4px_4px_0_var(--ink)] dark:shadow-[4px_4px_0_#59645c]"
              >
                <Box class="size-6" stroke-width="2.6" />
              </span>
              <div>
                <p
                  class="font-mono text-[10px] font-black uppercase text-[#66812b] dark:text-[#d8f461]"
                >
                  OFFICIAL LOCALIZATION
                </p>
                <h2 class="mt-1 font-mono text-xl font-black sm:text-2xl">
                  {{ tt('官方汉化地图') }}
                </h2>
                <p class="mt-2 text-xs font-bold leading-6 text-[#657168] dark:text-[#adb5af]">
                  {{ tt('下载完整地图后即可游玩，不需要再单独安装汉化资源包。') }}
                </p>
              </div>
            </div>

            <ol class="mt-6 grid gap-4">
              <li
                v-for="(step, index) in officialSteps"
                :key="step.title"
                class="grid grid-cols-[36px_minmax(0,1fr)] gap-3 border-t-2 border-dashed border-[#a7b0a8] pt-4 dark:border-[#555b57]"
              >
                <span
                  class="grid size-9 place-items-center border-2 border-[var(--ink)] bg-[#eef6cd] font-mono text-xs font-black dark:bg-[#30381d]"
                >
                  {{ index + 1 }}
                </span>
                <div>
                  <h3 class="flex items-center gap-2 font-mono text-sm font-black">
                    <component :is="step.icon" class="size-4" stroke-width="2.5" />
                    {{ step.title }}
                  </h3>
                  <p
                    class="mt-1.5 text-xs font-semibold leading-6 text-[#657168] dark:text-[#adb5af]"
                  >
                    {{ step.text }}
                  </p>
                </div>
              </li>
            </ol>
          </article>
        </PixelFrame>

        <PixelFrame bg-color="#ffffff" shadow-x="6px" shadow-y="6px">
          <article class="p-4 sm:p-6">
            <div class="flex items-start gap-4">
              <span
                class="grid size-12 shrink-0 place-items-center border-[3px] border-[var(--ink)] bg-[#77d9ea] text-[#172018] shadow-[4px_4px_0_var(--ink)] dark:shadow-[4px_4px_0_#59645c]"
              >
                <Archive class="size-6" stroke-width="2.6" />
              </span>
              <div>
                <p
                  class="font-mono text-[10px] font-black uppercase text-[#24798a] dark:text-[#77d9ea]"
                >
                  COMMUNITY LOCALIZATION
                </p>
                <h2 class="mt-1 font-mono text-xl font-black sm:text-2xl">
                  {{ tt('社区汉化资源包') }}
                </h2>
                <p class="mt-2 text-xs font-bold leading-6 text-[#657168] dark:text-[#adb5af]">
                  {{ tt('原地图与汉化资源包需要分别下载，并在进入地图前启用资源包。') }}
                </p>
              </div>
            </div>

            <ol class="mt-6 grid gap-4">
              <li
                v-for="(step, index) in communitySteps"
                :key="step.title"
                class="grid grid-cols-[36px_minmax(0,1fr)] gap-3 border-t-2 border-dashed border-[#a7b0a8] pt-4 dark:border-[#555b57]"
              >
                <span
                  class="grid size-9 place-items-center border-2 border-[var(--ink)] bg-[#dff7fb] font-mono text-xs font-black dark:bg-[#203b40]"
                >
                  {{ index + 1 }}
                </span>
                <div>
                  <h3 class="flex items-center gap-2 font-mono text-sm font-black">
                    <component :is="step.icon" class="size-4" stroke-width="2.5" />
                    {{ step.title }}
                  </h3>
                  <p
                    class="mt-1.5 text-xs font-semibold leading-6 text-[#657168] dark:text-[#adb5af]"
                  >
                    {{ step.text }}
                  </p>
                </div>
              </li>
            </ol>
          </article>
        </PixelFrame>
      </div>

      <div class="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <PixelFrame bg-color="#ffffff" shadow-x="6px" shadow-y="6px" class="min-w-0">
          <section class="min-w-0 p-4 sm:p-6">
            <div class="flex items-center gap-3">
              <span
                class="grid size-10 place-items-center border-2 border-[var(--ink)] bg-[#ff9b78] text-[#172018] shadow-[3px_3px_0_var(--ink)] dark:shadow-[3px_3px_0_#59645c]"
              >
                <FolderOpen class="size-5" stroke-width="2.6" />
              </span>
              <h2 class="font-mono text-xl font-black">{{ tt('地图与资源包目录') }}</h2>
            </div>

            <p class="mt-4 text-xs font-semibold leading-6 text-[#657168] dark:text-[#adb5af]">
              {{
                tt('请先在启动器中打开当前游戏实例的 Minecraft 目录，然后进入下面对应的子目录。')
              }}
            </p>

            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div
                class="border-[3px] border-[var(--ink)] bg-[#eef6cd] p-4 shadow-[4px_4px_0_var(--ink)] dark:bg-[#30381d] dark:shadow-[4px_4px_0_#59645c]"
              >
                <div class="flex items-center gap-2 font-mono text-sm font-black">
                  <MapPinned class="size-5" stroke-width="2.6" />
                  {{ tt('地图目录') }}
                </div>
                <code
                  class="mt-4 block border-2 border-[var(--ink)] bg-white px-3 py-2.5 font-mono text-sm font-black text-[#172018] dark:bg-[#1d1f1e] dark:text-[#f2f1e8]"
                >
                  saves
                </code>
                <p class="mt-3 text-xs font-semibold text-[#657168] dark:text-[#adb5af]">
                  {{ tt('地图存档文件夹放在这里。') }}
                </p>
              </div>

              <div
                class="border-[3px] border-[var(--ink)] bg-[#dff7fb] p-4 shadow-[4px_4px_0_var(--ink)] dark:bg-[#203b40] dark:shadow-[4px_4px_0_#59645c]"
              >
                <div class="flex items-center gap-2 font-mono text-sm font-black">
                  <PackageOpen class="size-5" stroke-width="2.6" />
                  {{ tt('资源包目录') }}
                </div>
                <code
                  class="mt-4 block border-2 border-[var(--ink)] bg-white px-3 py-2.5 font-mono text-sm font-black text-[#172018] dark:bg-[#1d1f1e] dark:text-[#f2f1e8]"
                >
                  resourcepacks
                </code>
                <p class="mt-3 text-xs font-semibold text-[#657168] dark:text-[#adb5af]">
                  {{ tt('汉化资源包文件放在这里。') }}
                </p>
              </div>
            </div>
          </section>
        </PixelFrame>

        <PixelFrame bg-color="#ffffff" shadow-x="6px" shadow-y="6px">
          <aside class="p-4 sm:p-5">
            <h2 class="font-mono text-lg font-black">{{ tt('安装提示') }}</h2>
            <ul
              class="mt-4 grid gap-3 text-xs font-semibold leading-6 text-[#657168] dark:text-[#adb5af]"
            >
              <li class="border-l-[3px] border-[#d8f461] pl-3">
                {{
                  tt(
                    '地图文件夹内应该直接包含 level.dat；如果外面还有一层同名文件夹，请使用里面那一层。',
                  )
                }}
              </li>
              <li class="border-l-[3px] border-[#77d9ea] pl-3">
                {{ tt('汉化资源包通常保持 ZIP 格式即可，不要在没有说明时解压。') }}
              </li>
              <li class="border-l-[3px] border-[#ff9b78] pl-3">
                {{ tt('如果文字没有变化，请确认资源包已经启用，并且位于其他同类资源包上方。') }}
              </li>
            </ul>

            <div class="mt-6">
              <PixelButton
                :text="tt('返回地图列表')"
                to="/map"
                width="100%"
                bg-color="#77d9ea"
                hover-bg-color="#91e5f2"
              />
            </div>
          </aside>
        </PixelFrame>
      </div>
    </section>
  </main>
</template>
