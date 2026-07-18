interface FTextProps {
  tag?: string;
  heading?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'normal' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'bold' | 'bolder';
  color?: 'default' | 'muted' | 'dim' | 'link' | 'accent' | 'accent2' | 'accent3' | 'gold' | 'green' | 'red' | 'blue' | 'orange';
  truncate?: boolean;
  italic?: boolean;
}

export type { FTextProps };
