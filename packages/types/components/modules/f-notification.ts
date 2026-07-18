import type { VNode } from "vue"

type FNotificationType = 'info' | 'success' | 'warning' | 'error'
type FNotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

interface FNotificationActiveInstance {
	id: number
	position: FNotificationPosition
	vnode: VNode
	container: HTMLElement
	size: number
}

interface FNotificationOptions {
	/** 标题，可省略 */
	title?: string
	/** 正文内容 */
	message: string
	/** 类型，决定图标与配色 */
	type?: FNotificationType
	/** 自动关闭的延时（毫秒），传 0 表示不自动关闭 */
	duration?: number
	/** 是否显示关闭按钮 */
	closable?: boolean
	/** 是否显示图标 */
	showIcon?: boolean
	/** 弹出位置，默认右上角 */
	position?: FNotificationPosition
	/** 点击整条通知时触发 */
	onClick?: () => void
	/** 关闭时的回调 */
	onClose?: () => void
}

interface FNotificationInstance {
	id: number
	close: () => void
}

interface FNotificationProps {
	type?: 'info' | 'success' | 'warning' | 'error'
	title?: string
	message: string
	duration?: number
	closable?: boolean
	showIcon?: boolean
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
	offset?: number
}

interface FNotificationFn {
	(options: FNotificationOptions | string): FNotificationInstance
	info: (options: FNotificationOptions | string) => FNotificationInstance
	success: (options: FNotificationOptions | string) => FNotificationInstance
	warning: (options: FNotificationOptions | string) => FNotificationInstance
	error: (options: FNotificationOptions | string) => FNotificationInstance
	closeAll: (position?: FNotificationPosition) => void
}

export type { FNotificationProps, FNotificationInstance, FNotificationOptions, FNotificationPosition, FNotificationType, FNotificationActiveInstance, FNotificationFn };
