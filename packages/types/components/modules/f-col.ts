type ColSize = number | { span?: number; offset?: number; order?: number }

interface FColProps {
  span?: number
  offset?: number
  order?: number
  xs?: ColSize
  sm?: ColSize
  md?: ColSize
  lg?: ColSize
}

export type { FColProps, ColSize }
