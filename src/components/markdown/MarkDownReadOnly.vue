<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import Image from '@tiptap/extension-image'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Youtube from '@tiptap/extension-youtube'
import { Mathematics } from '@tiptap/extension-mathematics'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import { BiliBili } from '@/components/markdown/plugin/Bilibili.js'
import { Mermaid } from '@/components/markdown/plugin/Mermaid.js'
import { EnhancedCodeBlock } from '@/components/markdown/plugin/EnhancedCodeBlock.js'
import { HiddenText } from '@/components/markdown/plugin/HiddenText.js'
import {
  Admonition,
  AdmonitionContent,
  AdmonitionTitle,
} from '@/components/markdown/plugin/Admonition.js'
import { StepItem, Steps } from '@/components/markdown/plugin/Steps.js'

import { common, createLowlight } from 'lowlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import TextAlign from '@tiptap/extension-text-align'
import TableOfContents, { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents'
import { TextSelection } from '@tiptap/pm/state'
import { BetterLink } from '@/components/markdown/plugin/betterLink.js'
import { CustomTable } from '@/components/markdown/plugin/CustomTable.js'

const props = defineProps({
  content: { type: String, default: '' },
})

const lowlight = createLowlight(common)

// 存储提取的标题
const headings = ref([])

const editor = useEditor({
  content: props.content,
  contentType: 'markdown',
  editable: false,
  editorProps: {
    attributes: {
      spellcheck: 'false',
    },
  },
  extensions: [
    Markdown.configure({
      markedOptions: {
        gfm: true,
      },
    }),
    StarterKit.configure({
      codeBlock: false,
      link: false,
      table: false,
    }),
    EnhancedCodeBlock,
    CodeBlockLowlight.configure({ lowlight }),
    BetterLink,
    Image.configure({ allowBase64: true }),
    CustomTable,
    Superscript,
    Subscript,
    TaskList,
    TaskItem.configure({ nested: true }),
    Mathematics,
    Youtube.configure({ controls: true, nocookie: true }),
    BiliBili,
    Mermaid,
    HiddenText,
    Admonition,
    AdmonitionTitle,
    AdmonitionContent,
    Steps,
    StepItem,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      getId: (textContent) => {
        return textContent
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      },
      onUpdate: (content) => {
        headings.value = content
      },
    }),
  ],
})

const scrollToHeading = (id) => {
  if (editor.value) {
    const element = editor.value.view.dom.querySelector(`[data-toc-id="${id}"]`)

    if (element) {
      // 1. 设置编辑器焦点与内部选区
      const pos = editor.value.view.posAtDOM(element, 0)
      const tr = editor.value.view.state.tr
      tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
      editor.value.view.dispatch(tr)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      if (import.meta.env.MODE !== 'offline') {
        history.pushState(null, null, `#${id}`)
      }
    }
  }
}

// 暴露给 ModWiki 使用
defineExpose({ headings, scrollToHeading })

watch(
  () => props.content,
  (newValue) => {
    editor.value?.commands.setContent(newValue || '', {
      contentType: 'markdown',
      emitUpdate: false,
    })
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="read-only-container dark:text-white">
    <EditorContent :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.read-only-container {
  --markdown-accent: #7fb23f;
  --markdown-border: #172018;
  --markdown-code: #eef3e9;
  --markdown-muted: #536054;
  --markdown-surface: #ffffff;
  position: relative;
  width: 100%;
  color: #172018;
}

:global(.dark .read-only-container) {
  --markdown-accent: #d8f461;
  --markdown-border: #d8d3c5;
  --markdown-code: #282b29;
  --markdown-muted: #b8bdb7;
  --markdown-surface: #1d1f1e;
  color: #f2f1e8;
}

.read-only-container :deep(.tiptap) {
  width: 100%;
  min-height: 18rem;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  outline: none;
  font-size: 0.98rem;
  font-weight: 550;
  line-height: 1.85;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  [data-toc-id] {
    scroll-margin-top: 5.5rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2rem 0 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: -0.025em;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
  }

  h2 {
    padding-bottom: 0.55rem;
    border-bottom: 2px solid var(--markdown-border);
    font-size: clamp(1.55rem, 4vw, 2rem);
  }

  h3 {
    font-size: clamp(1.25rem, 3vw, 1.55rem);
  }

  h4 {
    font-size: 1.2rem;
  }

  h5,
  h6 {
    font-size: 1rem;
  }

  h1::before,
  h2::before,
  h3::before,
  h4::before,
  h5::before,
  h6::before {
    margin-right: 0.55rem;
    color: var(--markdown-accent);
    content: '#';
  }

  p {
    margin: 0.85rem 0;
    overflow-wrap: anywhere;
    color: var(--markdown-muted);
  }

  strong {
    color: inherit;
    font-weight: 900;
  }

  ul,
  ol {
    margin: 0.85rem 0;
    padding-left: 1.75rem;
    color: var(--markdown-muted);
    list-style-position: outside;
  }

  ul {
    list-style-type: square;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin: 0.35rem 0;
    padding-left: 0.25rem;
  }

  li::marker {
    color: var(--markdown-accent);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
  }

  ul[data-type='taskList'] {
    padding-left: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    label {
      display: grid;
      flex: 0 0 auto;
      padding-top: 0.45rem;
      place-items: center;
    }

    input[type='checkbox'] {
      display: grid;
      width: 1.1rem;
      height: 1.1rem;
      margin: 0;
      appearance: none;
      border: 2px solid var(--markdown-border);
      background: var(--markdown-surface);
      place-items: center;
    }

    input[type='checkbox']:checked {
      background: var(--markdown-accent);
    }

    input[type='checkbox']:checked::before {
      width: 0.55rem;
      height: 0.55rem;
      background: #172018;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      content: '';
    }

    li[data-checked='true'] > div {
      color: inherit;
    }
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 1rem 1.1rem;
    border: 2px solid var(--markdown-border);
    border-left-width: 8px;
    background: color-mix(in srgb, var(--markdown-accent) 16%, var(--markdown-surface));
    box-shadow: 4px 4px 0 var(--markdown-border);

    p {
      margin: 0;
      color: inherit;
    }
  }

  code {
    padding: 0.15rem 0.35rem;
    border: 1px solid var(--markdown-border);
    background: var(--markdown-code);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.88em;
  }

  pre {
    position: relative;
    margin: 1.5rem 0;
    padding: 1rem;
    overflow-x: auto;
    border: 2px solid var(--markdown-border);
    background: #171918;
    box-shadow: 4px 4px 0 var(--markdown-border);
    color: #f2f1e8;

    code {
      min-width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
    }
  }

  a {
    border-bottom: 2px solid currentColor;
    color: #24798a;
    font-weight: 850;
    text-decoration: none;
    text-underline-offset: 3px;
    transition: background-color 100ms ease-out;

    &:hover,
    &:focus-visible {
      background: var(--markdown-accent);
      color: #172018;
      outline: 2px solid var(--markdown-border);
      outline-offset: 2px;
    }
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1.5rem auto;
    border: 2px solid var(--markdown-border);
    box-shadow: 5px 5px 0 var(--markdown-border);
    image-rendering: auto;
  }

  .custom-table-node {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    margin: 1.5rem 0;
    overflow-x: auto;
    border: 2px solid var(--markdown-border);
    box-shadow: 4px 4px 0 var(--markdown-border);
  }

  table {
    width: 100%;
    min-width: 32rem;
    border-collapse: collapse;
    background: var(--markdown-surface);
    white-space: normal;
  }

  th,
  td {
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--markdown-border);
    text-align: left;
  }

  th {
    background: var(--markdown-accent);
    color: #172018;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 900;
  }

  tr:nth-child(even) td {
    background: var(--markdown-code);
  }

  hr {
    height: 6px;
    margin: 2rem 0;
    border: 0;
    background: repeating-linear-gradient(
      90deg,
      var(--markdown-border) 0 8px,
      transparent 8px 12px
    );
  }

  .video-container,
  div[data-youtube-video] {
    display: flex;
    width: 100%;
    max-width: 50rem;
    margin: 1.75rem auto;
    overflow: hidden;
    border: 2px solid var(--markdown-border);
    background: #000;
    box-shadow: 5px 5px 0 var(--markdown-border);
    justify-content: center;

    iframe {
      display: block;
      width: 100%;
      border: 0;
      aspect-ratio: 16 / 9;
    }
  }

  span[data-type='hidden-text'] {
    padding: 0 0.25rem;
    background: var(--markdown-border) !important;
    color: var(--markdown-border) !important;

    &:hover,
    &:focus {
      background: transparent !important;
      color: inherit !important;
    }
  }
}

:global(.dark .read-only-container .tiptap a) {
  color: #77d9ea;
}

@media (max-width: 640px) {
  .read-only-container :deep(.tiptap) {
    font-size: 0.92rem;

    table {
      min-width: 28rem;
    }
  }
}
</style>
