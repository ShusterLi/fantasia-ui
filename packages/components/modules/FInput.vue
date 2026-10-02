<script setup lang="ts">
import type { FInputProps } from '@/types';
import FIcon from './FIcon.vue';
import { EyeOutline, EyeOffOutline, CloseCircleOutline } from '@vicons/ionicons5';


const modelValue = defineModel<string>({ default: '' });
const props = defineProps<FInputProps>();

const formItemContext = inject<{ errorMsg: Ref<string>, validate: () => void } | null>('FFormItemContext', null)

const isPasswordVisible = ref(false);
const isFocused = ref(false);

const hasError = computed(() => !!formItemContext?.errorMsg?.value)
const inputType = computed(() => {
	if (props.showPassword && props.type === 'password') {
		return isPasswordVisible.value ? 'text' : 'password';
	}
	return props.type || 'text';
});

const showClearIcon = computed(() => {
	return props.clearable && modelValue.value && !props.showPassword;
});

const showPasswordIcon = computed(() => {
	return props.showPassword && props.type === 'password' && modelValue.value;
});

const onInput = (e: Event) => {
	modelValue.value = (e.target as HTMLInputElement).value;
};

const onBlur = (e: FocusEvent) => {
	isFocused.value = false;
	formItemContext?.validate();
};

const onFocus = () => {
	isFocused.value = true;
};

const clearValue = () => {
	modelValue.value = '';
};

const togglePassword = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
	<div class="f-input" :class="{
		'is-focus': isFocused,
		'is-error': hasError
	}">
		<input :type="inputType" :value="modelValue" :placeholder="placeholder" @input="onInput" @blur="onBlur"
			@focus="onFocus" class="f-input__inner" />

		<div class="f-input__suffix">
			<f-icon v-if="showClearIcon" @click="clearValue" class="icon-btn">
				<component :is="CloseCircleOutline" />
			</f-icon>

			<f-icon v-if="showPasswordIcon" @click="togglePassword" class="icon-btn">
				<component :is="isPasswordVisible ? EyeOutline : EyeOffOutline" />
			</f-icon>
		</div>

		<div class="f-input__focus-bg"></div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-input.scss';
</style>

