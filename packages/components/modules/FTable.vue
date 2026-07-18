<script setup lang="ts">
import type { FTableProps } from '@/types/index';
import FTooltip from './FTooltip.vue';


const props = withDefaults(defineProps<FTableProps>(), {
  rowHeight: 40,
  overscan: 5,
  showIndex: true,
  loading: false,
  loadingText: '加载中...',
  emptyText: '暂无数据',
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
.f-table {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  min-height: 14rem;

  &__loading {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.625rem;
    z-index: 10;
  }

  &__scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &__inner {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    text-align: left;
    table-layout: auto;
    min-width: 100%;

    th,
    td {
      padding: 0.625rem;
      border-right: 1px solid #e2e8f0;

      &:last-child {
        border-right: none;
      }
    }
  }

  &__col--index {
    width: 3rem;
  }

  // ── thead ──────────────────────────────────────────
  &__head {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #1e293b;
    color: #ffffff;
  }

  &__th {
    font-weight: 700;
    text-align: center;

    &--index {
      background: #0f172a;
      width: 3rem;
    }

    &-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
  }

  // ── tbody ──────────────────────────────────────────
  &__row {
    border-bottom: 1px solid #e2e8f0;

    &:hover {
      background: rgba(248, 250, 252, 0.7);
    }
  }

  &__td {
    text-align: center;
    font-size: 0.6875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--muted {
      color: #94a3b8;
      text-decoration: line-through;
      opacity: 0.6;
    }

    &--index {
      background: rgba(248, 250, 252, 0.5);
      font-weight: 800;
      color: #64748b;
    }
  }

  &__spacer td {
    padding: 0;
    border: none;
  }

  &__empty {
    padding: 3rem 0;
    text-align: center;
    color: #94a3b8;
    font-weight: 700;
    background: rgba(248, 250, 252, 0.5);
  }
}
</style>
