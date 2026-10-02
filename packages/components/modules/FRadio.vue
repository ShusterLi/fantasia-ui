<script setup lang="ts">
import type { FRadioProps } from '@/types';

const modelValue = defineModel<string | number | boolean>({ default: '' });
const props = defineProps<FRadioProps>();

const handleChange = (event: Event) => {
	if (props.disabled) return;
	const target = event.target as HTMLInputElement;
	if (target.checked) {
		modelValue.value = props.value ?? '';
	}
};
</script>

<template>
	<label class="f-radio" :class="{ 'is-disabled': disabled }">
		<span class="f-radio__wrapper">
			<input type="radio" :name="name" :checked="modelValue === value" :disabled="disabled"
				@change="handleChange" />
			<span class="f-radio__dot"></span>
		</span>
		<span v-if="label" class="f-radio__label">{{ label }}</span>
	</label>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-radio.scss';
</style>
