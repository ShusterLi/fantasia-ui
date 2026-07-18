<script setup lang="ts">
import type { FInputNumberProps } from '@/types';

const props = withDefaults(defineProps<FInputNumberProps>(), {
	min: -Infinity,
	max: Infinity,
	step: 1,
	precision: undefined,
	disabled: false,
	size: 'default',
	controls: true,
	controlsPosition: 'right',
	placeholder: ''
})

const modelValue = defineModel<number | undefined>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
// 编辑态下的原始文本，允许输入 "1." "-" 这类中间态
const displayText = ref('')

function format(value: number) {
	return props.precision !== undefined ? value.toFixed(props.precision) : String(value)
}

function clamp(value: number) {
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

function commit(raw: string) {
	if (raw.trim() === '') {
		modelValue.value = undefined
		displayText.value = ''
		return
	}
	const parsed = Number(raw)
	if (Number.isNaN(parsed)) {
		// 非法输入，回退到上一个合法值
		displayText.value = modelValue.value === undefined ? '' : format(modelValue.value)
		return
	}
	const clamped = clamp(parsed)
	modelValue.value = clamped
	displayText.value = format(clamped)
}

function handleInput(e: Event) {
	const raw = (e.target as HTMLInputElement).value
	// 编辑过程中放行合法的数字中间态：空、负号、小数点结尾
	if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
		displayText.value = raw
	}
}

function handleFocus() {
	isFocused.value = true
}

function handleBlur() {
	isFocused.value = false
	commit(displayText.value)
}

function handleEnter() {
	inputRef.value?.blur()
}

function step(direction: 1 | -1) {
	if (props.disabled) return
	const base = modelValue.value ?? 0
	const next = clamp(base + direction * props.step)
	modelValue.value = next
	displayText.value = format(next)
}

// 长按连续加减
let repeatTimer: ReturnType<typeof setTimeout> | null = null
let repeatInterval: ReturnType<typeof setInterval> | null = null

function startRepeat(direction: 1 | -1) {
	if (props.disabled) return
	step(direction)
	repeatTimer = setTimeout(() => {
		repeatInterval = setInterval(() => step(direction), 80)
	}, 400)
}

function stopRepeat() {
	if (repeatTimer) clearTimeout(repeatTimer)
	if (repeatInterval) clearInterval(repeatInterval)
	repeatTimer = null
	repeatInterval = null
}

function handleKeydown(e: KeyboardEvent) {
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

function handleWheel(e: WheelEvent) {
	if (!isFocused.value || props.disabled) return
	e.preventDefault()
	step(e.deltaY < 0 ? 1 : -1)
}
</script>

<template>
	<div class="f-input-number" :class="[
		`f-input-number--${size}`,
		`f-input-number--controls-${controlsPosition}`,
		{ 'f-input-number--disabled': disabled, 'f-input-number--without-controls': !controls }
	]">
		<button v-if="controls && controlsPosition === 'both'" type="button"
			class="f-input-number__control f-input-number__control--minus" tabindex="-1" :disabled="disabled || !canDecrease"
			@mousedown.prevent="startRepeat(-1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
			<svg viewBox="0 0 12 12" width="10" height="10">
				<path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>

		<input ref="inputRef" class="f-input-number__inner" type="text" inputmode="decimal" :value="displayText"
			:disabled="disabled" :placeholder="placeholder" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
			@keydown="handleKeydown" @wheel="handleWheel" />

		<button v-if="controls && controlsPosition === 'both'" type="button"
			class="f-input-number__control f-input-number__control--plus" tabindex="-1" :disabled="disabled || !canIncrease"
			@mousedown.prevent="startRepeat(1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
			<svg viewBox="0 0 12 12" width="10" height="10">
				<path d="M2 6h8M6 2v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>

		<div v-if="controls && controlsPosition === 'right'" class="f-input-number__stack">
			<button type="button" class="f-input-number__stack-btn" tabindex="-1" :disabled="disabled || !canIncrease"
				@mousedown.prevent="startRepeat(1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
				<svg viewBox="0 0 12 12" width="8" height="8">
					<path d="M2 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</button>
			<button type="button" class="f-input-number__stack-btn" tabindex="-1" :disabled="disabled || !canDecrease"
				@mousedown.prevent="startRepeat(-1)" @mouseup="stopRepeat" @mouseleave="stopRepeat">
				<svg viewBox="0 0 12 12" width="8" height="8">
					<path d="M2 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</button>
		</div>
	</div>
</template>

<style lang="scss">
:root {
	--f-input-number-border-color: #333338;
	--f-input-number-bg: #18181b;
	--f-input-number-color: #e4e4e7;
	--f-input-number-control-bg: #232328;
	--f-input-number-control-hover-bg: #2c2c32;
	--f-input-number-focus-color: #6366f1;
}

:root.light {
	--f-input-number-border-color: #e4e4e7;
	--f-input-number-bg: #ffffff;
	--f-input-number-color: #18181b;
	--f-input-number-control-bg: #f4f4f5;
	--f-input-number-control-hover-bg: #e4e4e7;
}

.f-input-number {
	position: relative;
	display: inline-flex;
	align-items: stretch;
	width: 140px;
	border: 1px solid var(--f-input-number-border-color);
	border-radius: 6px;
	background: var(--f-input-number-bg);
	overflow: hidden;
	transition: border-color 0.2s;

	&:focus-within {
		border-color: var(--f-input-number-focus-color);
	}

	&--small {
		height: 28px;
		font-size: 12px;
	}

	&--default {
		height: 32px;
		font-size: 13px;
	}

	&--large {
		height: 38px;
		font-size: 14px;
	}

	&--disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	&__inner {
		flex: 1;
		min-width: 0;
		padding: 0 10px;
		border: none;
		outline: none;
		background: transparent;
		color: var(--f-input-number-color);
		font-size: inherit;
		text-align: center;

		&::placeholder {
			color: var(--f-input-number-control-hover-bg);
		}
	}

	&--controls-both &__inner {
		text-align: center;
	}

	&--controls-right &__inner {
		text-align: left;
	}

	&--without-controls &__inner {
		text-align: left;
	}

	&__control {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		flex-shrink: 0;
		border: none;
		background: var(--f-input-number-control-bg);
		color: var(--f-input-number-color);
		cursor: pointer;

		&:hover:not(:disabled) {
			background: var(--f-input-number-control-hover-bg);
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		&--minus {
			border-right: 1px solid var(--f-input-number-border-color);
		}

		&--plus {
			border-left: 1px solid var(--f-input-number-border-color);
		}
	}

	&__stack {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 20px;
		border-left: 1px solid var(--f-input-number-border-color);

		&-btn {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			background: var(--f-input-number-control-bg);
			color: var(--f-input-number-color);
			cursor: pointer;

			&:first-child {
				border-bottom: 1px solid var(--f-input-number-border-color);
			}

			&:hover:not(:disabled) {
				background: var(--f-input-number-control-hover-bg);
			}

			&:disabled {
				opacity: 0.4;
				cursor: not-allowed;
			}
		}
	}
}
</style>
