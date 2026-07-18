import type { Direction } from "./base";

type Line = 'none' | 'solid' | 'hidden' | 'dashed'

interface FDividerProps {
  color: string;
  direction?: Direction;
  line: Line;
}

export type { FDividerProps };
