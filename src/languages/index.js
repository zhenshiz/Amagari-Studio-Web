import { VoerkaI18nScope } from '@voerkai18n/runtime'
import formatters from '@voerkai18n/formatters'

import { component } from './component'
import idMap from './messages/idMap.json'
import defaultMessages from './messages/zh-CN'
import loader from './loader'
import paragraphs from './paragraphs'
import settings from './settings.json'
import storage from './storage'
import { transform } from './transform'

const messages = {
  'zh-CN': defaultMessages,
  'zh-TW': () => import('./messages/zh-TW.js'),
  'en-US': () => import('./messages/en-US.js'),
}

export const i18nScope = new VoerkaI18nScope({
  id: 'amagari__0_0_0',
  idMap,
  formatters,
  storage,
  messages,
  paragraphs,
  component,
  loader,
  transform,
  ...settings,
})

export const t = i18nScope.t
export const $t = i18nScope.$t
export const Translate = i18nScope.Translate
