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
.f-steps {
	display: flex;
	gap: 16px;
	width: 100%;

	&.is-vertical {
		flex-direction: column;
		align-items: stretch;
	}

	&.is-horizontal {
		flex-direction: row;
		align-items: stretch;
	}
}

.f-step {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	flex: 1;
	position: relative;

	&:not(:last-child)::after {
		content: '';
		position: absolute;
		top: 18px;
		left: 18px;
		width: calc(100% - 18px);
		height: 2px;
		background: #e5e7eb;
		z-index: 0;
	}

	&.is-horizontal {
		flex-direction: row;
	}

	&.is-vertical {
		flex-direction: column;
		padding-bottom: 12px;
	}

	&__icon {
		position: relative;
		z-index: 1;
		width: 28px;
		height: 28px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 700;
		background: #e5e7eb;
		color: #64748b;
		border: 2px solid #fff;
		box-shadow: 0 0 0 1px #e5e7eb;
	}

	&.is-finish &__icon {
		background: #ec4899;
		color: #fff;
		box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.15);
	}

	&.is-process &__icon {
		background: #fdf2f8;
		color: #9d174d;
		border-color: #f9a8d4;
	}

	&.is-error &__icon {
		background: #ef4444;
		color: #fff;
	}

	&__content {
		min-width: 0;
		flex: 1;
		padding-top: 4px;
	}

	&__title {
		font-size: 14px;
		font-weight: 600;
		color: #1f2937;
	}

	&__description {
		margin-top: 4px;
		font-size: 12px;
		color: #64748b;
	}
}
</style>
