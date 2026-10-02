<script setup lang="ts">
import type { FDrawerProps, FDrawerEmits } from '@/types/components';
import FIcon from './FIcon.vue';
import { CloseOutline } from '@vicons/ionicons5';

const props = withDefaults(defineProps<FDrawerProps>(), {
	placement: 'right',
	size: '30%',
	showClose: true,
	lockScroll: true,
	closeOnClickOutside: true,
});

const emit = defineEmits<FDrawerEmits>();

const visible = defineModel<boolean>({ required: true });

const handleClose = () => {
	visible.value = false;
	emit('close');
};

const handleBackdropClick = () => {
	if (props.closeOnClickOutside) {
		handleClose();
	}
};

// 控制 body 滚动
watch(() => visible.value, (isOpen) => {
	if (props.lockScroll && typeof document !== 'undefined') {
		document.body.style.overflow = isOpen ? 'hidden' : '';
	}
});

onBeforeUnmount(() => {
	if (props.lockScroll && typeof document !== 'undefined') {
		document.body.style.overflow = '';
	}
});
</script>

<template>
	<Teleport to="body">
		<Transition name="drawer-fade">
			<div v-if="visible" class="f-drawer-backdrop" @click="handleBackdropClick" />
		</Transition>
		
		<Transition :name="`drawer-${placement}`">
			<div 
				v-if="visible" 
				class="f-drawer" 
				:class="`f-drawer--${placement}`"
				:style="{ 
					[placement === 'left' || placement === 'right' ? 'width' : 'height']: size 
				}"
			>
				<div v-if="title || showClose || $slots.header" class="f-drawer__header">
					<slot name="header">
						<h3 class="f-drawer__title">{{ title }}</h3>
					</slot>
					<button 
						v-if="showClose" 
						type="button" 
						class="f-drawer__close" 
						@click="handleClose"
						aria-label="关闭"
					>
						<f-icon :size="24">
							<CloseOutline />
						</f-icon>
					</button>
				</div>

				<div class="f-drawer__body">
					<slot />
				</div>

				<div v-if="$slots.footer" class="f-drawer__footer">
					<slot name="footer" />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-drawer.scss';
</style>

