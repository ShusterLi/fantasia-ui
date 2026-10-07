interface FScrollbarProps {
	/** 容器高度，不传则跟随父级 100% */
	height?: string
	/** 容器最大高度 */
	maxHeight?: string
	/** 为 true 时不做任何处理，退回原生滚动条 @default false */
	native?: boolean
	/** 是否常驻显示滚动条，默认只在 hover / 滚动时显示 @default false */
	always?: boolean
	/** 滚动条滑块最小尺寸，单位 px @default 20 */
	minSize?: number
	/** 是否显示纵向滚动条 @default true */
	vertical?: boolean
	/** 是否显示横向滚动条 @default true */
	horizontal?: boolean
}

export type { FScrollbarProps }
