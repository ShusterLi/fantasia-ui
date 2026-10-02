<script setup lang="ts">
import type { FStepsProps } from '@/types';

const props = withDefaults(defineProps<FStepsProps>(), {
	current: 0,
	direction: 'horizontal',
	statusText: true,
});

const resolvedStatus = (index: number, itemStatus?: string) => {
	if (itemStatus) return itemStatus;
	if (index < props.current) return 'finish';
	if (index === props.current) return 'process';
	return 'wait';
};
</script>

<template>
	<div class="f-steps" :class="[`is-${direction}`]">
		<div v-for="(item, index) in items" :key="`${index}-step`" class="f-step" :class="[`is-${resolvedStatus(index, item.status)}`]">
			<div class="f-step__icon">{{ index + 1 }}</div>
			<div class="f-step__content">
				<div class="f-step__title">{{ item.title || `Step ${index + 1}` }}</div>
				<div v-if="item.description || statusText" class="f-step__description">{{ item.description || 'Processing' }}</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-steps.scss';
</style>

