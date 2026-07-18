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
.f-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: -0.15em;
  line-height: 1;
  color: inherit;

 :deep(svg) {
    width: 100%;
    height: 100%;
    font-size: inherit;
    color: inherit;
    fill: currentColor;
    outline: none;
    overflow: hidden;
  }
}
</style>