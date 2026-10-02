<script lang="ts" setup>
import type { FMaskProps } from '@/types';

const props = withDefaults(defineProps<FMaskProps>(), {
	maskClosable: true,
	maskColor: 'black',
	showMask: true
});

const visible = defineModel<boolean>({ default: false });

const handleMaskClick = () => {
	if (props.maskClosable) visible.value = false;
};

// 閬僵棰滆壊鏄犲皠
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
@use '../../styles/components/f-mask.scss';
</style>

