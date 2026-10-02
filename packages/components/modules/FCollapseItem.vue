<script setup lang="ts">
import type { FCollapseItemProps } from '@/types';

const props = withDefaults(defineProps<FCollapseItemProps>(), {
	title: '',
	disabled: false
})

interface FCollapseContext {
	activeNames: Array<string | number>
	handleItemClick: (name: string | number) => void
}

const context = inject<FCollapseContext>('fCollapseContext')

const isActive = computed(() => !!context?.activeNames.includes(props.name))

function handleHeaderClick() {
	if (props.disabled) return
	context?.handleItemClick(props.name)
}

// height: auto 不能直接过渡，需要通过 JS 计算高度后再做动画
function onEnter(el: Element) {
	const element = el as HTMLElement
	element.style.height = '0px'
	requestAnimationFrame(() => {
		element.style.height = `${element.scrollHeight}px`
	})
}

function onAfterEnter(el: Element) {
	; (el as HTMLElement).style.height = 'auto'
}

function onLeave(el: Element) {
	const element = el as HTMLElement
	element.style.height = `${element.scrollHeight}px`
	requestAnimationFrame(() => {
		element.style.height = '0px'
	})
}
</script>

<template>
	<div class="f-collapse-item" :class="{
		'f-collapse-item--active': isActive,
		'f-collapse-item--disabled': disabled
	}">
		<div class="f-collapse-item__header" @click="handleHeaderClick">
			<slot name="title">
				<span class="f-collapse-item__header-title">{{ title }}</span>
			</slot>
			<svg class="f-collapse-item__icon" viewBox="0 0 12 12" width="12" height="12">
				<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
					stroke-linejoin="round" />
			</svg>
		</div>
		<Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
			<div v-show="isActive" class="f-collapse-item__wrapper">
				<div class="f-collapse-item__content">
					<slot />
				</div>
			</div>
		</Transition>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-collapse-item.scss';
</style>

