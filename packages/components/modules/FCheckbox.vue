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
.f-checkbox {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
	transition: opacity 0.2s;

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
	}

	&__checkmark {
		position: relative;
		display: inline-block;
		width: 100%;
		height: 100%;
		background: #f8fafc;
		border: 1px solid #e0e0e6;
		border-radius: 2px;
		transition: all 0.2s ease;

		// 自定义勾选样式
		&::after {
			content: '';
			position: absolute;
			display: none;
			left: 4px;
			width: 5px;
			height: 9px;
			border: solid white;
			border-width: 0 2px 2px 0;
			transform: rotate(45deg);
		}
	}

	&:hover .f-checkbox__checkmark {
		border-color: #ec4899;
		background: #fef2ff;
	}

	// 选中状态
	input:checked+.f-checkbox__checkmark {
		background: #ec4899;
		border-color: #ec4899;
		box-shadow: 0 0 0 2px #ec48993a;

		&::after {
			display: block;
		}
	}

	// focus 视觉效果
	input:focus-visible+.f-checkbox__checkmark {
		box-shadow: 0 0 0 2px #ec48993a;
	}

	&__label {
		font-size: 14px;
		color: #1e293b;
		line-height: 1;
	}
}
</style>
