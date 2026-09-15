interface FStepsItem {
	title?: string;
	description?: string;
	status?: 'wait' | 'process' | 'finish' | 'error';
}

interface FStepsProps {
	items: FStepsItem[];
	current?: number;
	direction?: 'horizontal' | 'vertical';
	statusText?: boolean;
}

export type { FStepsItem, FStepsProps };
