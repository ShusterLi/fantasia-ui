import type { Component } from "vue";
import type { Size, Type } from "./base";

type ButtonNativeType = 'button' | 'submit' | 'reset';

interface FButtonProps {
  /** 按钮类型 */
  type?: Type;
  /** 按钮尺寸 */
  size?: Size;
  /** 原生按钮类型 */
  nativeType?: ButtonNativeType;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否圆角，可传入数字指定圆角大小 */
  round?: boolean | number;
  /** 是否圆形按钮 */
  circle?: boolean;
  /** 是否朴素按钮 */
  plain?: boolean;
  /** 是否文本按钮 */
  text?: boolean;
  /** 是否块级按钮 */
  block?: boolean;
  /** 图标组件 */
  icon?: Component | string;
  /** 是否激活状态 */
  active?: boolean;
  /** 自定义背景色 */
  bgColor?: string;
  /** 自定义文字颜色 */
  color?: string;
}

export type { FButtonProps, ButtonNativeType };
