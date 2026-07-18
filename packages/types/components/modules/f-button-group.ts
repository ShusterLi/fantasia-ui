import type { Size, Type } from "./base";

interface FButtonGroupProps {
	size?: Size
	type?: Type
	disabled?: boolean
	vertical?: boolean
}

interface FButtonGroupContext {
  size?: Size;
  type?: Type;
  disabled?: boolean;
}

export type { FButtonGroupProps,FButtonGroupContext }
