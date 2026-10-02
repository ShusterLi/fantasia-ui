<script setup lang="ts">
import type { FButtonGroupProps } from '@/types';

const props = withDefaults(defineProps<FButtonGroupProps>(), {
	size: 'normal',
	vertical: false
})

provide('FButtonGroupContext', reactive({
	...toRefs(props)
}));
</script>

<template>
	<div class="f-button-group" :class="{ 'f-button-group--vertical': vertical }" role="group">
		<slot />
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-button-group.scss';
</style>

