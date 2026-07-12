import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

const offlineHtmlPlugin = () => ({
  name: 'amagari-offline-html',
  enforce: 'post',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const favicon = readFileSync(
        fileURLToPath(new URL('./src/assets/favicon.svg', import.meta.url)),
      )
      const faviconDataUrl = `data:image/svg+xml;base64,${favicon.toString('base64')}`

      return html
        .replace('/src/assets/favicon.svg', faviconDataUrl)
        .replace(/\s*<link rel="alternate icon"[^>]*\/>/, '')
        .replace(/\s*<link rel="apple-touch-icon"[^>]*\/>/, '')
    },
  },
  generateBundle(_options, bundle) {
    const html = bundle['index.html']
    if (!html) return

    delete bundle['index.html']
    html.fileName = 'Amagari.html'
    bundle['Amagari.html'] = html
  },
})

export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline'

  return {
    plugins: [
      !isOffline &&
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['./src/stores', './src/components', './src/components/form', './src/languages'],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      isOffline && viteSingleFile(),
      isOffline && offlineHtmlPlugin(),
    ].filter(Boolean),
    assetsInclude: ['**/*.md'],
    optimizeDeps: {
      include: ['vue'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: ['es2015', 'chrome63'],
      outDir: isOffline ? 'dist-offline' : 'dist',
      copyPublicDir: !isOffline,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    base: isOffline ? './' : '/',
  }
})
