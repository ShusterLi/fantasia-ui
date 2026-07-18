interface FScrollbarProps {
	/** 容器高度，不传则跟随父级 100% */
	height?: string
	maxHeight?: string
	/** 为 true 时不做任何处理，退回原生滚动条 */
	native?: boolean
	/** 是否常驻显示滚动条，默认只在 hover / 滚动时显示 */
	always?: boolean
	/** 滚动条滑块最小尺寸，单位 px */
	minSize?: number
	/** 是否显示纵向滚动条 */
	vertical?: boolean
	/** 是否显示横向滚动条 */
	horizontal?: boolean
}

export type { FScrollbarProps }
