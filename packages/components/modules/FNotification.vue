<script setup lang="ts">
import type { FNotificationProps } from '@/types';
import { CheckmarkCircle, Close, CloseCircle, InformationCircle, Warning } from '@vicons/ionicons5';
import { FIcon } from 'fantasia-ui'

const props = withDefaults(defineProps<FNotificationProps>(), {
	type: 'info',
	duration: 4500,
	closable: true,
	showIcon: true,
	position: 'top-right',
	offset: 20
})

const emit = defineEmits<{
	(e: 'close'): void
	(e: 'destroy'): void
	(e: 'click'): void
}>()

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const iconName = computed(() => {
	const map = {
		info: InformationCircle,
		success: CheckmarkCircle,
		warning: Warning,
		error: CloseCircle
	} as const
	return map[props.type]
})

const isTop = computed(() => props.position.startsWith('top'))
const isRight = computed(() => props.position.endsWith('right'))

const rootStyle = computed(() => ({
	[isTop.value ? 'top' : 'bottom']: `${props.offset}px`,
	[isRight.value ? 'right' : 'left']: '20px'
}))

const startTimer = () => {
	if (props.duration <= 0) return
	timer = setTimeout(() => {
		close()
	}, props.duration)
}

const clearTimer = () => {
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
}

const close = () => {
	clearTimer()
	visible.value = false
	emit('close')
}

const handleAfterLeave = () => emit('destroy')

const handleClick = () => emit('click')

onMounted(() => {
	visible.value = true
	startTimer()
})

onBeforeUnmount(() => {
	clearTimer()
})

defineExpose({ close })
</script>

<template>
	<Transition :name="`f-notification-${position}`" @after-leave="handleAfterLeave">
		<div v-if="visible" class="f-notification" :class="[`f-notification--${type}`]" :style="rootStyle" role="alert"
			@mouseenter="clearTimer" @mouseleave="startTimer" @click="handleClick">
			<f-icon v-if="showIcon" class="f-notification__icon">
				<component :is="iconName" />
			</f-icon>
			<div class="f-notification__body">
				<p v-if="title" class="f-notification__title">{{ title }}</p>
				<p class="f-notification__content">{{ message }}</p>
			</div>
			<button v-if="closable" type="button" class="f-notification__close" aria-label="close" @click.stop="close">
				<f-icon>
					<Close />
				</f-icon>
			</button>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.f-notification {
	--f-bg: #000000;
	--f-border: rgba(255, 255, 255, 0.08);
	--f-text: #e8e4f0;
	--f-text-muted: #7c7a8a;
	--f-shadow: rgba(0, 0, 0, 0.35);

	--f-info: #60a5fa;
	--f-success: #34d399;
	--f-warning: #fb923c;
	--f-error: #f87171;

	position: fixed;
	display: flex;
	align-items: flex-start;
	gap: 12px;
	width: 340px;
	max-width: calc(100vw - 32px);
	padding: 16px;
	border-radius: 4px;
	color: var(--f-text);
	background: var(--f-bg);
	border: 1px solid var(--f-border);
	box-shadow: 0 3px 8px var(--f-shadow);
	z-index: 3000;
	pointer-events: auto;
	cursor: default;
	transition: top 0.3s cubic-bezier(0.34, 0.69, 0.1, 1), bottom 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);

	&__icon {
		flex-shrink: 0;
		margin-top: 1px;
		font-size: 18px;
	}

	&__body {
		flex: 1;
		min-width: 0;
	}

	&__title {
		margin: 0 0 4px;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--f-text);
	}

	&__content {
		margin: 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--f-text-muted);
		word-break: break-word;
	}

	&__close {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: -2px -4px 0 0;
		padding: 2px;
		border: none;
		background: transparent;
		color: var(--f-text-muted);
		cursor: pointer;
		transition: color 0.2s ease;

		&:hover {
			color: var(--f-text);
		}
	}

	&--info .f-notification__icon {
		color: var(--f-info);
	}

	&--success .f-notification__icon {
		color: var(--f-success);
	}

	&--warning .f-notification__icon {
		color: var(--f-warning);
	}

	&--error .f-notification__icon {
		color: var(--f-error);
	}
}

:root.light .f-notification {
	--f-bg: #ffffff;
	--f-border: rgba(0, 0, 0, 0.08);
	--f-text: #1e293b;
	--f-text-muted: #64748b;
	--f-shadow: rgba(0, 0, 0, 0.12);

	--f-info: #2563eb;
	--f-success: #059669;
	--f-warning: #ea580c;
	--f-error: #dc2626;
}

@mixin notification-transition($fromTransform) {
	&-enter-active {
		transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	&-leave-active {
		transition: opacity 0.2s ease-in, transform 0.2s ease-in;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
		transform: $fromTransform;
	}
}

.f-notification-top-right {
	@include notification-transition(translateX(24px));
}

.f-notification-bottom-right {
	@include notification-transition(translateX(24px));
}

.f-notification-top-left {
	@include notification-transition(translateX(-24px));
}

.f-notification-bottom-left {
	@include notification-transition(translateX(-24px));
}
</style>
