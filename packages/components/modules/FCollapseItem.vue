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

// height:auto 无法直接过渡，展开/收起时用 JS 动态设置像素高度
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

<style lang="scss">
:root {
	--f-collapse-item-header-bg: #1a1a1e;
	--f-collapse-item-header-color: #e4e4e7;
	--f-collapse-item-header-hover-bg: #232328;
	--f-collapse-item-content-bg: #18181b;
	--f-collapse-item-content-color: #a1a1aa;
	--f-collapse-item-border-color: #333338;
	--f-collapse-item-transition-duration: 0.25s;
}

:root.light {
	--f-collapse-item-header-bg: #fafafa;
	--f-collapse-item-header-color: #18181b;
	--f-collapse-item-header-hover-bg: #f0f0f2;
	--f-collapse-item-content-bg: #ffffff;
	--f-collapse-item-content-color: #52525b;
	--f-collapse-item-border-color: #e4e4e7;
}

.f-collapse-item {
	border-bottom: 1px solid var(--f-collapse-item-border-color);

	&:last-child {
		border-bottom: none;
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		background: var(--f-collapse-item-header-bg);
		color: var(--f-collapse-item-header-color);
		cursor: pointer;
		user-select: none;
		transition: background var(--f-collapse-item-transition-duration);

		&:hover {
			background: var(--f-collapse-item-header-hover-bg);
		}

		&-title {
			font-size: 14px;
			font-weight: 500;
		}
	}

	&__icon {
		flex-shrink: 0;
		color: var(--f-collapse-item-content-color);
		transition: transform var(--f-collapse-item-transition-duration);
	}

	&--active &__icon {
		transform: rotate(180deg);
	}

	&--disabled {
		.f-collapse-item__header {
			cursor: not-allowed;
			opacity: 0.5;

			&:hover {
				background: var(--f-collapse-item-header-bg);
			}
		}
	}

	&__wrapper {
		overflow: hidden;
		transition: height var(--f-collapse-item-transition-duration) ease;
	}

	&__content {
		padding: 12px 16px;
		background: var(--f-collapse-item-content-bg);
		color: var(--f-collapse-item-content-color);
		font-size: 13px;
		line-height: 1.6;
	}
}
</style>
