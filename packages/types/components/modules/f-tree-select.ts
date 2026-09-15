interface FTreeSelectOption {
	key: string | number;
	label: string;
	disabled?: boolean;
	children?: FTreeSelectOption[];
}

interface FTreeSelectProps {
	options: FTreeSelectOption[];
	placeholder?: string;
	disabled?: boolean;
	multiple?: boolean;
}

export type { FTreeSelectOption, FTreeSelectProps };
