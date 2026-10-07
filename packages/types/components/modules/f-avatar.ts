import type { DefineComponent } from "vue";
import type { Size } from "./base";

interface FAvatarProps {
  /** 图片地址 */
  src: string;
  /** 图片描述 */
  alt?: string;
  /** 头像尺寸，可以是预设尺寸或数字（px） @default 'normal' */
  size?: Size | number;
  /** 头像形状 @default 'circle' */
  shape?: 'circle' | 'square';
  /** 头像图标组件 */
  icon?: DefineComponent;
}

export type { FAvatarProps };
