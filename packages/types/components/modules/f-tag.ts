import type { Size } from "./base";

type TagColor = 'purple' | 'pink' | 'blue' | 'cyan' | 'green' | 'gold' | 'orange' | 'red' | 'default';

interface FTagProps {
  /** 标签颜色 @default 'default' */
  color?: TagColor;
  /** 标签类型 @default 'round' */
  type?: 'round' | 'square' | 'dot' | 'bookmark';
  /** 标签效果 @default 'light' */
  effect?: 'light' | 'dark' | 'plain';
  /** 是否可关闭 @default false */
  closable?: boolean;
  /** 标签尺寸 @default 'normal' */
  size?: Size;
}

export type { FTagProps };
