import type { FDropdownOption } from './f-dropdown';

export interface FSelectProps {
  /** 选项列表 */
  options: FDropdownOption[];
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
}

export interface FSelectEmits {
  /** 选中时触发 */
  select: [key: string | number, option: FDropdownOption];
  /** 值改变时触发 */
  change: [key: string | number, option: FDropdownOption];
  /** 清空时触发 */
  clear: [];
}
