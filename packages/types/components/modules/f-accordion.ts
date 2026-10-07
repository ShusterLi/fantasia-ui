import type { Component } from 'vue';

interface FAccordionItem {
  /** 唯一标识 */
  key: string | number;
  /** 标题 */
  title: string;
  /** 内容 */
  content?: string;
  /** 是否禁用 @default false */
  disabled?: boolean;
  /** 自定义图标 */
  icon?: Component;
}

interface FAccordionProps {
  /** 折叠面板项 */
  items: FAccordionItem[];
  /** 是否手风琴模式（只能展开一个） @default false */
  accordion?: boolean;
  /** 是否显示展开/收起图标 @default true */
  showIcon?: boolean;
  /** 图标位置 @default 'right' */
  iconPosition?: 'left' | 'right';
  /** 是否显示边框 @default true */
  bordered?: boolean;
  /** 是否可排序 @default false */
  sortable?: boolean;
}

interface FAccordionEmits {
  /** 面板展开/收起时触发 */
  change: [activeKeys: (string | number)[], item: FAccordionItem, expanded: boolean];
  /** 面板排序时触发 */
  sort: [items: FAccordionItem[]];
}

export type { FAccordionProps, FAccordionItem, FAccordionEmits };