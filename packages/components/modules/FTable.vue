<script setup lang="ts">
import type { FTableProps } from '@/types/index';

const props = withDefaults(
  defineProps<FTableProps>(),
  {
    rowHeight: 40,
    overscan: 5,
    showIndex: true,
    emptyText: '暂无数据',
    overflowTooltip: false,
  }
)

const scrollEl = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)

const colSpan = computed(() => props.columns.length + (props.showIndex ? 1 : 0))

const rootStyle = computed(() => {
  if (props.height === undefined) return undefined
  return { height: typeof props.height === 'number' ? `${props.height}px` : props.height }
})

// ── 虚拟滚动窗口 ───────────────────────────────────────
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan)
)

const endIndex = computed(() => {
  const visible = Math.ceil(viewportHeight.value / props.rowHeight)
  return Math.min(props.data.length - 1, startIndex.value + visible + props.overscan * 2)
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

const getKey = (row: Record<string, any>, index: number) =>
  props.rowKey ? (row[props.rowKey] ?? index) : index

// 空值显示为空白
const formatCell = (val: unknown): string => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

// ── 溢出 tooltip：全表共享一个，事件委托 ──────────────────
const TIP_HALF_WIDTH = 160 // 与样式里 max-width: 320px 对应，用于水平方向防溢出

const tip = reactive({
  show: false,
  text: '',
  top: 0,
  left: 0,
  placement: 'top' as 'top' | 'bottom',
})

const hideTip = () => {
  if (tip.show) tip.show = false
}

const onBodyOver = (e: MouseEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('.f-table__text')
  if (!el) return hideTip()

  // 列级开关优先，其次是整表开关
  const colFlag = el.dataset.tooltip
  const enabled = colFlag === undefined ? props.overflowTooltip : colFlag === '1'
  // 文本没有被截断就不显示
  if (!enabled || el.scrollWidth <= el.clientWidth) return hideTip()

  const r = el.getBoundingClientRect()
  const placeTop = r.top > 48
  const center = r.left + r.width / 2

  tip.text = el.textContent?.trim() ?? ''
  tip.left = Math.max(
    TIP_HALF_WIDTH + 8,
    Math.min(center, window.innerWidth - TIP_HALF_WIDTH - 8)
  )
  tip.top = placeTop ? r.top - 8 : r.bottom + 8
  tip.placement = placeTop ? 'top' : 'bottom'
  tip.show = true
}

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
  hideTip()
}

// ── 生命周期 ──────────────────────────────────────────
let ro: ResizeObserver | null = null

onMounted(() => {
  if (!scrollEl.value) return
  viewportHeight.value = scrollEl.value.clientHeight
  ro = new ResizeObserver(([entry]) => {
    if (entry) viewportHeight.value = entry.contentRect.height
  })
  ro.observe(scrollEl.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
})

// 数据整体替换时回到顶部
watch(() => props.data, () => {
  if (scrollEl.value) scrollEl.value.scrollTop = 0
  scrollTop.value = 0
  hideTip()
})
</script>

<template>
  <div class="f-table" :style="rootStyle">
    <div class="f-table__scroll" ref="scrollEl" @scroll.passive="onScroll">
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

        <tbody class="f-table__body" @mouseover="onBodyOver" @mouseleave="hideTip">
          <!-- Top spacer -->
          <tr v-if="offsetTop > 0" class="f-table__spacer">
            <td :colspan="colSpan" :style="{ height: offsetTop + 'px' }" />
          </tr>

          <!-- Visible rows -->
          <template v-if="visibleRows.length > 0">
            <tr v-for="{ row, index } in visibleRows" :key="getKey(row, index)" class="f-table__row"
              :style="{ height: rowHeight + 'px' }">
              <td v-if="showIndex" class="f-table__td f-table__td--index">
                {{ index + 1 }}
              </td>
              <td v-for="col in columns" :key="col.key" class="f-table__td" :class="col.tdClass"
                :style="col.width ? { maxWidth: col.width } : undefined">
                <slot v-if="$slots[`cell-${col.key}`]" :name="`cell-${col.key}`" :row="row" :value="row[col.key]"
                  :index="index" :col="col" />
                <slot v-else-if="$slots.cell" name="cell" :row="row" :value="row[col.key]" :index="index" :col="col" />
                <span v-else class="f-table__text"
                  :data-tooltip="col.tooltip === undefined ? undefined : (col.tooltip ? '1' : '0')">{{
                    formatCell(row[col.key]) }}</span>
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else>
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

    <!-- 共享的溢出 tooltip -->
    <Teleport to="body">
      <div v-if="tip.show" class="f-table__tip" :class="`is-${tip.placement}`"
        :style="{ top: tip.top + 'px', left: tip.left + 'px' }">
        {{ tip.text }}
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-table.scss';
</style>