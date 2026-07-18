<script setup lang="ts">
import type { FCollapseProps } from '@/types';

const props = withDefaults(defineProps<FCollapseProps>(), {
	accordion: false
})

/**
 * accordion = false 时 modelValue 为 (string | number)[]
 * accordion = true  时 modelValue 为 string | number
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

<style lang="scss">
:root {
	--f-collapse-border-color: #333338;
	--f-collapse-radius: 8px;
}

:root.light {
	--f-collapse-border-color: #e4e4e7;
}

.f-collapse {
	border: 1px solid var(--f-collapse-border-color);
	border-radius: var(--f-collapse-radius);
	overflow: hidden;
}
</style>
