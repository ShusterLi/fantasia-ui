<script setup lang="ts">
import type { FInputNumberProps } from '@/types';
import FIcon from './FIcon.vue';
import { RemoveOutline, AddOutline, ChevronUpOutline, ChevronDownOutline } from '@vicons/ionicons5';

const props = withDefaults(defineProps<FInputNumberProps>(), {
	min: -Infinity,
	max: Infinity,
	step: 1,
	precision: undefined,
	disabled: false,
	controls: true,
	controlsPosition: 'right',
	placeholder: ''
})

const modelValue = defineModel<number | undefined>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const displayText = ref('')

const formItemContext = inject<{ errorMsg: Ref<string>, validate: () => void } | null>('FFormItemContext', null)
const hasError = computed(() => !!formItemContext?.errorMsg?.value)

const format = (value: number) => {
	return props.precision !== undefined ? value.toFixed(props.precision) : String(value)
}

const clamp = (value: number) => {
	let result = Math.min(Math.max(value, props.min), props.max)
	if (props.precision !== undefined) {
		result = Number(result.toFixed(props.precision))
	}
	return result
}

watch(
	modelValue,
	(val) => {
		if (isFocused.value) return
		displayText.value = val === undefined || val === null || Number.isNaN(val) ? '' : format(val)
	},
	{ immediate: true }
)

const canIncrease = computed(() => modelValue.value === undefined || modelValue.value < props.max)
const canDecrease = computed(() => modelValue.value === undefined || modelValue.value > props.min)

const commit = (raw: string) => {
	if (raw.trim() === '') {
		modelValue.value = undefined
		displayText.value = ''
		return
	}
	const parsed = Number(raw)
	if (Number.isNaN(parsed)) {
		displayText.value = modelValue.value === undefined ? '' : format(modelValue.value)
		return
	}
	const clamped = clamp(parsed)
	modelValue.value = clamped
	displayText.value = format(clamped)
}

const handleInput = (e: Event) => {
	const raw = (e.target as HTMLInputElement).value
	if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
		displayText.value = raw
	}
}

const handleFocus = () => {
	isFocused.value = true
}

const handleBlur = () => {
	isFocused.value = false
	commit(displayText.value)
	formItemContext?.validate();
}

const handleEnter = () => {
	inputRef.value?.blur()
}

const step = (direction: 1 | -1) => {
	if (props.disabled) return
	const base = modelValue.value ?? 0
	const next = clamp(base + direction * props.step)
	modelValue.value = next
	displayText.value = format(next)
}

let repeatTimer: ReturnType<typeof setTimeout> | null = null
let repeatInterval: ReturnType<typeof setInterval> | null = null

const startRepeat = (direction: 1 | -1) => {
	if (props.disabled) return
	step(direction)
	repeatTimer = setTimeout(() => {
		repeatInterval = setInterval(() => step(direction), 80)
	}, 400)
}

const stopRepeat = () => {
	if (repeatTimer) clearTimeout(repeatTimer)
	if (repeatInterval) clearInterval(repeatInterval)
	repeatTimer = null
	repeatInterval = null
}

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'ArrowUp') {
		e.preventDefault()
		step(1)
	} else if (e.key === 'ArrowDown') {
		e.preventDefault()
		step(-1)
	} else if (e.key === 'Enter') {
		handleEnter()
	}
}

const handleWheel = (e: WheelEvent) => {
	if (!isFocused.value || props.disabled) return
	e.preventDefault()
	step(e.deltaY < 0 ? 1 : -1)
}
</script>

<template>
	<div class="f-input-number" :class="{
		'is-focus': isFocused,
		'is-error': hasError,
		'is-disabled': disabled,
		'has-controls-both': controls && controlsPosition === 'both',
		'has-controls-right': controls && controlsPosition === 'right'
	}">
		<button v-if="controls && controlsPosition === 'both'" type="button" class="f-input-number__btn-left"
			tabindex="-1" :disabled="disabled || !canDecrease" @mousedown.prevent="startRepeat(-1)" @mouseup="stopRepeat"
			@mouseleave="stopRepeat">
			<f-icon>
				<RemoveOutline />
			</f-icon>
		</button>

		<input ref="inputRef" class="f-input-number__inner" type="text" inputmode="decimal" :value="displayText"
			:disabled="disabled" :placeholder="placeholder" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
			@keydown="handleKeydown" @wheel="handleWheel" />

		<button v-if="controls && controlsPosition === 'both'" type="button" class="f-input-number__btn-right"
			tabindex="-1" :disabled="disabled || !canIncrease" @mousedown.prevent="startRepeat(1)" @mouseup="stopRepeat"
			@mouseleave="stopRepeat">
			<f-icon>
				<AddOutline />
			</f-icon>
		</button>

		<div v-if="controls && controlsPosition === 'right'" class="f-input-number__stack">
			<button type="button" class="f-input-number__stack-btn" tabindex="-1" :disabled="disabled || !canIncrease"
				@mousedown.prevent="startRepeat(1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
				<f-icon>
					<ChevronUpOutline />
				</f-icon>
			</button>
			<button type="button" class="f-input-number__stack-btn" tabindex="-1" :disabled="disabled || !canDecrease"
				@mousedown.prevent="startRepeat(-1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
				<f-icon>
					<ChevronDownOutline />
				</f-icon>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.f-input-number {
	position: relative;
	display: inline-flex;
	align-items: center;
	width: 140px;
	background: #f8fafc;
	border: 1px solid #e0e0e6;
	border-radius: 4px;
	transition: all 0.2s ease;

	&__inner {
		flex: 1;
		min-width: 0;
		padding: 10px 12px;
		border: none;
		outline: none;
		background: transparent;
		color: #1e293b;
		font-size: 14px;
		text-align: left;

		&::placeholder {
			color: #94a3b8;
		}
	}

	&.has-controls-both &__inner {
		text-align: center;
	}

	&.has-controls-right &__inner {
		padding-right: 8px;
	}

	&__btn-left,
	&__btn-right {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 100%;
		flex-shrink: 0;
		border: none;
		background: transparent;
		color: #94a3b8;
		cursor: pointer;
		transition: all 0.2s ease;

		:deep(svg) {
			width: 16px;
			height: 16px;
		}

		&:hover:not(:disabled) {
			color: #64748b;
			background: #f1f5f9;
		}

		&:active:not(:disabled) {
			transform: scale(0.95);
		}

		&:disabled {
			opacity: 0.35;
			cursor: not-allowed;
		}
	}

	&__btn-left {
		border-right: 1px solid #e0e0e6;
	}

	&__btn-right {
		border-left: 1px solid #e0e0e6;
	}

	&__stack {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 24px;
		height: 100%;
		border-left: 1px solid #e0e0e6;

		&-btn {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			background: transparent;
			color: #94a3b8;
			cursor: pointer;
			transition: all 0.15s ease;

			:deep(svg) {
				width: 12px;
				height: 12px;
			}

			&:first-child {
				border-bottom: 1px solid #e0e0e6;
			}

			&:hover:not(:disabled) {
				color: #64748b;
				background: #f1f5f9;
			}

			&:active:not(:disabled) {
				transform: scale(0.9);
			}

			&:disabled {
				opacity: 0.35;
				cursor: not-allowed;
			}
		}
	}

	&:hover:not(.is-disabled) {
		border-color: #ec4899;
	}

	&.is-focus {
		background: #fff;
		border-color: #ec4899;
		box-shadow: 0 0 0 2px #ec48993a;
	}

	&.is-error {
		border-color: #f43f5e;
		background: #fff1f2;

		&.is-focus {
			box-shadow: 0 0 0 2px #f43f5e2a;
		}
	}

	&.is-disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: #f8fafc;

		.f-input-number__inner {
			cursor: not-allowed;
		}
	}
}
</style>
