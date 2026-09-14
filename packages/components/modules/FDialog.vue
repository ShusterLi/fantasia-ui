<script setup lang="ts">
import { FButton, FIcon } from 'fantasia-ui';
import {
	CloseOutline,
	CheckmarkCircleOutline,
	AlertCircleOutline,
	InformationCircleOutline,
	WarningOutline,
} from '@vicons/ionicons5';
import type { FDialogProps, FDialogEmits } from '@/types/components';

const props = withDefaults(defineProps<FDialogProps>(), {
	title: '提示',
	width: '500px',
	type: 'default',
	confirmText: '确定',
	cancelText: '取消',
	showCancel: true,
	closeOnClickModal: true,
	closeOnEsc: true,
	showClose: true,
	center: false,
	fullscreen: false,
	destroyOnClose: false,
});

const emit = defineEmits<FDialogEmits>();

const visible = defineModel<boolean>({ required: true });

const handleClose = () => {
	visible.value = false;
	emit('close');
};

const handleConfirm = () => {
	emit('confirm');
	if (props.beforeClose) {
		props.beforeClose(() => {
			visible.value = false;
		});
	} else {
		visible.value = false;
	}
};

const handleCancel = () => {
	emit('cancel');
	handleClose();
};

const handleOverlayClick = (e: MouseEvent) => {
	if (props.closeOnClickModal && e.target === e.currentTarget) {
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
	emit('open');
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
	failed: AlertCircleOutline,
	primary: InformationCircleOutline,
	default: InformationCircleOutline,
};

const hasIcon = computed(() => props.type && props.type !== 'default');
</script>
</script>

<template>
	<Teleport to="body">
		<Transition name="f-dialog-fade">
			<div v-if="visible" class="f-dialog-overlay" @click="handleOverlayClick">
				<Transition name="f-dialog-zoom">
					<div 
						v-if="visible" 
						class="f-dialog" 
						:class="[
							`f-dialog--${type}`,
							{
								'is-center': center,
								'is-fullscreen': fullscreen
							}
						]"
						:style="{ width: fullscreen ? '100%' : width }"
					>
						<!-- 关闭按钮 -->
						<button 
							v-if="showClose" 
							type="button" 
							class="f-dialog__close" 
							@click="handleClose"
						>
							<f-icon>
								<CloseOutline />
							</f-icon>
						</button>

						<!-- 头部 -->
						<div v-if="$slots.header || title" class="f-dialog__header" :class="{ 'has-icon': hasIcon }">
							<slot name="header">
								<div v-if="hasIcon" class="f-dialog__icon">
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
						<div v-if="$slots.footer || showCancel" class="f-dialog__footer">
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

<style scoped lang="scss">
.f-dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	padding: 20px;
}

.f-dialog {
	position: relative;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	&.is-fullscreen {
		width: 100% !important;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		border-radius: 0;
	}

	&__close {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: #909399;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
		z-index: 1;

		:deep(svg) {
			width: 18px;
			height: 18px;
		}

		&:hover {
			background: #f5f7fa;
			color: #606266;
		}
	}

	&__header {
		padding: 20px 20px 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		border-bottom: 1px solid #e4e7ed;

		&.has-icon {
			padding-top: 24px;
		}
	}

	&__icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;

		:deep(svg) {
			width: 24px;
			height: 24px;
		}
	}

	&__title {
		flex: 1;
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: #303133;
		line-height: 1.4;
	}

	&__body {
		flex: 1;
		padding: 20px;
		color: #606266;
		font-size: 14px;
		line-height: 1.6;
		overflow-y: auto;

		p {
			margin: 0;
		}
	}

	&__footer {
		padding: 16px 20px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		border-top: 1px solid #e4e7ed;
	}

	&.is-center {
		.f-dialog__header {
			flex-direction: column;
			text-align: center;
		}

		.f-dialog__body {
			text-align: center;
		}

		.f-dialog__footer {
			justify-content: center;
		}
	}

	// 类型样式
	&--info {
		.f-dialog__icon {
			background: #ecf5ff;
			color: #409eff;
		}
	}

	&--success {
		.f-dialog__icon {
			background: #f0f9ff;
			color: #67c23a;
		}
	}

	&--warning {
		.f-dialog__icon {
			background: #fef0e6;
			color: #e6a23c;
		}
	}

	&--failed {
		.f-dialog__icon {
			background: #fef0f0;
			color: #f56c6c;
		}
	}

	&--primary {
		.f-dialog__icon {
			background: #ecf5ff;
			color: #409eff;
		}
	}
}

// 动画
.f-dialog-fade-enter-active,
.f-dialog-fade-leave-active {
	transition: opacity 0.3s;
}

.f-dialog-fade-enter-from,
.f-dialog-fade-leave-to {
	opacity: 0;
}

.f-dialog-zoom-enter-active {
	animation: f-dialog-zoom-in 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.f-dialog-zoom-leave-active {
	animation: f-dialog-zoom-out 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes f-dialog-zoom-in {
	0% {
		opacity: 0;
		transform: scale(0.7);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes f-dialog-zoom-out {
	0% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0.7);
	}
}
</style>