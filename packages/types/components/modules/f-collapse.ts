interface FCollapseProps {
	accordion?: boolean
	/** 是否显示新增选项按钮 */
	showAddButton?: boolean
	/** 新增按钮位置，默认为 bottom */
	addButtonPosition?: 'top' | 'bottom'
	/** 新增按钮文本 */
	addButtonText?: string
}

export type { FCollapseProps }
