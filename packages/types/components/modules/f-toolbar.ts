import { Actions } from "@/types/models";

interface StyleProps {
	bg?: string
	align?: string
	shadow?: { x: number; y: number; blur: number; spread: number; color: string }
	radius?: number
	border?: { top: number; right: number; bottom: number; left: number; borderStyle: string; color: string }
}

interface FToolbarProps {
	data: Actions[]
	style?: StyleProps;
}

export type { FToolbarProps };
