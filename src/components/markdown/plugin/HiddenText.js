import { Mark, mergeAttributes, createInlineMarkdownSpec } from '@tiptap/core'

export const HiddenText = Mark.create({
  name: 'hiddenText',

  parseHTML() {
    return [{ tag: 'span[data-type="hidden-text"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'hidden-text' }), 0]
  },

  markdownTokenizer: {
    name: 'hiddenText',
    level: 'inline',
    start: src => src.indexOf('||'),
    tokenize: (src, tokens, lexer) => {
      const match = /^\|\|([^|]+)\|\|/.exec(src) // 匹配 ||内容||
      if (!match) return undefined

      return {
        type: 'hiddenText',
        raw: match[0],
        tokens: lexer.inlineTokens(match[1]),
      }
    }
  },

  parseMarkdown: (token, helpers) => {
    return helpers.applyMark('hiddenText', helpers.parseInline(token.tokens || []))
  },

  renderMarkdown: (node, helpers) => {
    return `||${helpers.renderChildren(node)}||`
  },
})
