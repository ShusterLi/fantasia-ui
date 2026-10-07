<script setup lang="ts">
import type { FCollapseProps } from '@/types';
import FIcon from './FIcon.vue';

const emit = defineEmits<{
	add: []
}>();

const props = withDefaults(defineProps<FCollapseProps>(), {
	accordion: false,
	showAddButton: false,
	addButtonPosition: 'bottom',
	addButtonText: '新增选项'
})

/**
 * accordion = false 鏃?modelValue 涓?(string | number)[]
 * accordion = true  鏃?modelValue 涓?string | number
 */
const activeNames = defineModel<Array<string | number> | string | number>({
	default: () => []
})

const normalizedActiveNames = computed<Array<string | number>>(() => {
	if (Array.isArray(activeNames.value)) return activeNames.value
	return activeNames.value === undefined || activeNames.value === null || activeNames.value === ''
		? []
		: [activeNames.value]
})

function handleItemClick(name: string | number) {
	if (props.accordion) {
		activeNames.value = normalizedActiveNames.value.includes(name) ? '' : name
		return
	}

	const current = [...normalizedActiveNames.value]
	const idx = current.indexOf(name)
	if (idx > -1) {
		current.splice(idx, 1)
	} else {
		current.push(name)
	}
	activeNames.value = current
}

function handleAddClick() {
	emit('add')
}

provide(
	'fCollapseContext',
	reactive({
		activeNames: normalizedActiveNames,
		handleItemClick
	})
)
</script>

<template>
	<div class="f-collapse">
		<div v-if="showAddButton && addButtonPosition === 'top'" class="f-collapse__add-button f-collapse__add-button--top">
			<button class="f-collapse__add-button-inner" @click="handleAddClick">
				<FIcon name="material-symbols:add" />
				<span>{{ addButtonText }}</span>
			</button>
		</div>
		<slot />
		<div v-if="showAddButton && addButtonPosition === 'bottom'" class="f-collapse__add-button f-collapse__add-button--bottom">
			<button class="f-collapse__add-button-inner" @click="handleAddClick">
				<FIcon name="material-symbols:add" />
				<span>{{ addButtonText }}</span>
			</button>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-collapse.scss';
</style>

