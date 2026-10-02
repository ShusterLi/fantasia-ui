<script setup lang="ts">
import type { FCollapseProps } from '@/types';

const props = withDefaults(defineProps<FCollapseProps>(), {
	accordion: false
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
		<slot />
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-collapse.scss';
</style>

