import type { DefineComponent } from "vue";
import type { Size } from "./base";

interface FAvatarProps {
  src: string;
  alt?: string;
  size?: Size | number;
  shape?: 'circle' | 'square';
  icon?: DefineComponent;
}

export type { FAvatarProps };
