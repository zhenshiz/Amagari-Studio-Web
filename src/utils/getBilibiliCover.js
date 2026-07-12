const BILIBILI_VIEW_API = 'https://api.bilibili.com/x/web-interface/view'
const COVER_TIMEOUT = 8000
const coverRequests = new Map()

let callbackId = 0

const normalizeCoverUrl = (url) => (url ? url.replace(/^http:/, 'https:') : '')

/**
 * 通过 Bilibili 的 JSONP 接口读取视频封面。
 *
 * 普通 fetch 会受到 Bilibili CORS 限制；JSONP 能在纯前端部署中使用。
 * 请求失败时返回空字符串，由卡片展示像素占位图，不阻塞其余信息。
 *
 * @param {string} bvid
 * @returns {Promise<string>}
 */
export const getBilibiliCover = (bvid) => {
  if (!bvid || typeof document === 'undefined' || typeof window === 'undefined') {
    return Promise.resolve('')
  }

  if (coverRequests.has(bvid)) {
    return coverRequests.get(bvid)
  }

  const request = new Promise((resolve) => {
    callbackId += 1
    const callbackName = `__amagari_bilibili_cover_${Date.now()}_${callbackId}`
    const script = document.createElement('script')
    let settled = false

    const finish = (coverUrl = '') => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      script.remove()
      delete window[callbackName]
      resolve(normalizeCoverUrl(coverUrl))
    }

    const timeout = window.setTimeout(() => finish(), COVER_TIMEOUT)

    window[callbackName] = (response) => {
      finish(response?.code === 0 ? response.data?.pic : '')
    }

    script.async = true
    script.onerror = () => finish()
    script.src = `${BILIBILI_VIEW_API}?bvid=${encodeURIComponent(bvid)}&jsonp=jsonp&callback=${callbackName}`
    document.head.appendChild(script)
  })

  coverRequests.set(bvid, request)
  return request
}
