import type { Direction } from "./base";

interface FCardProps {
  /** 鼠标悬停时是否显示阴影 @default false */
  hoverable?: boolean;
  /** 内容排列方向 @default 'vertical' */
  direction?: Direction;
}

export type { FCardProps };
