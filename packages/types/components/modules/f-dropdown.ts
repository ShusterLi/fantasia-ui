import type { Component } from "vue";
import type { Placement } from "./base";

interface FDropdownOption {
  /** 选项唯一标识 */
  key: string | number;
  /** 选项显示文本 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子选项 */
  children?: FDropdownOption[];
  /** 选项图标 */
  icon?: string | Component;
}

interface FDropdownProps {
  /** 下拉菜单弹出位置 @default 'right-start' */
  placement?: Placement;
  /** 下拉菜单偏移量 @default 12 */
  offset?: number | [number, number];
  /** 下拉菜单层级 @default 2000 */
  zIndex?: number;
  /** 触发方式 @default 'hover' */
  trigger?: 'hover' | 'click';
  /** 下拉选项列表 */
  options?: FDropdownOption[];
  /** 是否禁用 @default false */
  disabled?: boolean;
  /** 是否支持多选 @default false */
  multiple?: boolean;
  /** 多选模式下的选中值（v-model） */
  modelValue?: (string | number)[];
  /** 下拉菜单最大高度 @default '300px' */
  maxHeight?: string;
}

export type { FDropdownProps, FDropdownOption };
