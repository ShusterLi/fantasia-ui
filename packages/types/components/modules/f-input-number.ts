interface FInputNumberProps {
	/** 最小值 */
	min?: number
	/** 最大值 */
	max?: number
	/** 步长 @default 1 */
	step?: number
	/** 小数精度，不传则不做截断 */
	precision?: number
	/** 是否禁用 @default false */
	disabled?: boolean
	/** 是否显示加减按钮 @default true */
	controls?: boolean
	/** 加减按钮布局：右侧上下堆叠 / 两侧分开 @default 'right' */
	controlsPosition?: 'right' | 'both'
	/** 占位符 */
	placeholder?: string
}

export type { FInputNumberProps }
