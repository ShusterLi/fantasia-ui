<script setup lang="ts">
import type { FButtonGroupProps } from '@/types';

const props = withDefaults(defineProps<FButtonGroupProps>(), {
	size: 'normal',
	type: 'default',
	vertical: false
})

provide('FButtonGroupContext', reactive({
	...toRefs(props)
}));
</script>

<template>
	<div class="f-button-group" :class="{ 'f-button-group--vertical': vertical }" role="group">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.f-button-group {
	display: inline-flex;
	vertical-align: middle;

	&:last-child {
		margin-right: 0;
	}

	&> :deep(*) {
		position: relative;
		display: inline-flex;

		.f-button {
			border-radius: 0;
		}

		// 2. 边框合并：除了组内第一个元素，其余全部左移 1px
		&:not(:first-child) {
			margin-left: -1px;
		}

		// 3. 针对当前组的第一个子项：设置左圆角
		&:first-child {
			.f-button {
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
			}
		}

		// 4. 针对当前组的最后一个子项：设置右圆角
		&:last-child {
			.f-button {
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
			}
		}

		// 5. 悬浮状态提升层级，确保 1px 边框完整
		&:hover {
			z-index: 1;
		}

		// 激活状态（如黑边）层级最高
		.is-active {
			z-index: 2;
		}
	}

	// 垂直排列模式
	&--vertical {
		flex-direction: column;
		margin-right: 0;
		margin-bottom: 12px;

		&> :deep(*) {
			&:not(:first-child) {
				margin-left: 0;
				margin-top: -1px;
			}

			&:first-child .f-button {
				border-radius: 4px 4px 0 0;
			}

			&:last-child .f-button {
				border-radius: 0 0 4px 4px;
			}
		}
	}
}
</style>