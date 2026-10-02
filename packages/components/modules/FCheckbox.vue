<script setup lang="ts">
import type { FCheckboxProps } from '@/types';

const modelValue = defineModel<boolean>({ default: false });

const props = defineProps<FCheckboxProps>();

const handleChange = (e: Event) => {
	if (props.disabled) return;
	const target = e.target as HTMLInputElement;
	modelValue.value = target.checked;
};
</script>

<template>
	<label class="f-checkbox" :class="{ 'is-disabled': disabled }">
		<span class="f-checkbox__wrapper">
			<input type="checkbox" :checked="modelValue" :disabled="disabled" @change="handleChange" />
			<span class="f-checkbox__checkmark"></span>
		</span>
		<span v-if="label" class="f-checkbox__label">{{ label }}</span>
	</label>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-checkbox.scss';
</style>

