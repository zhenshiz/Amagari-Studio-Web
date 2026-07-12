import { createBlockMarkdownSpec, mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StepsComponent from '@/components/markdown/components/StepsComponent.vue'

// 1. 步骤条项 (单个步骤)
export const StepItem = Node.create({
  name: 'stepItem',
  group: 'block',
  content: 'admonitionTitle admonitionContent',
  isolating: true,
  defining: true,
  parseHTML() { return [{ tag: 'div[data-type="step-item"]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'step-item' }), 0]
  },
  ...createBlockMarkdownSpec({
    nodeName: 'stepItem',
    name: 'step',
  }),
  parseMarkdown: (token, helpers) => {
    const allContent = helpers.parseChildren(token.tokens || [])
    const titleNode = allContent[0]
    const bodyNodes = allContent.slice(1)

    return {
      type: 'stepItem',
      content: [
        {
          type: 'admonitionTitle',
          content: titleNode?.type === 'paragraph' ? titleNode.content : (titleNode ? [titleNode] : [])
        },
        {
          type: 'admonitionContent',
          content: bodyNodes.length > 0 ? bodyNodes : [helpers.createNode('paragraph')]
        }
      ]
    }
  },
  renderMarkdown: (node, helpers) => {
    const title = helpers.renderChildren([node.content[0]]).trim()
    const body = helpers.renderChildren([node.content[1]]).trim()
    return `:::step\n${title}\n\n${body}\n:::\n`
  }
})

// 2. 步骤条父容器
export const Steps = Node.create({
  name: 'steps',
  group: 'block',
  content: 'stepItem+',
  draggable: false,

  parseHTML() { return [{ tag: 'div[data-type="steps"]' }] },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'steps' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(StepsComponent)
  },

  ...createBlockMarkdownSpec({
    nodeName: 'steps',
  }),
  parseMarkdown: (token, helpers) => {
    return {
      type: 'steps',
      content: helpers.parseChildren(token.tokens || [])
    }
  },
  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [], '\n\n')
    return `:::steps\n${content}\n:::\n`
  }
})
