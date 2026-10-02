<script setup lang="ts">
import type { FRadioGroupOption, FRadioGroupProps } from '@/types';

const modelValue = defineModel<string | number | boolean>({ default: '' });
const props = withDefaults(defineProps<FRadioGroupProps>(), {
	direction: 'horizontal',
});

const handleChange = (option: FRadioGroupOption) => {
	if (option.disabled || props.disabled) return;
	modelValue.value = option.value;
};
</script>

<template>
	<div class="f-radio-group" :class="[`is-${direction}`]">
		<label
			v-for="option in options"
			:key="String(option.value)"
			class="f-radio"
			:class="{ 'is-disabled': option.disabled || disabled }"
		>
			<span class="f-radio__wrapper">
				<input
					type="radio"
					:name="name ?? 'f-radio-group'"
					:checked="modelValue === option.value"
					:disabled="option.disabled || disabled"
					@change="handleChange(option)"
				/>
				<span class="f-radio__dot"></span>
			</span>
			<span v-if="option.label" class="f-radio__label">{{ option.label }}</span>
		</label>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-radio-group.scss';
</style>

