import { ActiveInstance, Type } from "./base"

interface FMessageOptions {
	message: string
	type?: Type
	duration?: number
	closable?: boolean
	showIcon?: boolean
	onClose?: () => void
	offset?: number
}

interface FMessageInstance {
	id: number
	close: () => void
}

type FMessageFn = ((options: FMessageOptions | string) => FMessageInstance) & {
	info: (options: FMessageOptions | string) => FMessageInstance
	success: (options: FMessageOptions | string) => FMessageInstance
	warning: (options: FMessageOptions | string) => FMessageInstance
	failed: (options: FMessageOptions | string) => FMessageInstance
	closeAll: () => void
}

interface FMessageActiveInstance extends ActiveInstance {
	height: number;
}

interface FMessageProps {
	type?: Type
	message: string
	duration?: number
	closable?: boolean
	showIcon?: boolean
	offset?: number
}

export type { FMessageProps, FMessageFn, FMessageInstance, FMessageOptions, FMessageActiveInstance };
