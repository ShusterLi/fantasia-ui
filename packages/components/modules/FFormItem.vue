<script setup lang="ts">
import type { FFormItemProps } from '@/types'
import { validateSingleField } from '@/utils'

const props = defineProps<FFormItemProps>()

const formContext = inject<any>('FFormContext')
const errorMsg = ref('')

const labelPosition = computed(() => formContext?.labelPosition?.value || 'right')
const size = computed(() => formContext?.size?.value || 'default')

const activeRules = computed(() => {
	if (!formContext?.rules || !props.prop) return []
	const rules = formContext.rules[props.prop] || []
	return Array.isArray(rules) ? rules : [rules]
})

const isRequired = computed(() => activeRules.value.some((r: any) => r.required))

const validate = async () => {
	if (!props.prop || !formContext) return undefined
	const value = formContext.model[props.prop]
	const result = await validateSingleField(value, activeRules.value)
	errorMsg.value = result || ''
	return result
}

const clearValidate = () => { errorMsg.value = '' }

// 提供给 FInput
provide('FFormItemContext', { errorMsg, validate })

onMounted(() => {
	if (props.prop && formContext?.registerField) {
		formContext.registerField({ prop: props.prop, validate, clearValidate })
	}
})

onUnmounted(() => {
	if (props.prop && formContext?.unregisterField) {
		formContext.unregisterField(props.prop)
	}
})

watch(() => formContext?.model[props.prop!], () => {
	if (errorMsg.value) validate()
})

defineExpose({ validate, clearValidate })
</script>

<template>
	<div class="f-form-item" :class="[
		`is-label-${labelPosition}`,
		`is-size-${size}`,
		{ 'is-error': errorMsg }
	]">
		<label v-if="label" class="f-form-item__label" :style="{
			width: labelPosition === 'top' ? '100%' : formContext?.labelWidth,
			textAlign: labelPosition === 'top' ? 'left' : labelPosition
		}">
			<span v-if="isRequired" class="star">*</span>
			{{ label }}：
		</label>

		<div class="f-form-item__content">
			<slot />
			<Transition name="err-slide">
				<p v-if="errorMsg" class="f-form-item__error">{{ errorMsg }}</p>
			</Transition>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.f-form-item {
	display: flex;
	font-size: 12px;
	margin-bottom: 18px;

	&.is-label-top {
		flex-direction: column;

		.f-form-item__label {
			margin-bottom: 6px;
		}
	}

	&.is-label-left,
	&.is-label-right {
		flex-direction: row;
		align-items: flex-start;

		.f-form-item__label {
			margin-right: 12px;
			padding-top: 8px;
			flex-shrink: 0;
		}
	}

	&.is-size-small .f-form-item__label {
		font-size: 12px;
	}

	&.is-size-large .f-form-item__label {
		font-size: 16px;
	}

	&__label {
		color: #374151;
		font-size: 13px;
		font-weight: 500;

		.star {
			color: #f43f5e;
			margin-right: 2px;
		}
	}

	&__content {
		flex: 1;
		min-width: 0;
		position: relative;
	}

	&__error {
		position: absolute;
		top: 100%;
		left: 4px;
		font-size: 12px;
		color: #f43f5e;
		margin-top: 2px;
		line-height: 1.4;
	}
}

.err-slide-enter-active,
.err-slide-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.err-slide-enter-from,
.err-slide-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
