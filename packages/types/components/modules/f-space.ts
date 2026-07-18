import type { Justify, Direction, Size } from "./base"

type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch'

interface FSpaceProps {
  direction?: Direction
  size?: Size | [Size, Size]
  align?: Align
  justify?: Justify
  wrap?: boolean
  split?: string
}

export type { FSpaceProps }
