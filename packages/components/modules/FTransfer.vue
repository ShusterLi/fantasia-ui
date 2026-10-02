<script setup lang="ts">
import type { FTransferItem, FTransferProps } from '@/types';

const props = withDefaults(defineProps<FTransferProps>(), {
	leftTitle: '鍙€夐」',
	rightTitle: '宸查€夐」',
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
				鈫?
			</button>
			<button type="button" class="f-transfer__btn" :disabled="disabled || rightList.length === 0" @click="moveSelected('left')">
				鈫?
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
@use '../../styles/components/f-transfer.scss';
</style>

