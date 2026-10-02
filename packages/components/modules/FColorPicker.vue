<script setup lang="ts">
import type { FColorPickerProps } from '@/types';

const props = withDefaults(defineProps<FColorPickerProps>(), {
	showAlpha: false,
	predefine: () => [],
	size: 'default',
	disabled: false
})

const modelValue = defineModel<string>({ default: '#409eff' })

// ---------- 棰滆壊杞崲 ----------
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

// ---------- 鐘舵€?----------
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

// ---------- 闈㈡澘鏄鹃殣 ----------
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

// ---------- 拖动通用逻辑 ----------
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

// 面板和滑块的高度区域
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

// 色相轨道
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

// 透明度滑道
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

// ---------- 颜色输入 ----------
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

// ---------- 预定义颜色 ----------
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
<style lang="scss" scoped>
@use '../../styles/components/f-color-picker.scss';
</style>

