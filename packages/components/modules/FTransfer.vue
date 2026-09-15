<script setup lang="ts">
import type { FTransferItem, FTransferProps } from '@/types';

const props = withDefaults(defineProps<FTransferProps>(), {
	leftTitle: '可选项',
	rightTitle: '已选项',
	disabled: false,
});

const modelValue = defineModel<Array<string | number>>({ default: () => [] });
const leftSelected = ref<Array<string | number>>([]);
const rightSelected = ref<Array<string | number>>([]);

const selectedSet = computed(() => new Set(modelValue.value));
const leftList = computed(() =>
	props.data.filter((item) => !selectedSet.value.has(item.key) && !item.disabled),
);
const rightList = computed(() =>
	props.data.filter((item) => selectedSet.value.has(item.key)),
);

const toggle = (list: Array<string | number>, key: string | number) => {
	const index = list.indexOf(key);
	if (index >= 0) {
		list.splice(index, 1);
	} else {
		list.push(key);
	}
};

const moveToRight = () => {
	if (props.disabled) return;
	const keys = leftList.value.map((item) => item.key);
	const next = Array.from(new Set([...modelValue.value, ...keys]));
	modelValue.value = next;
	leftSelected.value = [];
};

const moveToLeft = () => {
	if (props.disabled) return;
	const next = modelValue.value.filter((key) => !rightSelected.value.includes(key));
	modelValue.value = next;
	rightSelected.value = [];
};

const moveSelected = (direction: 'left' | 'right') => {
	if (direction === 'right') {
		moveToRight();
		return;
	}
	moveToLeft();
};
</script>

<template>
	<div class="f-transfer" :class="{ 'is-disabled': disabled }">
		<div class="f-transfer__panel">
			<div class="f-transfer__header">{{ leftTitle }}</div>
			<ul class="f-transfer__list">
				<li
					v-for="item in leftList"
					:key="String(item.key)"
					class="f-transfer__item"
					:class="{ 'is-selected': leftSelected.includes(item.key), 'is-disabled': item.disabled }"
					@click="toggle(leftSelected, item.key)"
				>
					{{ item.label }}
				</li>
			</ul>
		</div>

		<div class="f-transfer__actions">
			<button type="button" class="f-transfer__btn" :disabled="disabled || leftList.length === 0" @click="moveSelected('right')">
				→
			</button>
			<button type="button" class="f-transfer__btn" :disabled="disabled || rightList.length === 0" @click="moveSelected('left')">
				←
			</button>
		</div>

		<div class="f-transfer__panel">
			<div class="f-transfer__header">{{ rightTitle }}</div>
			<ul class="f-transfer__list">
				<li
					v-for="item in rightList"
					:key="String(item.key)"
					class="f-transfer__item"
					:class="{ 'is-selected': rightSelected.includes(item.key), 'is-disabled': item.disabled }"
					@click="toggle(rightSelected, item.key)"
				>
					{{ item.label }}
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.f-transfer {
	display: flex;
	align-items: stretch;
	gap: 16px;
	width: 100%;

	&.is-disabled {
		opacity: 0.7;
	}

	&__panel {
		flex: 1;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		overflow: hidden;
	}

	&__header {
		padding: 10px 12px;
		font-size: 13px;
		font-weight: 600;
		color: #374151;
		background: #f8fafc;
		border-bottom: 1px solid #e5e7eb;
	}

	&__list {
		list-style: none;
		padding: 8px;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-height: 180px;
	}

	&__item {
		padding: 8px 10px;
		border-radius: 6px;
		font-size: 14px;
		color: #334155;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background: #fdf2f8;
		}

		&.is-selected {
			background: #fdf2f8;
			color: #9d174d;
			font-weight: 500;
		}
	}

	&__actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
		padding-top: 32px;
	}

	&__btn {
		width: 38px;
		height: 32px;
		border: 1px solid #f3b4d6;
		background: #fff;
		color: #ec4899;
		border-radius: 8px;
		font-size: 18px;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover:not(:disabled) {
			background: #fdf2f8;
		}

		&:disabled {
			opacity: 0.45;
			cursor: not-allowed;
		}
	}
}
</style>
