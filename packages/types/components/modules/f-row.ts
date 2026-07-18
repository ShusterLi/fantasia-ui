import type { Align, Justify, Wrap } from "./base"

interface FRowProps {
  gutter?: number | [number, number]  // [水平, 垂直]
  justify?: Justify
  align?: Align
  wrap?: Wrap
  tag?: string
}

export type { FRowProps }
