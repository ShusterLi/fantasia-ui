<script lang="ts" setup>
import type { FIconProps } from '@/types';

const props = withDefaults(defineProps<FIconProps>(), {
  size: '1em'
})

const style = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
}));
</script>

<template>
  <span role="img" class="f-icon" :style="style">
    <slot />
  </span>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-icon.scss';
</style>

