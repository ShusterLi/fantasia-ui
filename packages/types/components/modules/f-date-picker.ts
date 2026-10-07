interface FDatePickerProps {
  /** 占位符 @default '选择日期' */
  placeholder?: string;
  /** 是否禁用 @default false */
  disabled?: boolean;
  /** 是否可清空 @default true */
  clearable?: boolean;
  /** 日期格式 @default 'YYYY-MM-DD' */
  format?: string;
}

export type { FDatePickerProps };
