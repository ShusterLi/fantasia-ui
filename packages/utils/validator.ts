import type { Rule, Rules } from "@/types";

/**
 * 校验单个值是否符合规则列表（异步，支持 validator 返回 Promise）
 * @param value 字段值
 * @param rules 规则数组
 * @returns 校验通过返回 undefined，失败返回错误信息字符串
 */
export const validateSingleField = async (value: any, rules: Rule | Rule[]): Promise<string | undefined> => {
	const ruleArray = Array.isArray(rules) ? rules : [rules];

	for (let rule of ruleArray) {
		// 0. Transform
		if (rule.transform) {
			value = rule.transform(value);
		}

		// 1. Required & Whitespace 校验
		const isEmpty = value === undefined || value === null || value === '';
		const isAllWhitespace = rule.whitespace && typeof value === 'string' && value.trim() === '';

		if (rule.required && (isEmpty || isAllWhitespace)) {
			return rule.message || '此字段为必填项';
		}

		// 非必填且没值，跳过后续校验
		if (!rule.required && isEmpty) continue;

		// 2. 类型校验
		if (rule.type) {
			const typeError = checkType(value, rule);
			if (typeError) return typeError;
		}

		// 3. 范围校验 (数值比较 + 长度比较)
		const rangeError = checkRange(value, rule);
		if (rangeError) return rangeError;

		// 4. 正则校验 (独立于 type)
		if (rule.pattern && !rule.pattern.test(String(value))) {
			return rule.message || '格式不匹配';
		}

		// 5. 枚举校验
		if (rule.enum && !rule.enum.includes(value)) {
			return rule.message || '不在指定的枚举范围内';
		}

		// 6. 自定义校验器
		if (rule.validator) {
			const result = await Promise.resolve(rule.validator(value, rule));
			if (typeof result === 'string') return result;
			if (result === false) return rule.message || '校验失败';
		}
	}
	return undefined;
}

/**
 * 类型校验辅助函数
 */
const checkType = (value: any, rule: Rule): string | undefined => {
	const { type, message } = rule;
	switch (type) {
		case 'string':
			if (typeof value !== 'string') return message || '必须是字符串';
			break;
		case 'number':
			if (typeof value !== 'number' || isNaN(value)) return message || '必须是数字';
			break;
		case 'integer':
			if (!Number.isInteger(value)) return message || '必须是整数';
			break;
		case 'boolean':
			if (typeof value !== 'boolean') return message || '必须是布尔值';
			break;
		case 'array':
			if (!Array.isArray(value)) return message || '必须是数组';
			break;
		case 'object':
			if (typeof value !== 'object' || value === null) return message || '必须是对象';
			break;
		case 'email':
			const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
			if (!emailRegex.test(value)) return message || '邮箱格式不正确';
			break;
		case 'regexp':
			if (rule.pattern && !rule.pattern.test(String(value))) {
				return rule.message || '格式不匹配';
			}
			break;
	}
	return undefined;
};

const checkRange = (value: any, rule: Rule): string | undefined => {
	const { min, max, len, message, type } = rule;
	const isNum = type === 'number' || type === 'integer' || type === 'float';

	// 对于数字，校验数值大小；对于字符串/数组，校验 length
	const valToMeasure = (isNum && typeof value === 'number') ? value : (value?.length);

	if (valToMeasure === undefined) return undefined;

	if (len !== undefined && valToMeasure !== len) {
		return message || (isNum ? `值必须等于 ${len}` : `长度必须为 ${len}`);
	}
	if (min !== undefined && valToMeasure < min) {
		return message || (isNum ? `最小值不能小于 ${min}` : `长度不能小于 ${min}`);
	}
	if (max !== undefined && valToMeasure > max) {
		return message || (isNum ? `最大值不能大于 ${max}` : `长度不能大于 ${max}`);
	}
	return undefined;
};

/**
 * 批量校验整个 model（同步版本，不支持异步 validator，但调用单个异步校验实现）
 * @param model 数据对象
 * @param rules 规则集
 * @returns 返回错误对象 { fieldName: errorMessage }，无错误时返回空对象
 */
export const validateModel = async (
	model: Record<string, any>,
	rules: Rules
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
	const errors: Record<string, string> = {};

	// 获取属性值的辅助函数（支持 a.b.c）
	const getValue = (obj: any, path: string) => {
		return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
	};

	const tasks = Object.entries(rules).map(async ([fieldName, fieldRules]) => {
		const value = getValue(model, fieldName);
		const errMsg = await validateSingleField(value, fieldRules);
		if (errMsg) {
			errors[fieldName] = errMsg;
		}
	});

	await Promise.all(tasks);

	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}

/**
 * 同步版本的单个校验（不处理异步 validator，如果有异步会警告并跳过）
 * 用于简单场景，不推荐在复杂表单中使用
 */
export const validateSingleFieldSync = (value: any, rules: Rule[]): string | undefined => {
	if (!rules || rules.length === 0) return undefined;

	for (const rule of rules) {
		if (rule.required) {
			if (value === undefined || value === null || value === '') {
				return rule.message || '此字段为必填项';
			}
		}
		const isEmpty = value === undefined || value === null || value === '';
		if (isEmpty && !rule.required) continue;

		if (rule.type) {
			const typeError = checkType(value, rule);
			if (typeError) return typeError;
		}
		if (rule.min !== undefined && (typeof value === 'string' || Array.isArray(value))) {
			if (value.length < rule.min) return rule.message || `长度不能小于 ${rule.min}`;
		}
		if (rule.max !== undefined && (typeof value === 'string' || Array.isArray(value))) {
			if (value.length > rule.max) return rule.message || `长度不能大于 ${rule.max}`;
		}
		if (rule.len !== undefined && (typeof value === 'string' || Array.isArray(value))) {
			if (value.length !== rule.len) return rule.message || `长度必须为 ${rule.len}`;
		}
		if (rule.validator) {
			console.warn('同步校验不支持异步 validator，请使用异步版本 validateSingleField');
			const result = rule.validator(value, rule);
			if (typeof result === 'string') return result;
			if (result === false) return rule.message || '校验失败';
		}
	}
	return undefined;
}
