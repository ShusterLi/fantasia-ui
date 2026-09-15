interface FTransferItem {
	key: string | number;
	label: string;
	disabled?: boolean;
}

interface FTransferProps {
	data: FTransferItem[];
	leftTitle?: string;
	rightTitle?: string;
	disabled?: boolean;
}

export type { FTransferItem, FTransferProps };
