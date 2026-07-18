interface FInputNumberProps {
	min?: number
	max?: number
	step?: number
	/** 小数精度，不传则不做截断 */
	precision?: number
	disabled?: boolean
	size?: 'small' | 'default' | 'large'
	/** 是否显示加减按钮 */
	controls?: boolean
	/** 加减按钮布局：右侧上下堆叠 / 两侧分开 */
	controlsPosition?: 'right' | 'both'
	placeholder?: string
}

export type { FInputNumberProps }
