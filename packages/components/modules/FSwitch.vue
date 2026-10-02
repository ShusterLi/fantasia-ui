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
@use '../../styles/components/f-switch.scss';
</style>

