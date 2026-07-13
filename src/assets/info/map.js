import fabricIcon from '@/assets/icons/loaders/fabric.svg'
import forgeIcon from '@/assets/icons/loaders/forge.svg'
import neoforgeIcon from '@/assets/icons/loaders/neoforge.svg'
import vanillaIcon from '@/assets/icons/loaders/vanilla.svg'
import bilibiliIcon from '@/assets/icons/sites/bilibili.svg'
import curseforgeIcon from '@/assets/icons/sites/curseforge.svg'
import minecraftMapsIcon from '@/assets/icons/sites/minecraft-maps.svg'
import modrinthIcon from '@/assets/icons/sites/modrinth.svg'
import planetMinecraftIcon from '@/assets/icons/sites/planet-minecraft.svg'

/**
 * 创建带显示元数据的只读枚举。
 *
 * 枚举成员本身仍是稳定字符串，例如 `MapLoader.VANILLA === 'VANILLA'`；
 * `values()`、`getLabel()` 和 `getMeta()` 用于渲染筛选项、标签和图标。
 * label 保存翻译键，由页面通过 `tt()` 翻译，避免数据层依赖 Vue。
 *
 * @template {Record<string, string | { label: string, [key: string]: unknown }>} T
 * @param {T} definition
 * @returns {Readonly<Record<keyof T, keyof T>> & {
 *   values: () => Array<{ value: keyof T, label: string, [key: string]: unknown }>,
 *   getLabel: (value: keyof T) => string,
 *   getMeta: (value: keyof T) => Readonly<{ label: string, [key: string]: unknown }> | undefined
 * }}
 */
export const createEnum = (definition) => {
  const enumObject = {}
  const metaMap = {}

  Object.entries(definition).forEach(([key, option]) => {
    enumObject[key] = key
    metaMap[key] = Object.freeze(typeof option === 'string' ? { label: option } : { ...option })
  })

  Object.defineProperties(enumObject, {
    values: {
      value: () =>
        Object.entries(metaMap).map(([value, meta]) => ({
          value,
          ...meta,
        })),
      enumerable: false,
    },
    getLabel: {
      value: (value) => metaMap[value]?.label || '',
      enumerable: false,
    },
    getMeta: {
      value: (value) => metaMap[value],
      enumerable: false,
    },
  })

  return Object.freeze(enumObject)
}

export const MapLoader = createEnum({
  VANILLA: {
    label: '原版',
    icon: vanillaIcon,
    background: '#dcefb4',
    foreground: '#24431f',
  },
  FORGE: {
    label: 'Forge',
    icon: forgeIcon,
    background: '#f1cbc3',
    foreground: '#57241e',
  },
  FABRIC: {
    label: 'Fabric',
    icon: fabricIcon,
    background: '#eadfce',
    foreground: '#483c30',
  },
  NEOFORGE: {
    label: 'NeoForge',
    icon: neoforgeIcon,
    background: '#ffd8b5',
    foreground: '#572b12',
  },
})

export const MaintenanceStatus = createEnum({
  MAINTAINING: {
    label: '维护中',
    background: '#d8f461',
    foreground: '#172018',
  },
  DISCONTINUED: {
    label: '停止维护',
    background: '#ff9b78',
    foreground: '#3f1710',
  },
})

export const RelatedSite = createEnum({
  BILIBILI: {
    label: '哔哩哔哩',
    icon: bilibiliIcon,
    background: '#ffecf3',
    foreground: '#d43d73',
  },
  CURSEFORGE: {
    label: 'CurseForge',
    icon: curseforgeIcon,
    background: '#ffded3',
    foreground: '#9e321f',
  },
  MODRINTH: {
    label: 'Modrinth',
    icon: modrinthIcon,
    background: '#dff5e7',
    foreground: '#176b3d',
  },
  MINECRAFT_MAPS: {
    label: 'Minecraft Maps',
    icon: minecraftMapsIcon,
    background: '#dcefb4',
    foreground: '#24431f',
  },
  PLANET_MINECRAFT: {
    label: 'Planet Minecraft',
    icon: planetMinecraftIcon,
    background: '#dceffc',
    foreground: '#18516c',
  },
})

/**
 * @typedef {Object} RelatedLink
 * @property {string} site RelatedSite 枚举值
 * @property {string} url 外部链接
 * @property {string} [text] 自定义链接文案；省略时使用站点枚举标签
 */

/**
 * @typedef {Object} MapInfo
 * @property {string} id 稳定的页面内部标识
 * @property {string} bvid Bilibili BV 号，用于在前端请求视频封面
 * @property {string} name 地图名
 * @property {string} subtitle 副标题或英文原名
 * @property {string} description 地图列表中的简短介绍
 * @property {string} author 地图原作者
 * @property {string} lastUpdated 最后更新日期，ISO 8601（YYYY-MM-DD）
 * @property {string} downloadUrl 下载页链接
 * @property {boolean} isOfficialLocalization 是否获得官方汉化授权
 * @property {{provider: string, url: string, installGuideUrl: string}} localizationDownload 汉化文件下载信息
 * @property {string} gameVersion Minecraft 游戏版本
 * @property {string} loader MapLoader 枚举值
 * @property {string} adaptedVersion 当前汉化适配版本
 * @property {string} maintenanceStatus MaintenanceStatus 枚举值
 * @property {RelatedLink[]} relatedLinks 相关站点链接
 */

/** @type {ReadonlyArray<Readonly<MapInfo>>} */
export const maps = Object.freeze(
  [
    {
      id: 'battle-of-the-bands',
      bvid: 'BV1SY97BwE57',
      name: '萨利姆的乐队大战',
      subtitle: 'Battle of the Bands',
      description: '使用乐器迎战敌人，在 Minecraft 中体验一场融合音乐演奏与地牢战斗的乐队大战。',
      author: 'FingerMaps',
      lastUpdated: '2026-04-01',
      downloadUrl: 'https://www.minecraftmaps.com/51795-battle-of-the-bands',
      isOfficialLocalization: false,
      localizationDownload: {
        provider: '蓝奏云（密码：xaleem）',
        url: 'https://wwawx.lanzouw.com/iaF9m3m3q1sj',
        installGuideUrl: '/install',
      },
      gameVersion: '1.21.11',
      loader: MapLoader.VANILLA,
      adaptedVersion: '未标注',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '宣传片与汉化教程',
          url: 'https://www.bilibili.com/video/BV1SY97BwE57/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/51795-battle-of-the-bands',
        },
        {
          site: RelatedSite.PLANET_MINECRAFT,
          text: 'Planet Minecraft 原作页',
          url: 'https://www.planetminecraft.com/project/battle-of-the-bands/',
        },
      ],
    },
    {
      id: 'business-battle',
      bvid: 'BV1BdVU6KEjZ',
      name: '商战模拟器',
      subtitle: 'Business Battle',
      description:
        '一张双人经营对抗小游戏。两名玩家在街区经营店铺，制作并出售商品、检查违禁品并利用其他商店补充资源，率先达到目标资金即可获胜。',
      author: 'Rastyanutiy, monttii23',
      lastUpdated: '2026-05-31',
      downloadUrl: 'https://www.minecraftmaps.com/52375-business-battle',
      isOfficialLocalization: true,
      localizationDownload: {
        provider: 'Minecraft Maps',
        url: 'https://www.minecraftmaps.com/52375-business-battle',
        installGuideUrl: '/install',
      },
      gameVersion: '26.1.2',
      loader: MapLoader.VANILLA,
      adaptedVersion: '未标注',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '汉化发布视频',
          url: 'https://www.bilibili.com/video/BV1BdVU6KEjZ/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/52375-business-battle',
        },
      ],
    },
    {
      id: 'funkalot',
      bvid: 'BV1AgwtzMEbA',
      name: 'Funk风云',
      subtitle: 'Funkalot',
      description:
        '一张将 5 键下落式音游带入 Minecraft 的节奏地图，玩家将在多首曲目与关卡中跟随音乐完成按键挑战。',
      author: 'TEHEK',
      lastUpdated: '2026-03-22',
      downloadUrl: 'https://www.minecraftmaps.com/51339-funkalot',
      isOfficialLocalization: true,
      localizationDownload: {
        provider: 'Minecraft Maps',
        url: 'https://www.minecraftmaps.com/51339-funkalot',
        installGuideUrl: '/install',
      },
      gameVersion: '1.21.8',
      loader: MapLoader.VANILLA,
      adaptedVersion: '未标注',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '观看发布视频',
          url: 'https://www.bilibili.com/video/BV1AgwtzMEbA/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/51339-funkalot',
        },
        {
          site: RelatedSite.PLANET_MINECRAFT,
          text: 'Planet Minecraft 原作页',
          url: 'https://www.planetminecraft.com/project/funkalot/',
        },
      ],
    },
    {
      id: 'from-the-shelves',
      bvid: 'BV12ZcEzJE1B',
      name: '小鬼当“架”',
      subtitle: 'From The shElves',
      description:
        '节日前夜，误以为家中进贼的孩子撞上了正在准备惊喜的精灵，一场地图追逐小游戏就此开始。',
      author: 'Surena Studio',
      lastUpdated: '2026-02-13',
      downloadUrl: 'https://www.minecraftmaps.com/51803-from-the-shelves',
      isOfficialLocalization: true,
      localizationDownload: {
        provider: 'Minecraft Maps',
        url: 'https://www.minecraftmaps.com/51803-from-the-shelves',
        installGuideUrl: '/install',
      },
      gameVersion: '1.21.11',
      loader: MapLoader.VANILLA,
      adaptedVersion: '1.0',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '宣传片与汉化教程',
          url: 'https://www.bilibili.com/video/BV12ZcEzJE1B/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/51803-from-the-shelves',
        },
        {
          site: RelatedSite.PLANET_MINECRAFT,
          text: 'Planet Minecraft 原作页',
          url: 'https://www.planetminecraft.com/project/from-the-shelves-holidays-minigame-6819616',
        },
      ],
    },
    {
      id: 'super-mace-bros',
      bvid: 'BV1QooXBVEPA',
      name: '超级重锤帮',
      subtitle: 'Super Mace Bros',
      description:
        '支持 2–8 人同场对战的重锤 PVP 小游戏，利用高处坠落、二段跳、道具与强化击飞对手，成为最后的幸存者。',
      author: 'zedfffffffffffff, mettrecube & Meekanographie',
      lastUpdated: '2026-04-26',
      downloadUrl: 'https://www.minecraftmaps.com/52298-super-mace-bros',
      isOfficialLocalization: false,
      localizationDownload: {
        provider: '蓝奏云（密码：amagar）',
        url: 'https://wwals.lanzn.com/iaGdJ3o25jti',
        installGuideUrl: '/install',
      },
      gameVersion: '26.1.2',
      loader: MapLoader.VANILLA,
      adaptedVersion: '1.0',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '汉化发布视频',
          url: 'https://www.bilibili.com/video/BV1QooXBVEPA/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/52298-super-mace-bros',
        },
      ],
    },
    {
      id: 'rhythm-mining',
      bvid: 'BV1mRLj6eEFp',
      name: '律动矿脉',
      subtitle: 'Rhythm Mining',
      description:
        '将挖矿与节奏游戏结合的单人音乐地图，跟随节拍挖掘方块，在多档判定、连击、分数与高难曲目中挑战节奏感。',
      author: 'Sasterisk24',
      lastUpdated: '2026-05-17',
      downloadUrl: 'https://www.minecraftmaps.com/52507-rhythm-mining',
      isOfficialLocalization: true,
      localizationDownload: {
        provider: 'Minecraft Maps',
        url: 'https://www.minecraftmaps.com/52507-rhythm-mining',
        installGuideUrl: '/install',
      },
      gameVersion: '1.21.11',
      loader: MapLoader.VANILLA,
      adaptedVersion: '1.0',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '汉化发布视频',
          url: 'https://www.bilibili.com/video/BV1mRLj6eEFp/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/52507-rhythm-mining',
        },
      ],
    },
    {
      id: 'the-dark-ship',
      bvid: 'BV1iz7k6tE6W',
      name: '冥舟',
      subtitle: 'The Dark Ship',
      description:
        '登上一艘黑暗废弃的远洋客轮，探索船舱、破解谜题、调查乘客的遭遇，并在深海中的黑暗找到你之前设法逃离。',
      author: 'zannLeft',
      lastUpdated: '2026-05-18',
      downloadUrl: 'https://www.minecraftmaps.com/52345-the-dark-ship',
      isOfficialLocalization: true,
      localizationDownload: {
        provider: 'Minecraft Maps',
        url: 'https://www.minecraftmaps.com/52345-the-dark-ship',
        installGuideUrl: '/install',
      },
      gameVersion: '26.1.2',
      loader: MapLoader.VANILLA,
      adaptedVersion: '1.2.2',
      maintenanceStatus: MaintenanceStatus.MAINTAINING,
      relatedLinks: [
        {
          site: RelatedSite.BILIBILI,
          text: '汉化发布视频',
          url: 'https://www.bilibili.com/video/BV1iz7k6tE6W/',
        },
        {
          site: RelatedSite.MINECRAFT_MAPS,
          text: 'Minecraft Maps 原作页',
          url: 'https://www.minecraftmaps.com/52345-the-dark-ship',
        },
      ],
    },
  ].map((map) =>
    Object.freeze({
      ...map,
      localizationDownload: Object.freeze({ ...map.localizationDownload }),
      relatedLinks: Object.freeze(map.relatedLinks.map((link) => Object.freeze({ ...link }))),
    }),
  ),
)

export default maps
