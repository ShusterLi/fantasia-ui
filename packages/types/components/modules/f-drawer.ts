/**
 * FDrawer 抽屉位置
 */
type FDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * FDrawer 组件属性
 */
interface FDrawerProps {
	/** 标题 */
	title?: string;
	/** 抽屉位置 */
	placement?: FDrawerPlacement;
	/** 抽屉尺寸 */
	size?: string;
	/** 是否显示关闭按钮 */
	showClose?: boolean;
	/** 是否锁定滚动 */
	lockScroll?: boolean;
	/** 点击遮罩是否关闭 */
	closeOnClickOutside?: boolean;
}

/**
 * FDrawer 组件事件
 */
interface FDrawerEmits {
	/** 关闭事件 */
	close: [];
}

export type { FDrawerProps, FDrawerEmits, FDrawerPlacement };
