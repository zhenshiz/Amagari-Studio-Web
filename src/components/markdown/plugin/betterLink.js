import { Mark, mergeAttributes } from '@tiptap/core'

export const BetterLink = Mark.create({
  name: 'link',
  priority: 1000,
  keepOnSplit: false,

  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[href]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { href } = HTMLAttributes


    if (href?.startsWith('#') || href?.startsWith('?')) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { target: null }), 0]
    }

    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      target: '_blank',
      rel: 'noopener noreferrer nofollow'
    }), 0]
  },

})
