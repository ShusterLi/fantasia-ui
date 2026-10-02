<script lang="ts" setup>
import type { FBadgeProps } from '@/types';

const props = withDefaults(defineProps<FBadgeProps>(), {
  type: 'danger',
  dot: false,
  max: 99,
  placement: 'top-right',
  offset: () => [0, 0],
});

const displayValue = computed(() => {
  if (props.dot) return '';
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`;
  return props.value ?? '';
});

const contentStyle = computed(() => {
  const [x, y] = props.offset;
  const map = {
    'top-right': { top: 0, right: 0, transform: `translate(calc(50% + ${x}px), calc(-50% + ${y}px))` },
    'top-left': { top: 0, left: 0, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` },
    'bottom-right': { bottom: 0, right: 0, transform: `translate(calc(50% + ${x}px), calc(50% + ${y}px))` },
    'bottom-left': { bottom: 0, left: 0, transform: `translate(calc(-50% + ${x}px), calc(50% + ${y}px))` },
  };
  return map[props.placement];
});
</script>

<template>
  <div class="f-badge">
    <slot />
    <span v-if="dot || (value !== undefined && value !== '')" class="f-badge__content"
      :class="[`f-badge--${type}`, { 'f-badge--dot': dot }]" :style="contentStyle">
      {{ displayValue }}
    </span>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-badge.scss';
</style>

