import { Node, mergeAttributes, createBlockMarkdownSpec } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MermaidComponent from '@/components/markdown/components/MermaidComponent.vue'

export const Mermaid = Node.create({
  name: 'mermaid',
  group: 'block',
  atom: true,
  draggable: false,

  addAttributes() {
    return {
      code: { default: 'graph TD\n  A --> B' },
      hideCode: { default: false },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'mermaid-render-container',
        'data-type': 'mermaid'
      }),
      ['div', { class: 'mermaid' }, node.attrs.code]
    ]
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="mermaid"]' },
      { tag: 'pre.mermaid' }
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(MermaidComponent)
  },
  ...createBlockMarkdownSpec({
    nodeName: 'mermaid',
    allowedAttributes: ['hideCode'],
  }),

  parseMarkdown: (token, helpers) => {
    const hideCode = token.attrs?.hideCode === 'true' || token.attrs?.hideCode === true

    let rawCode = token.text || ''

    if (!rawCode && token.tokens) {
      rawCode = token.tokens.map(t => t.text || t.raw || '').join('\n')
    }

    return {
      type: 'mermaid',
      attrs: {
        hideCode,
        code: rawCode.trim()
      }
    }
  },
  renderMarkdown: (node) => {
    const { code, hideCode } = node.attrs
    return `:::mermaid {hideCode="${hideCode}"}\n${code}\n:::\n\n`
  }
})
