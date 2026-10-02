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

// 鎻愪緵缁?FInput
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
			{{ label }}锛?		</label>

		<div class="f-form-item__content">
			<slot />
			<Transition name="err-slide">
				<p v-if="errorMsg" class="f-form-item__error">{{ errorMsg }}</p>
			</Transition>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-form-item.scss';
</style>

