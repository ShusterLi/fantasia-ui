import type { Type } from "./base";

/**
 * FDialog 组件属性
 */
interface FDialogProps {
	/** 标题 */
	title?: string;
	/** 内容文本 */
	content?: string;
	/** 对话框宽度 */
	width?: string;
	/** 对话框类型 */
	type?: Type;
	/** 确认按钮文本 */
	confirmText?: string;
	/** 取消按钮文本 */
	cancelText?: string;
	/** 是否显示取消按钮 */
	showCancel?: boolean;
	/** 是否显示关闭按钮 */
	showClose?: boolean;
	/** 点击遮罩是否关闭 */
	closeOnClickModal?: boolean;
	/** 按 ESC 是否关闭 */
	closeOnEsc?: boolean;
	/** 是否居中布局 */
	center?: boolean;
	/** 是否全屏显示 */
	fullscreen?: boolean;
	/** 关闭时销毁内容 */
	destroyOnClose?: boolean;
	/** 关闭前的回调 */
	beforeClose?: (done: () => void) => void;
}

/**
 * FDialog 组件事件
 */
interface FDialogEmits {
	/** 打开事件 */
	open: [];
	/** 关闭事件 */
	close: [];
	/** 确认事件 */
	confirm: [];
	/** 取消事件 */
	cancel: [];
}

interface FDialogOptions {
	title?: string;
	content?: string;
	width?: string;
	type?: Type;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
	showClose?: boolean;
	center?: boolean;
	beforeClose?: (done: () => void) => void;
}

type FDialogFn = ((options: FDialogOptions) => Promise<boolean>) & {
	showDialog: (options: FDialogOptions) => Promise<boolean>;
	confirm: (content: string, title?: string) => Promise<boolean>;
	alert: (content: string, title?: string, type?: Type) => Promise<boolean>;
	success: (content: string, title?: string) => Promise<boolean>;
	warning: (content: string, title?: string) => Promise<boolean>;
	failed: (content: string, title?: string) => Promise<boolean>;
	info: (content: string, title?: string) => Promise<boolean>;
}

export type { FDialogProps, FDialogEmits, FDialogOptions, FDialogFn };