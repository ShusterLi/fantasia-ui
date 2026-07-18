<script setup lang="ts">
import type { FScrollbarProps } from '@/types';

const props = withDefaults(defineProps<FScrollbarProps>(), {
	height: '',
	maxHeight: '',
	native: false,
	always: false,
	minSize: 20,
	vertical: true,
	horizontal: true
})

const emit = defineEmits<{
	scroll: [{ scrollTop: number; scrollLeft: number }]
}>()

const wrapRef = ref<HTMLElement | null>(null)
const resizeRef = ref<HTMLElement | null>(null)
const thumbYRef = ref<HTMLElement | null>(null)
const thumbXRef = ref<HTMLElement | null>(null)

// 滑块相对轨道的高度/宽度占比（0~1）
const ratioY = ref(1)
const ratioX = ref(1)
// 滑块的位移百分比（0~100）
const moveY = ref(0)
const moveX = ref(0)

const isDragging = ref(false)
const showBar = ref(false)

let wrapResizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null

const wrapStyle = computed(() => ({
	height: props.height || undefined,
	maxHeight: props.maxHeight || undefined
}))

function update() {
	const wrap = wrapRef.value
	if (!wrap) return

	const { clientHeight, scrollHeight, clientWidth, scrollWidth, scrollTop, scrollLeft } = wrap

	ratioY.value = scrollHeight > 0 ? Math.min(clientHeight / scrollHeight, 1) : 1
	ratioX.value = scrollWidth > 0 ? Math.min(clientWidth / scrollWidth, 1) : 1

	const maxScrollTop = scrollHeight - clientHeight
	const maxScrollLeft = scrollWidth - clientWidth

	moveY.value = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * (1 - ratioY.value) * 100 : 0
	moveX.value = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * (1 - ratioX.value) * 100 : 0
}

function handleScroll() {
	update()
	if (!isDragging.value) {
		flashBar()
	}
	const wrap = wrapRef.value
	if (wrap) {
		emit('scroll', { scrollTop: wrap.scrollTop, scrollLeft: wrap.scrollLeft })
	}
}

let flashTimer: ReturnType<typeof setTimeout> | null = null
function flashBar() {
	showBar.value = true
	if (flashTimer) clearTimeout(flashTimer)
	flashTimer = setTimeout(() => {
		if (!isDragging.value) showBar.value = false
	}, 800)
}

function startDrag(axis: 'x' | 'y', e: MouseEvent) {
	e.preventDefault()
	e.stopPropagation()
	const wrap = wrapRef.value
	if (!wrap) return

	isDragging.value = true
	showBar.value = true

	const startClientPos = axis === 'y' ? e.clientY : e.clientX
	const startScroll = axis === 'y' ? wrap.scrollTop : wrap.scrollLeft
	const trackSize = axis === 'y' ? wrap.clientHeight : wrap.clientWidth
	const scrollSize = axis === 'y' ? wrap.scrollHeight : wrap.scrollWidth
	const ratio = axis === 'y' ? ratioY.value : ratioX.value

	function onMouseMove(moveEvent: MouseEvent) {
		const currentClientPos = axis === 'y' ? moveEvent.clientY : moveEvent.clientX
		const delta = currentClientPos - startClientPos
		// 滑块每移动 1px，内容需要按 (1 / ratio) 的比例滚动
		const scrollDelta = ratio > 0 ? delta / ratio : 0
		const maxScroll = scrollSize - trackSize
		const nextScroll = Math.min(Math.max(startScroll + scrollDelta, 0), maxScroll)

		if (axis === 'y') {
			wrap!.scrollTop = nextScroll
		} else {
			wrap!.scrollLeft = nextScroll
		}
	}

	function onMouseUp() {
		isDragging.value = false
		flashBar()
		document.removeEventListener('mousemove', onMouseMove)
		document.removeEventListener('mouseup', onMouseUp)
	}

	document.addEventListener('mousemove', onMouseMove)
	document.addEventListener('mouseup', onMouseUp)
}

function scrollTo(options: ScrollToOptions | number, yCoord?: number) {
	const wrap = wrapRef.value
	if (!wrap) return
	if (typeof options === 'number') {
		wrap.scrollTo(options, yCoord ?? wrap.scrollTop)
	} else {
		wrap.scrollTo(options)
	}
}

function setScrollTop(value: number) {
	if (wrapRef.value) wrapRef.value.scrollTop = value
}

function setScrollLeft(value: number) {
	if (wrapRef.value) wrapRef.value.scrollLeft = value
}

defineExpose({
	scrollTo,
	setScrollTop,
	setScrollLeft,
	update,
	wrapRef
})

onMounted(() => {
	if (props.native) return

	nextTick(() => {
		update()
		if (wrapRef.value) {
			wrapResizeObserver = new ResizeObserver(() => update())
			wrapResizeObserver.observe(wrapRef.value)
		}
		if (resizeRef.value) {
			contentResizeObserver = new ResizeObserver(() => update())
			contentResizeObserver.observe(resizeRef.value)
		}
	})
})

onBeforeUnmount(() => {
	wrapResizeObserver?.disconnect()
	contentResizeObserver?.disconnect()
	if (flashTimer) clearTimeout(flashTimer)
})

watch(
	() => [props.height, props.maxHeight],
	() => nextTick(update)
)
</script>

<template>
	<div class="f-scrollbar" :class="{ 'f-scrollbar--native': native }" @mouseenter="!native && flashBar()">
		<div ref="wrapRef" class="f-scrollbar__wrap" :class="{ 'f-scrollbar__wrap--hidden-bar': !native }"
			:style="wrapStyle" @scroll="handleScroll">
			<div ref="resizeRef" class="f-scrollbar__view">
				<slot />
			</div>
		</div>

		<template v-if="!native">
			<div v-if="vertical && ratioY < 1" class="f-scrollbar__bar f-scrollbar__bar--vertical"
				:class="{ 'f-scrollbar__bar--visible': always || showBar || isDragging }">
				<div ref="thumbYRef" class="f-scrollbar__thumb" :style="{ height: `${ratioY * 100}%`, top: `${moveY}%` }"
					@mousedown="startDrag('y', $event)" />
			</div>
			<div v-if="horizontal && ratioX < 1" class="f-scrollbar__bar f-scrollbar__bar--horizontal"
				:class="{ 'f-scrollbar__bar--visible': always || showBar || isDragging }">
				<div ref="thumbXRef" class="f-scrollbar__thumb" :style="{ width: `${ratioX * 100}%`, left: `${moveX}%` }"
					@mousedown="startDrag('x', $event)" />
			</div>
		</template>
	</div>
</template>

<style lang="scss">
:root {
	--f-scrollbar-thumb-bg: rgba(255, 255, 255, 0.25);
	--f-scrollbar-thumb-hover-bg: rgba(255, 255, 255, 0.4);
	--f-scrollbar-size: 8px;
	--f-scrollbar-transition-duration: 0.2s;
}

:root.light {
	--f-scrollbar-thumb-bg: rgba(0, 0, 0, 0.2);
	--f-scrollbar-thumb-hover-bg: rgba(0, 0, 0, 0.35);
}

.f-scrollbar {
	position: relative;
	overflow: hidden;
	height: 100%;

	&__wrap {
		height: 100%;
		overflow: auto;

		&--hidden-bar {
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	&__view {
		display: inline-block;
		min-width: 100%;
	}

	&__bar {
		// 自身 position: absolute 同时也作为内部 &__thumb 的定位参照
		position: absolute;
		z-index: 1;
		opacity: 0;
		transition: opacity var(--f-scrollbar-transition-duration);
		pointer-events: none;

		&--visible {
			opacity: 1;
			pointer-events: auto;
		}

		&--vertical {
			top: 2px;
			right: 2px;
			bottom: 2px;
			width: var(--f-scrollbar-size);
		}

		&--horizontal {
			left: 2px;
			right: 2px;
			bottom: 2px;
			height: var(--f-scrollbar-size);
		}
	}

	&__thumb {
		position: absolute;
		border-radius: calc(var(--f-scrollbar-size) / 2);
		background: var(--f-scrollbar-thumb-bg);
		cursor: pointer;
		transition: background var(--f-scrollbar-transition-duration);

		.f-scrollbar__bar--vertical & {
			width: 100%;
		}

		.f-scrollbar__bar--horizontal & {
			height: 100%;
		}

		&:hover {
			background: var(--f-scrollbar-thumb-hover-bg);
		}
	}

	&--native {
		overflow: auto;
	}
}
</style>
