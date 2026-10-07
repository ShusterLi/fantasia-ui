interface FRadioProps {
	/** 标签文本 */
	label?: string;
	/** 单选框的值 */
	value?: string | number | boolean;
	/** 原生 name 属性 */
	name?: string;
	/** 是否禁用 @default false */
	disabled?: boolean;
}

export type { FRadioProps };
