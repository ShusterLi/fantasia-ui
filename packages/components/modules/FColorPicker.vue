<script setup lang="ts">
import type { FColorPickerProps } from '@/types';

const props = withDefaults(defineProps<FColorPickerProps>(), {
	showAlpha: false,
	predefine: () => [],
	size: 'default',
	disabled: false
})

const modelValue = defineModel<string>({ default: '#409eff' })

// ---------- 颜色转换 ----------
function hsvToRgb(h: number, s: number, v: number) {
	s /= 100
	v /= 100
	const c = v * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = v - c
	let r = 0
	let g = 0
	let b = 0
	if (h < 60) [r, g, b] = [c, x, 0]
	else if (h < 120) [r, g, b] = [x, c, 0]
	else if (h < 180) [r, g, b] = [0, c, x]
	else if (h < 240) [r, g, b] = [0, x, c]
	else if (h < 300) [r, g, b] = [x, 0, c]
	else[r, g, b] = [c, 0, x]
	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255)
	}
}

function rgbToHsv(r: number, g: number, b: number) {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const d = max - min
	let h = 0
	if (d !== 0) {
		if (max === r) h = 60 * (((g - b) / d) % 6)
		else if (max === g) h = 60 * ((b - r) / d + 2)
		else h = 60 * ((r - g) / d + 4)
	}
	if (h < 0) h += 360
	const s = max === 0 ? 0 : d / max
	return { h, s: s * 100, v: max * 100 }
}

function rgbToHex(r: number, g: number, b: number) {
	return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

function parseColor(input: string) {
	const str = input.trim()

	const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
	if (hexMatch) {
		let hex = hexMatch[1]
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('')
		}
		const r = parseInt(hex.slice(0, 2), 16)
		const g = parseInt(hex.slice(2, 4), 16)
		const b = parseInt(hex.slice(4, 6), 16)
		const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
		return { ...rgbToHsv(r, g, b), a }
	}

	const rgbMatch = str.match(/^rgba?\(([^)]+)\)$/i)
	if (rgbMatch) {
		const [r, g, b, a = 1] = rgbMatch[1].split(',').map((p) => parseFloat(p.trim()))
		return { ...rgbToHsv(r, g, b), a }
	}

	return null
}

// ---------- 状态 ----------
const hsva = reactive({ h: 0, s: 0, v: 100, a: 1 })

let skipNextModelWatch = false

watch(
	modelValue,
	(val) => {
		if (skipNextModelWatch) {
			skipNextModelWatch = false
			return
		}
		const parsed = parseColor(val)
		if (parsed) {
			hsva.h = parsed.h
			hsva.s = parsed.s
			hsva.v = parsed.v
			hsva.a = parsed.a
		}
	},
	{ immediate: true }
)

function currentRgb() {
	return hsvToRgb(hsva.h, hsva.s, hsva.v)
}

function toColorString() {
	const { r, g, b } = currentRgb()
	if (props.showAlpha) {
		return `rgba(${r}, ${g}, ${b}, ${Math.round(hsva.a * 100) / 100})`
	}
	return rgbToHex(r, g, b)
}

function emitColor() {
	skipNextModelWatch = true
	modelValue.value = toColorString()
}

const previewRgb = computed(() => currentRgb())
const hueBackground =
	'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'

// ---------- 面板显隐 ----------
const visible = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function handleOutsideClick(e: MouseEvent) {
	if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
		visible.value = false
	}
}

watch(visible, (val) => {
	if (val) {
		nextTick(() => document.addEventListener('mousedown', handleOutsideClick))
	} else {
		document.removeEventListener('mousedown', handleOutsideClick)
	}
})

onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))

function togglePanel() {
	if (props.disabled) return
	visible.value = !visible.value
}

// ---------- 拖拽通用逻辑 ----------
function startTrack(
	el: HTMLElement,
	onMove: (clientX: number, clientY: number, rect: DOMRect) => void,
	e: MouseEvent
) {
	const rect = el.getBoundingClientRect()
	onMove(e.clientX, e.clientY, rect)

	function handleMove(moveEvent: MouseEvent) {
		onMove(moveEvent.clientX, moveEvent.clientY, rect)
	}
	function handleUp() {
		document.removeEventListener('mousemove', handleMove)
		document.removeEventListener('mouseup', handleUp)
	}
	document.addEventListener('mousemove', handleMove)
	document.addEventListener('mouseup', handleUp)
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

// 饱和度-明度面板
const panelRef = ref<HTMLElement | null>(null)
function handlePanelDrag(e: MouseEvent) {
	if (!panelRef.value) return
	startTrack(
		panelRef.value,
		(clientX, clientY, rect) => {
			const x = clamp(clientX - rect.left, 0, rect.width)
			const y = clamp(clientY - rect.top, 0, rect.height)
			hsva.s = (x / rect.width) * 100
			hsva.v = 100 - (y / rect.height) * 100
			emitColor()
		},
		e
	)
}

// 色相滑条
const hueRef = ref<HTMLElement | null>(null)
function handleHueDrag(e: MouseEvent) {
	if (!hueRef.value) return
	startTrack(
		hueRef.value,
		(clientX, _clientY, rect) => {
			const x = clamp(clientX - rect.left, 0, rect.width)
			hsva.h = (x / rect.width) * 360
			emitColor()
		},
		e
	)
}

// 透明度滑条
const alphaRef = ref<HTMLElement | null>(null)
function handleAlphaDrag(e: MouseEvent) {
	if (!alphaRef.value) return
	startTrack(
		alphaRef.value,
		(clientX, _clientY, rect) => {
			const x = clamp(clientX - rect.left, 0, rect.width)
			hsva.a = x / rect.width
			emitColor()
		},
		e
	)
}

// ---------- 文本输入 ----------
function tryParseColor(str: string) {
	const s = str.trim()
	if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s) || /^rgba?\([^)]+\)$/i.test(s)) {
		return parseColor(s)
	}
	return null
}

function handleInputChange(e: Event) {
	const target = e.target as HTMLInputElement
	const parsed = tryParseColor(target.value)
	if (parsed) {
		hsva.h = parsed.h
		hsva.s = parsed.s
		hsva.v = parsed.v
		hsva.a = parsed.a
		emitColor()
	} else {
		target.value = toColorString()
	}
}

// ---------- 预设色板 ----------
function selectPredefine(color: string) {
	const parsed = parseColor(color)
	if (!parsed) return
	hsva.h = parsed.h
	hsva.s = parsed.s
	hsva.v = parsed.v
	hsva.a = parsed.a
	emitColor()
}
</script>

<template>
	<div ref="rootRef" class="f-color-picker"
		:class="[`f-color-picker--${size}`, { 'f-color-picker--disabled': disabled }]">
		<div class="f-color-picker__trigger" @click="togglePanel">
			<div class="f-color-picker__swatch">
				<span class="f-color-picker__swatch-color"
					:style="{ background: `rgba(${previewRgb.r}, ${previewRgb.g}, ${previewRgb.b}, ${hsva.a})` }" />
			</div>
		</div>

		<Transition name="f-color-picker-fade">
			<div v-if="visible" class="f-color-picker__panel">
				<div ref="panelRef" class="f-color-picker__saturation" :style="{ backgroundColor: `hsl(${hsva.h}, 100%, 50%)` }"
					@mousedown="handlePanelDrag">
					<div class="f-color-picker__saturation-thumb" :style="{ left: `${hsva.s}%`, top: `${100 - hsva.v}%` }" />
				</div>

				<div class="f-color-picker__sliders">
					<div class="f-color-picker__slider-group">
						<div ref="hueRef" class="f-color-picker__hue" :style="{ backgroundImage: hueBackground }"
							@mousedown="handleHueDrag">
							<div class="f-color-picker__slider-thumb" :style="{ left: `${(hsva.h / 360) * 100}%` }" />
						</div>

						<div v-if="showAlpha" ref="alphaRef" class="f-color-picker__alpha" @mousedown="handleAlphaDrag">
							<div class="f-color-picker__alpha-gradient"
								:style="{ backgroundImage: `linear-gradient(to right, transparent, rgb(${previewRgb.r}, ${previewRgb.g}, ${previewRgb.b}))` }" />
							<div class="f-color-picker__slider-thumb" :style="{ left: `${hsva.a * 100}%` }" />
						</div>
					</div>

					<div class="f-color-picker__current"
						:style="{ background: `rgba(${previewRgb.r}, ${previewRgb.g}, ${previewRgb.b}, ${hsva.a})` }" />
				</div>

				<input class="f-color-picker__input" type="text" :value="toColorString()" @change="handleInputChange"
					@keydown.enter="($event.target as HTMLInputElement).blur()" />

				<div v-if="predefine.length" class="f-color-picker__predefine">
					<span v-for="color in predefine" :key="color" class="f-color-picker__predefine-item"
						:style="{ background: color }" @click="selectPredefine(color)" />
				</div>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss">
:root {
	--f-color-picker-border-color: #333338;
	--f-color-picker-panel-bg: #1f1f23;
	--f-color-picker-checkerboard: #333338;
	--f-color-picker-input-bg: #18181b;
	--f-color-picker-input-color: #e4e4e7;
}

:root.light {
	--f-color-picker-border-color: #e4e4e7;
	--f-color-picker-panel-bg: #ffffff;
	--f-color-picker-checkerboard: #d4d4d8;
	--f-color-picker-input-bg: #fafafa;
	--f-color-picker-input-color: #18181b;
}

.f-color-picker {
	position: relative;
	display: inline-block;

	&--small &__trigger {
		width: 24px;
		height: 24px;
	}

	&--default &__trigger {
		width: 32px;
		height: 32px;
	}

	&--large &__trigger {
		width: 40px;
		height: 40px;
	}

	&--disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	&__trigger {
		padding: 3px;
		border: 1px solid var(--f-color-picker-border-color);
		border-radius: 6px;
		cursor: pointer;
		box-sizing: border-box;
	}

	&__swatch {
		width: 100%;
		height: 100%;
		border-radius: 3px;
		background-image:
			linear-gradient(45deg, var(--f-color-picker-checkerboard) 25%, transparent 25%),
			linear-gradient(-45deg, var(--f-color-picker-checkerboard) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--f-color-picker-checkerboard) 75%),
			linear-gradient(-45deg, transparent 75%, var(--f-color-picker-checkerboard) 75%);
		background-size: 8px 8px;
		background-position: 0 0, 0 4px, 4px -4px, -4px 0;

		&-color {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 3px;
		}
	}

	&__panel {
		position: absolute;
		z-index: 10;
		top: calc(100% + 8px);
		left: 0;
		width: 220px;
		padding: 12px;
		background: var(--f-color-picker-panel-bg);
		border: 1px solid var(--f-color-picker-border-color);
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
	}

	&__saturation {
		position: relative;
		height: 140px;
		border-radius: 4px;
		background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
		cursor: crosshair;

		&-thumb {
			position: absolute;
			width: 10px;
			height: 10px;
			border: 2px solid #fff;
			border-radius: 50%;
			box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
			transform: translate(-50%, -50%);
			pointer-events: none;
		}
	}

	&__sliders {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 10px;
	}

	&__slider-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__hue,
	&__alpha {
		position: relative;
		height: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	&__alpha {
		background-image:
			linear-gradient(45deg, var(--f-color-picker-checkerboard) 25%, transparent 25%),
			linear-gradient(-45deg, var(--f-color-picker-checkerboard) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--f-color-picker-checkerboard) 75%),
			linear-gradient(-45deg, transparent 75%, var(--f-color-picker-checkerboard) 75%);
		background-size: 8px 8px;
		background-position: 0 0, 0 4px, 4px -4px, -4px 0;

		&-gradient {
			position: absolute;
			inset: 0;
			border-radius: 5px;
		}
	}

	&__slider-thumb {
		position: absolute;
		top: 50%;
		width: 12px;
		height: 12px;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	&__current {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		border: 1px solid var(--f-color-picker-border-color);
	}

	&__input {
		box-sizing: border-box;
		width: 100%;
		margin-top: 10px;
		padding: 6px 8px;
		font-size: 12px;
		color: var(--f-color-picker-input-color);
		background: var(--f-color-picker-input-bg);
		border: 1px solid var(--f-color-picker-border-color);
		border-radius: 4px;
		outline: none;

		&:focus {
			border-color: var(--f-color-picker-input-color);
		}
	}

	&__predefine {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 10px;

		&-item {
			width: 18px;
			height: 18px;
			border-radius: 3px;
			border: 1px solid var(--f-color-picker-border-color);
			cursor: pointer;
		}
	}
}

.f-color-picker-fade-enter-active,
.f-color-picker-fade-leave-active {
	transition: opacity 0.15s, transform 0.15s;
}

.f-color-picker-fade-enter-from,
.f-color-picker-fade-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
