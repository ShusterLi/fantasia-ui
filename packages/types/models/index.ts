// 菜单项类型
export interface MenuItem {
  id?: string | number;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  [key: string]: any;
}

// 表格列类型
export interface Columns {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  fixed?: boolean | 'left' | 'right';
  [key: string]: any;
}

// 操作按钮类型
export interface Actions {
  label: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  onClick?: (...args: any[]) => void;
  disabled?: boolean;
  [key: string]: any;
}
