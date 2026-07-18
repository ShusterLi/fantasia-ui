import type { Size } from "./base";

type TagColor = 'purple' | 'pink' | 'blue' | 'cyan' | 'green' | 'gold' | 'orange' | 'red' | 'default';

interface FTagProps {
  color?: TagColor;
  type?: 'round' | 'square' | 'dot' | 'bookmark';
  effect?: 'light' | 'dark' | 'plain';
  closable?: boolean;
  size?: Size;
}

export type { FTagProps };
