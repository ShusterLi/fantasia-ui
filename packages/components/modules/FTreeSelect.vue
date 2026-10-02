<script setup lang="ts">
import type { FTreeSelectOption, FTreeSelectProps } from '@/types';
import { ChevronDownOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FTreeSelectProps>(), {
	placeholder: '请选择',
	multiple: false,
});

const modelValue = defineModel<string | number | Array<string | number> | null>({ default: null });
const isOpen = ref(false);
const expandedKeys = ref<(string | number)[]>([]);

const flattenTree = (list: FTreeSelectOption[], level = 0): Array<FTreeSelectOption & { level: number }> => {
	const result: Array<FTreeSelectOption & { level: number }> = [];
	list.forEach((node) => {
		result.push({ ...node, level });
		if (node.children && node.children.length && expandedKeys.value.includes(node.key)) {
			result.push(...flattenTree(node.children, level + 1));
		}
	});
	return result;
};

const visibleNodes = computed(() => flattenTree(props.options));

const selectedLabel = computed(() => {
	const current = props.multiple
		? (Array.isArray(modelValue.value) ? modelValue.value : [])
		: modelValue.value;

	if (props.multiple && Array.isArray(current)) {
		return current.length > 0 ? current.length + ' 项' : props.placeholder;
	}

	const target = props.options.flatMap((item) => flattenTree([item]));
	const node = target.find((item) => item.key === current);
	return node?.label ?? props.placeholder;
});

const toggleExpand = (key: string | number) => {
	if (expandedKeys.value.includes(key)) {
		expandedKeys.value = expandedKeys.value.filter((item) => item !== key);
	} else {
		expandedKeys.value = [...expandedKeys.value, key];
	}
};

const isSelected = (key: string | number) => {
	if (props.multiple && Array.isArray(modelValue.value)) {
		return modelValue.value.includes(key);
	}
	return modelValue.value === key;
};

const handleSelect = (node: FTreeSelectOption) => {
	if (node.disabled) return;

	if (props.multiple) {
		const next = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
		const index = next.indexOf(node.key);
		if (index >= 0) {
			next.splice(index, 1);
		} else {
			next.push(node.key);
		}
		modelValue.value = next;
		return;
	}

	modelValue.value = node.key;
	isOpen.value = false;
};
</script>

<template>
	<div class="f-tree-select" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">
		<div class="f-tree-select__trigger" @click="!disabled && (isOpen = !isOpen)">
			<span class="f-tree-select__label">{{ selectedLabel }}</span>
			<f-icon class="f-tree-select__arrow">
				<ChevronDownOutline />
			</f-icon>
		</div>

		<div v-if="isOpen" class="f-tree-select__panel">
			<div
				v-for="node in visibleNodes"
				:key="String(node.key)"
				class="f-tree-select__node"
				:class="{ 'is-selected': isSelected(node.key), 'is-disabled': node.disabled }"
				:style="{ paddingLeft: `${(node.level + 1) * 16 + 8}px` }"
				@click="node.children && node.children.length ? toggleExpand(node.key) : handleSelect(node)"
			>
				<span class="f-tree-select__expand" v-if="node.children && node.children.length">
					{{ expandedKeys.includes(node.key) ? '-' : '+' }}
				</span>
				<span class="f-tree-select__text">{{ node.label }}</span>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-tree-select.scss';
</style>

