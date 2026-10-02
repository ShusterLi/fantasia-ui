<script setup lang="ts">
import type { FTableProps } from '@/types/index';
import FTooltip from './FTooltip.vue';


const props = withDefaults(defineProps<FTableProps>(), {
  rowHeight: 40,
  overscan: 5,
  showIndex: true,
  loading: false,
  loadingText: '鍔犺浇涓?..',
  emptyText: '鏆傛棤鏁版嵁',
})

const scrollEl = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)

const colSpan = computed(() => props.columns.length + (props.showIndex ? 1 : 0))

// Virtual window
const startIndex = computed(() => {
  const raw = Math.floor(scrollTop.value / props.rowHeight) - props.overscan
  return Math.max(0, raw)
})

const endIndex = computed(() => {
  const visible = Math.ceil(viewportHeight.value / props.rowHeight)
  const raw = startIndex.value + visible + props.overscan * 2
  return Math.min(props.data.length - 1, raw)
})

const visibleRows = computed(() =>
  props.data.slice(startIndex.value, endIndex.value + 1).map((row, i) => ({
    row,
    index: startIndex.value + i,
  }))
)

const offsetTop = computed(() => startIndex.value * props.rowHeight)
const offsetBottom = computed(() =>
  Math.max(0, (props.data.length - endIndex.value - 1) * props.rowHeight)
)

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

const formatCell = (val: unknown): string => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

let ro: ResizeObserver | null = null

onMounted(() => {
  if (scrollEl.value) {
    viewportHeight.value = scrollEl.value.clientHeight
    ro = new ResizeObserver(([entry]) => {
      if (entry)
        viewportHeight.value = entry.contentRect.height
    })
    ro.observe(scrollEl.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
})

// Reset scroll on data change
watch(() => props.data, () => {
  if (scrollEl.value) scrollEl.value.scrollTop = 0
  scrollTop.value = 0
})
</script>

<template>
  <div class="f-table">
    <!-- Loading overlay -->
    <div v-if="loading" class="f-table__loading">
      <span class="spinner" />
      <span>{{ loadingText }}</span>
    </div>

    <div class="f-table__scroll" ref="scrollEl" @scroll="onScroll">
      <table class="f-table__inner">
        <colgroup>
          <col v-if="showIndex" class="f-table__col--index" />
          <col v-for="col in columns" :key="col.key" :style="{
            width: col.width ?? 'auto',
            minWidth: col.minWidth ?? '120px',
          }" />
        </colgroup>

        <!-- Sticky thead -->
        <thead class="f-table__head">
          <tr>
            <th v-if="showIndex" class="f-table__th f-table__th--index">#</th>
            <th v-for="col in columns" :key="col.key" class="f-table__th" :class="col.thClass">
              <slot :name="`header-${col.key}`" :column="col">
                <div class="f-table__th-inner">
                  <span>{{ col.label }}</span>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody class="f-table__body">
          <!-- Top spacer -->
          <tr v-if="offsetTop > 0" class="f-table__spacer">
            <td :colspan="colSpan" :style="{ height: offsetTop + 'px' }" />
          </tr>

          <!-- Visible rows -->
          <template v-if="visibleRows.length > 0">
            <tr v-for="{ row, index } in visibleRows" :key="index" class="f-table__row">
              <td v-if="showIndex" class="f-table__td f-table__td--index">
                {{ index + 1 }}
              </td>
              <td v-for="col in columns" :key="col.key" class="f-table__td" :class="col.tdClass">
                <slot v-if="$slots[`cell-${col.key}`]" :name="`cell-${col.key}`" :row="row" :value="row[col.key]"
                  :index="index" :col="col" />
                <slot v-else-if="$slots.cell" name="cell" :row="row" :value="row[col.key]" :index="index" :col="col" />
                <template v-else>
                  <f-tooltip :content="formatCell(row[col.key])">
                    {{ formatCell(row[col.key]) }}
                  </f-tooltip>
                </template>

              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="!loading">
            <td :colspan="colSpan" class="f-table__empty">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>

          <!-- Bottom spacer -->
          <tr v-if="offsetBottom > 0" class="f-table__spacer">
            <td :colspan="colSpan" :style="{ height: offsetBottom + 'px' }" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-table.scss';
</style>
