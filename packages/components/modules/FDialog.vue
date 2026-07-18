<script lang="ts" setup>
import type { FDialogProps } from '@/types';

const props = withDefaults(defineProps<FDialogProps>(), {
	maskClosable: true,
	maskColor: 'black',
	showMask: true
});

const visible = defineModel<boolean>({ default: false });

const handleMaskClick = () => {
	if (props.maskClosable) visible.value = false;
};

// 遮罩颜色映射
const maskBackgroundColor = computed(() => {
	if (!props.showMask) return 'transparent';

	switch (props.maskColor) {
		case 'white':
			return 'rgba(255, 255, 255, 0.5)';
		case 'black':
			return 'rgba(0, 0, 0, 0.5)';
		case 'transparent':
			return 'transparent';
		default:
			return 'rgba(0, 0, 0, 0.5)';
	}
});
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div v-if="visible" class="f-dialog-mask" :style="{ backgroundColor: maskBackgroundColor }"
				@click="handleMaskClick">
				<div class="f-dialog-container" @click.stop>
					<slot></slot>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss" scoped>
.f-dialog-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
