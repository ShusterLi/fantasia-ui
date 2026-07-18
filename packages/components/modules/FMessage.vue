<script setup lang="ts">
import type { FMessageProps } from '@/types';
import { CheckmarkCircle, Close, CloseCircle, InformationCircle, Warning } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FMessageProps>(), {
	type: 'info',
	duration: 3000,
	closable: false,
	showIcon: true,
	offset: 20
})

const emit = defineEmits<{
	(e: 'close'): void
	(e: 'destroy'): void
}>()

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const iconName = computed(() => {
	const map = {
		info: InformationCircle,
		success: CheckmarkCircle,
		warning: Warning,
		failed: CloseCircle
	} as const
	return map[props.type]
})

const rootStyle = computed(() => ({
	top: `${props.offset}px`
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

const handleAfterLeave = () => emit('destroy');

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
	<Transition name="f-message-fade" @after-leave="handleAfterLeave">
		<div v-if="visible" class="f-message" :class="[`f-message--${type}`]" :style="rootStyle" role="alert"
			@mouseenter="clearTimer" @mouseleave="startTimer">
			<f-icon v-if="showIcon" class="f-message__icon">
				<component :is="iconName" />
			</f-icon>
			<span class="f-message__content">{{ message }}</span>
			<button v-if="closable" type="button" class="f-message__close" aria-label="close" @click="close">
				<f-icon>
					<Close />
				</f-icon>
			</button>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.f-message {
	--f-bg: #1f1f1f;
	--f-border: rgba(255, 255, 255, 0.08);
	--f-text: #e8e4f0;
	--f-text-muted: #7c7a8a;
	--f-shadow: rgba(0, 0, 0, 0.35);

	--f-info: #60a5fa;
	--f-success: #34d399;
	--f-warning: #fb923c;
	--f-failed: #f87171;

	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	display: inline-flex;
	align-items: center;
	gap: 8px;
	max-width: min(480px, calc(100vw - 32px));
	padding: 10px 16px;
	border-radius: 4px;
	font-size: 14px;
	line-height: 1.5;
	color: var(--f-text);
	background: var(--f-bg);
	border: 1px solid var(--f-border);
	box-shadow: 0 2px 6px var(--f-shadow);
	z-index: 3000;
	pointer-events: auto;
	transition: top 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);

	&__icon {
		flex-shrink: 0;
		font-size: 16px;
	}

	&__content {
		flex: 1;
		word-break: break-word;
	}

	&__close {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--f-text-muted);
		cursor: pointer;
		transition: color 0.2s ease;

		&:hover {
			color: var(--f-text);
		}
	}

	&--info .f-message__icon {
		color: var(--f-info);
	}

	&--success .f-message__icon {
		color: var(--f-success);
	}

	&--warning .f-message__icon {
		color: var(--f-warning);
	}

	&--failed .f-message__icon {
		color: var(--f-failed);
	}
}

:root.light .f-message {
	--f-bg: #ffffff;
	--f-border: rgba(0, 0, 0, 0.08);
	--f-text: #1e293b;
	--f-text-muted: #94a3b8;
	--f-shadow: rgba(0, 0, 0, 0.12);

	--f-info: #2563eb;
	--f-success: #059669;
	--f-warning: #ea580c;
	--f-failed: #dc2626;
}

.f-message-fade-enter-active {
	transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.f-message-fade-leave-active {
	transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.f-message-fade-enter-from,
.f-message-fade-leave-to {
	opacity: 0;
	transform: translate(-50%, -12px);
}
</style>
