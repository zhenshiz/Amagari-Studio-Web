import fromTheShelvesEnUS from '@/assets/map-documents/from-the-shelves/en_US.md?raw'
import fromTheShelvesZhCN from '@/assets/map-documents/from-the-shelves/zh_CN.md?raw'
import fromTheShelvesZhTW from '@/assets/map-documents/from-the-shelves/zh_TW.md?raw'

export const mapDocuments = Object.freeze({
  'from-the-shelves': Object.freeze({
    'zh-CN': fromTheShelvesZhCN,
    'zh-TW': fromTheShelvesZhTW,
    'en-US': fromTheShelvesEnUS,
  }),
})

export default mapDocuments
