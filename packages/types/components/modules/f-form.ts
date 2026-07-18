import { Size } from "./base";

type LabelPosition = 'left' | 'right' | 'top';
type RuleType =
	| 'string' | 'number' | 'boolean' | 'method' | 'regexp'
	| 'integer' | 'float' | 'array' | 'object' | 'enum'
	| 'date' | 'url' | 'email' | 'hex';

interface FFormProps {
	model: Record<string, any>;
	rules?: Rules;
	labelWidth?: string;
	labelPosition?: LabelPosition;
	size?: Size;
}

interface Rule {
	required?: boolean;
	type?: RuleType;
	min?: number; // 字符串/数组长度，或数字最小值
	max?: number; // 字符串/数组长度，或数字最大值
	len?: number; // 严格长度
	enum?: any[]; // 枚举值范围
	pattern?: RegExp;
	whitespace?: boolean; // 是否不允许纯空格
	transform?: (value: any) => any; // 校验前转换
	message?: string;
	validator?: (value: any, rule: Rule) => boolean | string | Promise<boolean | string>;
	trigger?: string | string[];
}

type Rules = Record<string, Rule | Rule[]>;

export type { FFormProps, Rule, Rules }
