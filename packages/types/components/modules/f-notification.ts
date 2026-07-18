import type { ActiveInstance, Position, Size, Type } from "./base"

interface FNotificationOptions {
	/** 标题，可省略 */
	title?: string
	/** 正文内容 */
	message: string
	/** 类型，决定图标与配色 */
	type?: Type
	/** 自动关闭的延时（毫秒），传 0 表示不自动关闭 */
	duration?: number
	/** 是否显示关闭按钮 */
	closable?: boolean
	/** 是否显示图标 */
	showIcon?: boolean
	/** 弹出位置，默认右上角 */
	position?: Position
	/** 点击整条通知时触发 */
	onClick?: () => void
	/** 关闭时的回调 */
	onClose?: () => void
}

interface FNotificationInstance {
	id: number
	close: () => void
}

interface FNotificationActiveInstance extends ActiveInstance {
	position: Position
	size: Size
}

interface FNotificationProps {
	type?: Type
	title?: string
	message: string
	duration?: number
	closable?: boolean
	showIcon?: boolean
	position?: Position
	offset?: number
}

interface FNotificationFn {
	(options: FNotificationOptions | string): FNotificationInstance
	info: (options: FNotificationOptions | string) => FNotificationInstance
	success: (options: FNotificationOptions | string) => FNotificationInstance
	warning: (options: FNotificationOptions | string) => FNotificationInstance
	failed: (options: FNotificationOptions | string) => FNotificationInstance
	closeAll: (position?: Position) => void
}

export type { FNotificationProps, FNotificationInstance, FNotificationOptions, FNotificationFn, FNotificationActiveInstance };
