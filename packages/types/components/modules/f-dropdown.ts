import type { Component } from "vue";
import type { Placement } from "./base";

interface FDropdownOption {
  key: string | number;
  label: string;
  disabled?: boolean;
  children?: FDropdownOption[];
  icon?: string | Component;
}

interface FDropdownProps {
  placement?: Placement;
  offset?: number | [number, number];
  zIndex?: number;
  trigger?: 'hover' | 'click';
  options?: FDropdownOption[];
}

export type { FDropdownProps, FDropdownOption };
