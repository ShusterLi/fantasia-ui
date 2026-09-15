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
			<input
				type="radio"
				:name="name"
				:checked="modelValue === value"
				:disabled="disabled"
				@change="handleChange"
			/>
			<span class="f-radio__dot"></span>
		</span>
		<span v-if="label" class="f-radio__label">{{ label }}</span>
	</label>
</template>

<style lang="scss" scoped>
.f-radio {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
	transition: opacity 0.2s ease;

	&.is-disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	&__wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
	}

	input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		cursor: pointer;
		z-index: 1;

		&:disabled {
			cursor: not-allowed;
		}
	}

	&__dot {
		position: relative;
		display: inline-block;
		width: 100%;
		height: 100%;
		background: #f8fafc;
		border: 1px solid #e0e0e6;
		border-radius: 50%;
		transition: all 0.2s ease;

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 6px;
			height: 6px;
			transform: translate(-50%, -50%) scale(0);
			border-radius: 50%;
			background: white;
			transition: transform 0.2s ease;
		}
	}

	&:hover .f-radio__dot {
		border-color: #ec4899;
		background: #fef2ff;
	}

	input:checked + .f-radio__dot {
		background: #ec4899;
		border-color: #ec4899;
		box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);

		&::after {
			transform: translate(-50%, -50%) scale(1);
		}
	}

	input:focus-visible + .f-radio__dot {
		box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
	}

	&__label {
		font-size: 14px;
		color: #1e293b;
		line-height: 1;
	}
}
</style>
