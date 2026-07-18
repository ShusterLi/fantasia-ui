interface FLinkProps {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  underline?: 'none' | 'always' | 'hover';
  color?: 'default' | 'muted' | 'accent' | 'accent2' | 'green' | 'red' | 'blue' | 'gold';
  disabled?: boolean;
}

export type { FLinkProps };
