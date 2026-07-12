import { h, render } from 'vue'

import Prompt from '@/components/Prompt.vue'

const mountPrompt = (props) => {
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
    h(Prompt, {
      ...props,
      onClose: destroy,
    }),
    container,
  )

  return destroy
}

export const usePrompt = () => {
  const openInput = ({
    title,
    placeholder = '',
    defaultValue = '',
    positiveText,
    negativeText,
    maskClosable = true,
    escClosable = true,
    onPositiveClick,
    onNegativeClick,
  }) =>
    mountPrompt({
      title,
      placeholder,
      defaultValue,
      positiveText,
      negativeText,
      maskClosable,
      escClosable,
      options: [],
      onPositiveClick,
      onNegativeClick,
    })

  const openSelect = ({
    title,
    placeholder = '',
    options = [],
    defaultValue = '',
    positiveText,
    negativeText,
    maskClosable = true,
    escClosable = true,
    onPositiveClick,
    onNegativeClick,
  }) =>
    mountPrompt({
      title,
      placeholder,
      defaultValue,
      positiveText,
      negativeText,
      maskClosable,
      escClosable,
      options,
      onPositiveClick,
      onNegativeClick,
    })

  return {
    openInput,
    openSelect,
  }
}
