type TooltipPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface FTooltipProps {
  content?: string;
  placement?: TooltipPlacement;
  disabled?: boolean;
  delay?: number;
  offset?: number;
  maxWidth?: number;
}

export type { FTooltipProps };
