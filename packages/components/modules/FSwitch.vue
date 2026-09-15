<script setup lang="ts">
import type { FSwitchProps } from '@/types';

const modelValue = defineModel<boolean>({ default: false });
const props = defineProps<FSwitchProps>();

const toggle = () => {
	if (props.disabled) return;
	modelValue.value = !modelValue.value;
};
</script>

<template>
	<button
		type="button"
		class="f-switch"
		:class="{ 'is-checked': modelValue, 'is-disabled': disabled }"
		:disabled="disabled"
		:aria-checked="modelValue"
		role="switch"
		@click="toggle"
	>
		<span class="f-switch__track">
			<span class="f-switch__thumb"></span>
		</span>
		<span v-if="label || activeText || inactiveText" class="f-switch__text">
			{{ modelValue ? (activeText ?? label) : (inactiveText ?? label) }}
		</span>
	</button>
</template>

<style lang="scss" scoped>
.f-switch {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	transition: opacity 0.2s ease;

	&.is-disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	&__track {
		position: relative;
		display: inline-block;
		width: 42px;
		height: 24px;
		padding: 2px;
		border-radius: 999px;
		background: #e2e8f0;
		box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.25);
		transition: all 0.25s ease;
	}

	&__thumb {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
		transition: transform 0.25s ease;
	}

	&.is-checked .f-switch__track {
		background: #ec4899;
	}

	&.is-checked .f-switch__thumb {
		transform: translateX(18px);
	}

	&__text {
		font-size: 14px;
		color: #1e293b;
		line-height: 1;
	}
}
</style>
