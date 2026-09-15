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
		return current.length > 0 ? current.length + ' 项已选' : props.placeholder;
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
					{{ expandedKeys.includes(node.key) ? '−' : '+' }}
				</span>
				<span class="f-tree-select__text">{{ node.label }}</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.f-tree-select {
	position: relative;
	width: 100%;
	min-width: 180px;

	&.is-disabled {
		opacity: 0.6;
	}

	&__trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: #ec4899;
		}
	}

	&.is-open &__trigger {
		border-color: #ec4899;
		box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
	}

	&__label {
		flex: 1;
		font-size: 14px;
		color: #1f2937;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__arrow {
		font-size: 14px;
		color: #64748b;
		transition: transform 0.2s ease;
	}

	&.is-open &__arrow {
		transform: rotate(180deg);
	}

	&__panel {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		right: 0;
		max-height: 260px;
		overflow: auto;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
		padding: 8px 0;
		z-index: 20;
	}

	&__node {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		cursor: pointer;
		color: #334155;
		font-size: 14px;
		transition: background 0.15s ease;

		&:hover {
			background: #fdf2f8;
		}

		&.is-selected {
			background: #fdf2f8;
			color: #9d174d;
			font-weight: 500;
		}

		&.is-disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	&__expand {
		width: 12px;
		font-weight: 600;
		color: #64748b;
	}
}
</style>
