import type { Direction } from "./base";

type Line = 'none' | 'solid' | 'hidden' | 'dashed';

/**
 * 分割线内容位置
 */
type FDividerContentPosition = 'left' | 'center' | 'right';

/**
 * FDivider 组件属性
 */
interface FDividerProps {
	/** 分割线颜色 */
	color?: string;
	/** 分割线方向 */
	direction?: Direction;
	/** 分割线样式 */
	line?: Line;
	/** 分割线内容位置 */
	contentPosition?: FDividerContentPosition;
}

export type { FDividerProps, FDividerContentPosition };
