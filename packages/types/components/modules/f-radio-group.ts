interface FRadioGroupOption {
	label: string;
	value: string | number | boolean;
	disabled?: boolean;
}

interface FRadioGroupProps {
	options: FRadioGroupOption[];
	name?: string;
	disabled?: boolean;
	direction?: 'horizontal' | 'vertical';
}

export type { FRadioGroupOption, FRadioGroupProps };
