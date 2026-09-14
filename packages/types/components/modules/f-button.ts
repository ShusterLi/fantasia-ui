import type { Component } from "vue";
import type { Size, Type } from "./base";

type ButtonNativeType = 'button' | 'submit' | 'reset';

interface FButtonProps {
  type?: Type;
  size?: Size;
  nativeType?: ButtonNativeType;
  loading?: boolean;
  disabled?: boolean;
  round?: boolean | number;
  circle?: boolean;
  plain?: boolean;
  text?: boolean;  // 文本按钮
  block?: boolean;
  icon?: Component | string;
  active?: boolean;
  bgColor?: string;
  color?: string;
}

export type { FButtonProps, ButtonNativeType };
