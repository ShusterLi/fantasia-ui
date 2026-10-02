<script setup lang="ts">
import type { FNotificationProps } from '@/types';
import { CheckmarkCircle, Close, CloseCircle, InformationCircle, Warning } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

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
		failed: CloseCircle,
		default: InformationCircle,
		primary: InformationCircle
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
<style lang="scss" scoped>
@use '../../styles/components/f-notification.scss';
</style>

