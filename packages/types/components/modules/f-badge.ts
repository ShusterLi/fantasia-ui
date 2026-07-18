interface FBadgeProps {
  value?: number | string;
  max?: number;
  dot?: boolean;
  type?: 'danger' | 'primary' | 'success' | 'warning' | 'info';
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: [number, number];
}

export type { FBadgeProps };
