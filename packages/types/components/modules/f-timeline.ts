import type { Component } from 'vue';

type TimelineMode = 'left' | 'right' | 'alternate' | 'center';
type TimelineDirection = 'vertical' | 'horizontal';
type TimelineColor = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type TimelineType = 'default' | 'large';

interface FTimelineProps {
  /** 时间线模式 @default 'left' */
  mode?: TimelineMode;
  /** 时间线方向 @default 'vertical' */
  direction?: TimelineDirection;
}

interface FTimelineItemProps {
  /** 时间戳文本 */
  timestamp?: string;
  /** 节点颜色 @default 'default' */
  color?: TimelineColor;
  /** 自定义图标组件 */
  icon?: Component;
  /** 节点类型 @default 'default' */
  type?: TimelineType;
  /** 是否可折叠 @default false */
  collapsible?: boolean;
  /** 默认是否折叠 @default false */
  defaultCollapsed?: boolean;
}

export type { FTimelineProps, FTimelineItemProps };
