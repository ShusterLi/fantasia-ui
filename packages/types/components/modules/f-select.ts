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
  /** 是否多选 */
  multiple?: boolean;
  /** 过滤筛选 */
  filterable?: boolean;
  /** 是否允许输入时创建新选项（仅当 filterable 为 true 时生效） */
  allowCreate?: boolean;
  /** 是否显示新增选项按钮 */
  showAddOption?: boolean;
  /** 新增选项按钮文本 */
  addOptionText?: string;
}

export interface FSelectEmits {
  /** 选中时触发 */
  select: [key: string | number, option: FDropdownOption];
  /** 值改变时触发 */
  change: [key: string | number, option: FDropdownOption];
  /** 清空时触发 */
  clear: [];
  /** 新增选项时触发 */
  add: [label: string];
}
