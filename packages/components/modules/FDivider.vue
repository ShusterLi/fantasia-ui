<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { FDividerProps } from '@/types';

const props = withDefaults(defineProps<FDividerProps>(), {
	direction: 'horizontal',
	line: 'solid',
	contentPosition: 'center',
	color: '#dcdfe6',
});

const slots = defineSlots<{
	default?: () => any;
}>();

const hasContent = computed(() => !!slots.default);

const isHorizontal = computed(() => props.direction === 'horizontal');

const dividerStyle = computed<CSSProperties>(() => {
	if (!isHorizontal.value) {
		return {
			height: '100%',
			borderLeft: `1px ${props.line} ${props.color}`,
			margin: '0 12px',
		};
	}

	// 水平分割线
	if (!hasContent.value) {
		return {
			borderTop: `1px ${props.line} ${props.color}`,
			margin: '24px 0',
		};
	}

	// 有内容时返回空,由内部元素控制样式
	return {};
});

const lineStyle = computed<CSSProperties>(() => ({
	borderTop: `1px ${props.line} ${props.color}`,
}));
</script>

<template>
	<!-- 垂直分割线 -->
	<div v-if="!isHorizontal" class="f-divider f-divider--vertical" :style="dividerStyle" />

	<!-- 水平分割线(无内容) -->
	<div 
		v-else-if="!hasContent" 
		class="f-divider f-divider--horizontal" 
		:style="dividerStyle" 
	/>

	<!-- 水平分割线(有内容) -->
	<div 
		v-else 
		class="f-divider f-divider--horizontal f-divider--with-text" 
		:class="`f-divider--${contentPosition}`"
	>
		<div class="f-divider__line" :style="lineStyle" />
		<div class="f-divider__text">
			<slot />
		</div>
		<div class="f-divider__line" :style="lineStyle" />
	</div>
</template>

<style lang="scss" scoped>
.f-divider {
	position: relative;
	
	&--horizontal {
		display: block;
		width: 100%;
		height: 0;
		margin: 24px 0;

		&.f-divider--with-text {
			display: flex;
			align-items: center;
			margin: 24px 0;
			color: #909399;
			font-size: 14px;
		}
	}

	&--vertical {
		display: inline-block;
		width: 0;
		vertical-align: middle;
	}

	&__line {
		flex: 1;
		min-width: 10%;
	}

	&__text {
		padding: 0 16px;
		white-space: nowrap;
		font-weight: 500;
	}

	// 内容位置
	&--left {
		.f-divider__line:first-child {
			flex: 0;
			min-width: 5%;
		}
	}

	&--right {
		.f-divider__line:last-child {
			flex: 0;
			min-width: 5%;
		}
	}

	&--center {
		.f-divider__line {
			flex: 1;
		}
	}
}
</style>
