interface FSliderProps {
	min?: number
	max?: number
	step?: number
	/** 区间模式，modelValue 为 [number, number] */
	range?: boolean
	vertical?: boolean
	disabled?: boolean
	showTooltip?: boolean
	/** 刻度标记，key 为具体数值 */
	marks?: Record<number, string>
	size?: 'small' | 'default' | 'large'
}

export type { FSliderProps }
