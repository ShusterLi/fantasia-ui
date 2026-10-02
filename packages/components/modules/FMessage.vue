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
		failed: CloseCircle,
		default: InformationCircle,
		primary: InformationCircle
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
<style lang="scss" scoped>
@use '../../styles/components/f-message.scss';
</style>

