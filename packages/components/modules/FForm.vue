<script setup lang="ts">
import type { FFormProps } from '@/types';

const props = withDefaults(defineProps<FFormProps>(), {
	rules: () => ({}),
	labelWidth: '80px',
	labelPosition: 'right',
	size: 'normal'
});

interface FieldItem {
	prop: string;
	validate: () => Promise<string | undefined>;
	clearValidate: () => void;
}
const fields = ref<FieldItem[]>([]);

const registerField = (field: FieldItem) => {
	fields.value.push(field);
};

const unregisterField = (prop: string) => {
	fields.value = fields.value.filter(f => f.prop !== prop);
};

provide('FFormContext', {
	model: props.model,
	rules: props.rules,
	labelWidth: props.labelWidth,
	labelPosition: computed(() => props.labelPosition),
	size: computed(() => props.size),
	registerField,
	unregisterField
});

const validate = async () => {
	const validationPromises = fields.value.map(field => field.validate());
	const results = await Promise.all(validationPromises);
	const errors = results.filter(msg => msg !== undefined);

	if (errors.length > 0) {
		throw new Error('表单校验失败');
	}
	return true;
};

const resetFields = () => {
	fields.value.forEach(field => field.clearValidate());
};

defineExpose({
	validate,
	resetFields
});
</script>

<template>
	<form class="f-form" :class="[
		`f-form--label-${labelPosition}`,
		`f-form--size-${size}`
	]" @submit.prevent>
		<slot />
	</form>
</template>

<style scoped lang="scss">
.f-form {
	display: flex;
	flex-direction: column;

	&--size-small {
		gap: 12px;
	}

	&--size-large {
		gap: 24px;
	}

	&--label-top {}
}
</style>
