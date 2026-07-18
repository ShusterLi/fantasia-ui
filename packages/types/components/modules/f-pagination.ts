interface FPaginationProps {
  total: number;
  pageSize?: number;
  hideOnSingle?: boolean;
  pageSizes?: number[];
  layout?: string[];
}

export type { FPaginationProps };
