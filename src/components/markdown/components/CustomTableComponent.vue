<template>
  <node-view-wrapper
    ref="wrapperRef"
    class="my-4 relative custom-table-node selectable-readonly"
    @dragstart="$event.preventDefault()"
  >
    <table
      class="w-full border-collapse"
      :style="node.attrs.style || null"
      @mousedown="$event.stopPropagation()"
    >
      <tbody>
        <tr v-for="(row, rowIndex) in localData" :key="`r-${rowIndex}`">
          <template v-for="(_, colIndex) in colCount" :key="`c-${rowIndex}-${colIndex}`">
            <th v-if="node.attrs.withHeaderRow && rowIndex === 0">
              <div class="cell-read">{{ cellValue(rowIndex, colIndex) }}</div>
            </th>
            <td v-else>
              <div class="cell-read">{{ cellValue(rowIndex, colIndex) }}</div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </node-view-wrapper>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const wrapperRef = ref(null)

// 只读模式下移除 draggable，允许表格内文字选择
onMounted(() => {
  wrapperRef.value?.$el?.removeAttribute('draggable')
})

const cloneMatrix = (matrix) => {
  if (!Array.isArray(matrix)) return [['']]
  return matrix.map((row) => (Array.isArray(row) ? row.map((c) => String(c ?? '')) : ['']))
}

const normalizeMatrix = (matrix) => {
  const safe = cloneMatrix(matrix)
  const maxCols = Math.max(1, ...safe.map((r) => r.length || 0))
  if (safe.length === 0) return [new Array(maxCols).fill('')]
  return safe.map((r) => {
    const next = r.slice(0, maxCols)
    while (next.length < maxCols) next.push('')
    return next
  })
}

const localData = ref(normalizeMatrix(props.node.attrs.data))

watch(
  () => props.node.attrs.data,
  (next) => {
    localData.value = normalizeMatrix(next)
  },
  { deep: true }
)

const colCount = computed(() => {
  const cols = Math.max(1, ...localData.value.map((r) => (Array.isArray(r) ? r.length : 0)))
  return cols
})

const cellValue = (rowIndex, colIndex) => {
  const row = localData.value[rowIndex] ?? []
  return String(row[colIndex] ?? '')
}
</script>

<style scoped>
.cell-read {
  white-space: pre-wrap;
  word-break: break-word;
}

.selectable-readonly {
  user-select: text;
  -webkit-user-select: text;
  cursor: text;
}
</style>
