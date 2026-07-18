type fitType = "fill" | "contain" | "none" | "cover" | "scale-down";

interface FImageProps {
  src: string;
  alt?: string;
  fit?: fitType;
  lazy?: boolean;
}

export type { FImageProps };
