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
.f-input {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	background: #f8fafc;
	border: 1px solid #e0e0e6;
	border-radius: 4px;
	transition: all 0.2s ease;

	&__inner {
		flex: 1;
		padding: 10px 12px;
		background: transparent;
		border: none;
		font-size: 14px;
		color: #1e293b;
		outline: none;

		&::placeholder {
			color: #94a3b8;
		}
	}

	&__suffix {
		display: flex;
		align-items: center;
		padding-right: 8px;
		gap: 4px;
		color: #94a3b8;

		.icon-btn {
			cursor: pointer;
			transition: color 0.2s;

			&:hover {
				color: #64748b;
			}
		}
	}

	&:hover {
		border-color: #ec4899;
	}

	&.is-focus {
		background: #fff;
		border-color: #ec4899;
		box-shadow: 0 0 0 2px #ec48993a;
	}

	// 错误状态样式
	&.is-error {
		border-color: #f43f5e;
		background: #fff1f2;

		&:focus-within {
			box-shadow: 0 0 0 2px #f43f5e2a;
		}
	}
}
</style>
