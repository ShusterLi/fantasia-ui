/**
 * FDialog 对话框类型
 */
type FDialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

/**
 * FDialog 组件属性
 */
interface FDialogProps {
	/** 标题 */
	title?: string;
	/** 内容文本 */
	content?: string;
	/** 对话框类型 */
	type?: FDialogType;
	/** 确认按钮文本 */
	confirmText?: string;
	/** 取消按钮文本 */
	cancelText?: string;
	/** 是否显示取消按钮 */
	showCancel?: boolean;
	/** 点击遮罩是否关闭 */
	closeOnClickOutside?: boolean;
	/** 按 ESC 是否关闭 */
	closeOnEsc?: boolean;
}

/**
 * FDialog 组件事件
 */
interface FDialogEmits {
	/** 确认事件 */
	confirm: [];
	/** 取消事件 */
	cancel: [];
}

interface FDialogOptions {
	title?: string;
	content?: string;
	type?: FDialogType;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
}

type FDialogFn = ((options: FDialogOptions) => Promise<boolean>) & {
	showDialog: (options: FDialogOptions) => Promise<boolean>;
	confirm: (content: string, title?: string) => Promise<boolean>;
	alert: (content: string, title?: string, type?: FDialogType) => Promise<boolean>;
	success: (content: string, title?: string) => Promise<boolean>;
	warning: (content: string, title?: string) => Promise<boolean>;
	error: (content: string, title?: string) => Promise<boolean>;
	info: (content: string, title?: string) => Promise<boolean>;
}

export type { FDialogProps, FDialogEmits, FDialogOptions, FDialogFn, FDialogType };