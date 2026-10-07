interface FTextareaProps {
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 @default false */
  disabled?: boolean;
  /** 最大长度 */
  maxlength?: number;
  /** 是否显示字数统计 @default false */
  showCount?: boolean;
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
  /** 是否可调整大小 @default 'vertical' */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /** 是否自动高度 @default false */
  autosize?: boolean;
}

export type { FTextareaProps };
