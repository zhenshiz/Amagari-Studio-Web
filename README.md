# Amagari Studio 官网

Amagari Studio 的 Minecraft 地图汉化与中文发布网站。

项目使用 Vue 3、Vue Router、Vite 和 Tailwind CSS 构建，整体采用 Minecraft 像素风格，并提供地图资料、汉化安装说明、汉化工具、团队介绍、社区入口以及简体中文、繁体中文和英文界面。

## 功能

- 首页展示工作室定位、汉化作品和协作流程。
- 地图列表支持按地图名称、副标题和简介搜索，并可按版本、加载器和维护状态筛选。
- 地图详情展示版本、加载器、汉化状态、下载入口、相关网站和多语言 Markdown 文档。
- 提供汉化安装说明和汉化工具页面。
- “关于我们”页面展示团队成员及其 Minecraft 皮肤头像。
- 社区弹窗集中展示 QQ 群、Discord 和 Bilibili 官号。
- 支持简体中文、繁体中文和英文。
- 支持浅色与深色主题。
- 支持普通网站构建和可直接双击打开的离线单文件构建。

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite 5](https://vite.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Tiptap](https://tiptap.dev/) Markdown 渲染
- [Mermaid](https://mermaid.js.org/) 图表
- [KaTeX](https://katex.org/) 数学公式
- [VoerkaI18n](https://zhangfisher.github.io/voerka-i18n/) 多语言支持
- [Lucide](https://lucide.dev/) 图标

## 环境要求

- Node.js 18 或更高版本
- pnpm 8 或更高版本

项目在 `package.json` 中声明了 `pnpm@8.11.0`。建议使用 Corepack 启用对应版本：

```bash
corepack enable
corepack prepare pnpm@8.11.0 --activate
```

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

Vite 默认会在 `http://localhost:5173` 提供本地页面。

## 构建与预览

### 普通网站构建

```bash
pnpm build
```

产物位于 `dist/`。普通构建使用 History Router，部署时服务器需要将未知路径回退到 `index.html`，否则直接访问 `/map`、`/about` 等地址可能返回 404。

可以在本地预览构建结果：

```bash
pnpm preview
```

### 离线单文件构建

```bash
pnpm build:offline
```

产物为：

```text
dist-offline/Amagari.html
```

可以把这个 HTML 文件单独发给其他人。接收者不需要安装 Node.js，也不需要启动本地服务器，直接双击即可在现代浏览器中打开。

离线构建会：

- 将 JavaScript、CSS、字体、站点图标和地图 Markdown 文档内联到 HTML。
- 使用 Hash Router，使 `file://` 协议下的页面跳转和刷新正常工作。
- 不生成需要额外携带的 JS、CSS 或资源目录。

以下内容仍依赖网络：

- Bilibili 视频封面。
- 通过 Minotar 获取的 Minecraft 成员头像。
- 地图下载和相关网站等外部链接。
- QQ、Discord 和 Bilibili 社区链接。

断网不会阻止网站主体、路由和地图文档打开；外部图片可能显示占位内容，外部链接则需要联网后才能访问。

## 内容维护

网站是纯前端项目，公开内容主要保存在 `src/assets/info/`，无需数据库或后端服务。

### 地图资料

地图数据、枚举和图标元数据位于：

```text
src/assets/info/map.js
```

每个地图对象的主要字段如下：

```js
{
  id: 'from-the-shelves',
  bvid: 'BV12ZcEzJE1B',
  name: '小鬼当“架”',
  subtitle: 'From The shElves',
  description: '地图列表中的简短介绍',
  author: 'Surena Studio',
  lastUpdated: '2026-02-13',
  downloadUrl: 'https://example.com',
  isOfficialLocalization: true,
  localizationDownload: {
    provider: '下载来源',
    url: 'https://example.com',
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
      url: 'https://www.bilibili.com/video/BV...',
    },
  ],
}
```

目前支持的加载器枚举：

- `MapLoader.VANILLA`
- `MapLoader.FORGE`
- `MapLoader.FABRIC`
- `MapLoader.NEOFORGE`

目前支持的相关网站枚举：

- `RelatedSite.BILIBILI`
- `RelatedSite.CURSEFORGE`
- `RelatedSite.MODRINTH`
- `RelatedSite.MINECRAFT_MAPS`
- `RelatedSite.PLANET_MINECRAFT`

`bvid` 用于获取 Bilibili 视频封面。由于封面来自外部服务，加载失败时页面会使用占位内容，不会影响地图信息展示。

### 地图详情文档

地图的多语言 Markdown 文档放在：

```text
src/assets/map-documents/<地图 id>/zh_CN.md
src/assets/map-documents/<地图 id>/zh_TW.md
src/assets/map-documents/<地图 id>/en_US.md
```

新增文档后，还需要在下面的文件中导入并登记：

```text
src/assets/info/mapDocuments.js
```

数据对象的 `id`、文档目录名和 `mapDocuments` 中的键必须保持一致。文档会在构建时直接打进产物，因此普通部署和离线单文件都不需要运行时请求 Markdown 文件。

### 团队成员

团队成员资料位于：

```text
src/assets/info/team.js
```

成员结构：

```js
{
  name: '成员名称',
  role: '成员身份',
  description: '成员介绍',
  minecraftSkinId: 'Minecraft 玩家名或皮肤 ID',
}
```

页面会使用 `minecraftSkinId` 从 Minotar 获取 Minecraft 头像，因此头像需要网络连接才能加载。

### 社区资料

QQ 群、Discord 和 Bilibili 信息位于：

```text
src/assets/info/community.js
```

当前公开信息：

- QQ 群：`1061833862`
- Discord：项目现有频道地址
- Bilibili：`雨霁Amagari`

QQ 按钮目前使用 `mqqapi://` 尝试唤起 QQ 客户端，同时在弹窗中明确展示群号作为兜底。真正的 QQ 网页加群链接包含群主分享时生成的签名参数，不能只根据群号推导；取得“分享群聊”生成的真实链接后，可直接替换 `communityInfo.qq.joinUrl`。

Discord 当前配置的是频道地址，只适合已经加入服务器且拥有权限的用户。面向新用户发布时，建议将 `communityInfo.discord.url` 替换为 `https://discord.gg/...` 形式的有效邀请链接。

### 汉化工具文档

汉化工具页面的多语言 Markdown 内容位于：

```text
src/assets/tools/zh-CN.md
src/assets/tools/zh-TW.md
src/assets/tools/en-US.md
```

### 界面翻译

三种语言的界面文案位于：

```text
src/languages/messages/zh-CN.js
src/languages/messages/zh-TW.js
src/languages/messages/en-US.js
```

新增界面文案时，请在三份文件中使用相同的中文键，并补齐对应翻译。

## 主要目录

```text
src/
├── assets/
│   ├── icons/                 # 加载器和相关网站图标
│   ├── info/                  # 地图、文档、成员和社区数据
│   ├── map-documents/         # 地图详情 Markdown
│   └── tools/                 # 汉化工具 Markdown
├── components/
│   ├── map/                   # 地图卡片、搜索和下载弹窗
│   └── markdown/              # Markdown 渲染组件与扩展
├── composables/               # 弹窗、消息等共享状态
├── languages/                 # 多语言配置与文案
├── router/                    # 页面路由
├── styles/                    # 全局样式
├── utils/                     # 通用工具
└── views/                     # 首页、地图、安装、工具和团队页面
```

## 代码检查

检查项目代码：

```bash
pnpm exec eslint .
```

检查代码格式：

```bash
pnpm exec prettier --check .
```

格式化代码：

```bash
pnpm exec prettier --write .
```

项目当前没有独立的自动化测试脚本。提交内容前至少应执行：

```bash
pnpm exec prettier --check .
pnpm exec eslint .
pnpm build
pnpm build:offline
```

## License

本项目使用 [MIT License](./LICENSE)。
