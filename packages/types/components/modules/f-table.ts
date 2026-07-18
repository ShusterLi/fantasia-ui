interface FTableColumn {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  thClass?: string | Record<string, boolean>
  tdClass?: string | Record<string, boolean>
}

interface FTableProps {
  data: Record<string, unknown>[]
  columns: FTableColumn[]
  rowHeight?: number
  overscan?: number
  showIndex?: boolean
  loading?: boolean
  loadingText?: string
  emptyText?: string
}

export type { FTableColumn, FTableProps }
