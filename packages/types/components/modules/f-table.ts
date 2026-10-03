interface FTableColumn {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  thClass?: string | Record<string, boolean>
  tdClass?: string | Record<string, boolean>
  tooltip?: boolean
}

interface FTableProps {
  data: Record<string, unknown>[]
  columns: FTableColumn[]
  rowHeight?: number
  overscan?: number
  showIndex?: boolean
  emptyText?: string
  /** 行唯一键字段，不传则按下标 */
  rowKey?: string
  /** 表格高度，如 400 / '60vh'；不传则由外层容器决定 */
  height?: number | string
  /** 默认文本单元格被截断时，是否显示 tooltip（列上的 tooltip 可单独覆盖） */
  overflowTooltip?: boolean
}

export type { FTableColumn, FTableProps }
