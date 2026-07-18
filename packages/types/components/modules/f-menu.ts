import type { MenuItem } from "@/types/models";

interface FMenu {
  items: MenuItem[];
  depth?: number;
  collapsed?: boolean;
  variant?: 'default' | 'dropdown';
}

interface FMenuItem {
  item: MenuItem;
  depth?: number;
  collapsed?: boolean;
}

export type { FMenu, FMenuItem }
