interface FBadgeProps {
  /** 徽章内容 */
  value?: number | string;
  /** 最大值，超过显示为 {max}+ @default 99 */
  max?: number;
  /** 是否显示为小圆点 @default false */
  dot?: boolean;
  /** 徽章类型 @default 'danger' */
  type?: 'danger' | 'primary' | 'success' | 'warning' | 'info';
  /** 徽章位置 @default 'top-right' */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** 位置偏移量 [x, y] */
  offset?: [number, number];
}

export type { FBadgeProps };
