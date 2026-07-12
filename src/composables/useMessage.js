import { h, render } from 'vue'

import Message from '@/components/Message.vue'

let activeContainer = null
let activeTimeout = null
let activeMessageId = 0
let nextMessageId = 0

const destroyMessage = () => {
  if (activeTimeout) {
    window.clearTimeout(activeTimeout)
    activeTimeout = null
  }

  if (activeContainer) {
    render(null, activeContainer)
    activeContainer.remove()
    activeContainer = null
  }

  activeMessageId = 0
}

const showMessage = ({ message, type, duration = 3000, isRichText = false }) => {
  destroyMessage()

  nextMessageId += 1
  const messageId = nextMessageId
  const container = document.createElement('div')
  document.body.appendChild(container)
  activeContainer = container
  activeMessageId = messageId

  render(h(Message, { message, type, isRichText }), container)

  activeTimeout = window.setTimeout(
    () => {
      if (activeMessageId === messageId) destroyMessage()
    },
    Math.max(0, duration),
  )

  return () => {
    if (activeMessageId === messageId) destroyMessage()
  }
}

export const useMessage = () => ({
  warning: (message, duration = 3000, isRichText = false) =>
    showMessage({ message, type: 'warn', duration, isRichText }),
  success: (message, duration = 3000, isRichText = false) =>
    showMessage({ message, type: 'success', duration, isRichText }),
  error: (message, duration = 3000, isRichText = false) =>
    showMessage({ message, type: 'error', duration, isRichText }),
  info: (message, duration = 3000, isRichText = false) =>
    showMessage({ message, type: 'info', duration, isRichText }),
})
