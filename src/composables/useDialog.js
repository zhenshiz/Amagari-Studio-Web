import { h, render } from 'vue'

import Dialog from '@/components/Dialog.vue'

const mountDialog = (props) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  let destroyed = false
  const destroy = () => {
    if (destroyed) return
    destroyed = true
    render(null, container)
    container.remove()
  }

  render(
    h(Dialog, {
      ...props,
      onClose: destroy,
    }),
    container,
  )

  return destroy
}

export const useDialog = () => {
  const open = (type, options = {}) => mountDialog({ ...options, type })

  return {
    info: (options) => open('info', options),
    warning: (options) => open('warn', options),
    success: (options) => open('success', options),
    error: (options) => open('error', options),
  }
}
