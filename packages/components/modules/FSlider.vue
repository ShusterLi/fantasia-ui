<script setup lang="ts">
import type { FSliderProps } from '@/types';

const props = withDefaults(defineProps<FSliderProps>(), {
	min: 0,
	max: 100,
	step: 1,
	range: false,
	vertical: false,
	disabled: false,
	showTooltip: true,
	marks: () => ({}),
	size: 'default'
})

const modelValue = defineModel<number | [number, number]>({ default: 0 })

// values[0] 表示当前值；范围模式下为 [起点, 终点]
const values = reactive<number[]>(props.range ? [props.min, props.max] : [props.min])

let skipNextWatch = false

watch(
	modelValue,
	(val) => {
		if (skipNextWatch) {
			skipNextWatch = false
			return
		}
		if (props.range && Array.isArray(val)) {
			values[0] = val[0]
			values[1] = val[1]
		} else if (!props.range && typeof val === 'number') {
			values[0] = val
		}
	},
	{ immediate: true }
)

function emitChange() {
	skipNextWatch = true
	modelValue.value = props.range ? [values[0], values[1]] : values[0]
}

// ---------- 小数位数 ----------
const decimalPlaces = computed(() => {
	const str = String(props.step)
	const idx = str.indexOf('.')
	return idx === -1 ? 0 : str.length - idx - 1
})

function clampValue(raw: number) {
	const clamped = Math.min(Math.max(raw, props.min), props.max)
	const stepped = Math.round((clamped - props.min) / props.step) * props.step + props.min
	const fixed = Number(stepped.toFixed(decimalPlaces.value))
	return Math.min(Math.max(fixed, props.min), props.max)
}

function valueToPercent(v: number) {
	if (props.max === props.min) return 0
	return ((v - props.min) / (props.max - props.min)) * 100
}

function percentToValue(percent: number) {
	return clampValue(props.min + (percent / 100) * (props.max - props.min))
}

// ---------- 拖动 ----------
const trackRef = ref<HTMLElement | null>(null)
const activeThumb = ref<number | null>(null)
const hoveredThumb = ref<number | null>(null)

function percentFromEvent(clientX: number, clientY: number, rect: DOMRect) {
	if (props.vertical) {
		const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
		return 100 - (y / rect.height) * 100
	}
	const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
	return (x / rect.width) * 100
}

function startDrag(index: number, e: MouseEvent) {
	if (props.disabled) return
	e.preventDefault()
	e.stopPropagation()

	const track = trackRef.value
	if (!track) return
	const rect = track.getBoundingClientRect()

	activeThumb.value = index

	function apply(clientX: number, clientY: number) {
		const percent = percentFromEvent(clientX, clientY, rect)
		let next = percentToValue(percent)

		if (props.range) {
			if (index === 0) next = Math.min(next, values[1])
			else next = Math.max(next, values[0])
		}

		if (values[index] !== next) {
			values[index] = next
			emitChange()
		}
	}

	apply(e.clientX, e.clientY)

	function onMove(moveEvent: MouseEvent) {
		apply(moveEvent.clientX, moveEvent.clientY)
	}
	function onUp() {
		activeThumb.value = null
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onUp)
	}
	document.addEventListener('mousemove', onMove)
	document.addEventListener('mouseup', onUp)
}

function handleTrackClick(e: MouseEvent) {
	if (props.disabled || !trackRef.value) return
	// 点击在轨道本身上时触发 startDrag 处理，这里仅处理空白轨道
	if ((e.target as HTMLElement).closest('.f-slider__thumb')) return

	const rect = trackRef.value.getBoundingClientRect()
	const percent = percentFromEvent(e.clientX, e.clientY, rect)
	const clicked = percentToValue(percent)

	const targetIndex = props.range
		? Math.abs(clicked - values[0]) <= Math.abs(clicked - values[1])
			? 0
			: 1
		: 0

	values[targetIndex] = clicked
	emitChange()
}

// ---------- 键盘 ----------
function handleKeydown(index: number, e: KeyboardEvent) {
	if (props.disabled) return
	const dir = props.vertical
		? { inc: 'ArrowUp', dec: 'ArrowDown' }
		: { inc: 'ArrowRight', dec: 'ArrowLeft' }

	let next = values[index]
	if (e.key === dir.inc) next += props.step
	else if (e.key === dir.dec) next -= props.step
	else if (e.key === 'Home') next = props.min
	else if (e.key === 'End') next = props.max
	else return

	e.preventDefault()
	next = clampValue(next)
	if (props.range) {
		next = index === 0 ? Math.min(next, values[1]) : Math.max(next, values[0])
	}
	values[index] = next
	emitChange()
}

// ---------- 显示 ----------
const barStyle = computed(() => {
	if (props.range) {
		const start = valueToPercent(values[0])
		const end = valueToPercent(values[1])
		return props.vertical
			? { bottom: `${start}%`, height: `${end - start}%` }
			: { left: `${start}%`, width: `${end - start}%` }
	}
	const percent = valueToPercent(values[0])
	return props.vertical ? { bottom: '0%', height: `${percent}%` } : { left: '0%', width: `${percent}%` }
})

function thumbStyle(index: number) {
	const percent = valueToPercent(values[index])
	return props.vertical ? { bottom: `${percent}%` } : { left: `${percent}%` }
}

const markEntries = computed(() =>
	Object.entries(props.marks).map(([key, label]) => ({
		value: Number(key),
		label,
		percent: valueToPercent(Number(key))
	}))
)

function tooltipVisible(index: number) {
	return props.showTooltip && (activeThumb.value === index || hoveredThumb.value === index)
}
</script>

<template>
	<div class="f-slider"
		:class="[`f-slider--${size}`, { 'f-slider--vertical': vertical, 'f-slider--disabled': disabled, 'f-slider--with-marks': markEntries.length }]">
		<div ref="trackRef" class="f-slider__track" @mousedown="handleTrackClick">
			<div class="f-slider__bar" :style="barStyle" />

			<span v-for="mark in markEntries" :key="mark.value" class="f-slider__mark"
				:style="vertical ? { bottom: `${mark.percent}%` } : { left: `${mark.percent}%` }">
				<span class="f-slider__mark-dot" />
				<span class="f-slider__mark-label">{{ mark.label }}</span>
			</span>

			<div v-for="(value, index) in values" :key="index" class="f-slider__thumb"
				:class="{ 'f-slider__thumb--active': activeThumb === index }" :style="thumbStyle(index)" tabindex="0"
				role="slider" :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="value"
				@mousedown="startDrag(index, $event)" @keydown="handleKeydown(index, $event)" @mouseenter="hoveredThumb = index"
				@mouseleave="hoveredThumb = null">
				<Transition name="f-slider-tooltip-fade">
					<div v-if="tooltipVisible(index)" class="f-slider__tooltip">{{ value }}</div>
				</Transition>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-slider.scss';
</style>

