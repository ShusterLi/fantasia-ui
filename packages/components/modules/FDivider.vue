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

	if (!hasContent.value) {
		return {
			borderTop: `1px ${props.line} ${props.color}`,
			margin: '24px 0',
		};
	}

	return {};
});

const lineStyle = computed<CSSProperties>(() => ({
	borderTop: `1px ${props.line} ${props.color}`,
}));
</script>

<template>
	<!-- 垂直分割线 -->
	<div v-if="!isHorizontal" class="f-divider f-divider--vertical" :style="dividerStyle" />

	<!-- 横向分割线，无内容 -->
	<div 
		v-else-if="!hasContent" 
		class="f-divider f-divider--horizontal" 
		:style="dividerStyle" 
	/>

	<!-- 横向分割线，有内容 -->
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
@use '../../styles/components/f-divider.scss';
</style>

