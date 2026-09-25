<script setup lang="ts">
import type { FDialogProps, FDialogEmits } from '@/types/components';
import FButton from './FButton.vue';
import FIcon from './FIcon.vue';
import {
	CheckmarkCircleOutline,
	AlertCircleOutline,
	InformationCircleOutline,
	WarningOutline,
} from '@vicons/ionicons5';
import '@/styles/components/f-dialog.scss';

const props = withDefaults(defineProps<FDialogProps>(), {
	title: '提示',
	type: 'info',
	content: '',
	confirmText: '确定',
	cancelText: '取消',
	showCancel: true,
	closeOnClickOutside: true,
	closeOnEsc: true,
});

const emit = defineEmits<FDialogEmits>();

const visible = defineModel<boolean>({ required: true });

const handleClose = () => {
	visible.value = false;
	emit('cancel');
};

const handleConfirm = () => {
	emit('confirm');
	visible.value = false;
};

const handleCancel = () => {
	handleClose();
};

const handleOverlayClick = (e: MouseEvent) => {
	if (props.closeOnClickOutside && e.target === e.currentTarget) {
		handleClose();
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (props.closeOnEsc && e.key === 'Escape') {
		handleClose();
	}
};

onMounted(() => {
	if (props.closeOnEsc) {
		window.addEventListener('keydown', handleKeydown);
	}
});

onBeforeUnmount(() => {
	if (props.closeOnEsc) {
		window.removeEventListener('keydown', handleKeydown);
	}
});

const iconMap = {
	info: InformationCircleOutline,
	success: CheckmarkCircleOutline,
	warning: WarningOutline,
	error: AlertCircleOutline,
	confirm: WarningOutline,
};
</script>

<template>
	<Teleport to="body">
		<Transition name="dialog-fade">
			<div v-if="visible" class="f-dialog-overlay" @click="handleOverlayClick">
				<Transition name="dialog">
					<div v-if="visible" class="f-dialog" :class="`f-dialog--${type}`">
						<!-- 头部 -->
						<div v-if="$slots.header || title" class="f-dialog__header">
							<slot name="header">
								<div class="f-dialog__icon">
									<f-icon>
										<component :is="iconMap[type]" />
									</f-icon>
								</div>
								<h3 class="f-dialog__title">{{ title }}</h3>
							</slot>
						</div>

						<!-- 内容 -->
						<div class="f-dialog__body">
							<slot>
								<p v-if="content">{{ content }}</p>
							</slot>
						</div>

						<!-- 底部 -->
						<div class="f-dialog__footer">
							<slot name="footer">
								<f-button v-if="showCancel" @click="handleCancel">
									{{ cancelText }}
								</f-button>
								<f-button type="primary" @click="handleConfirm">
									{{ confirmText }}
								</f-button>
							</slot>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

