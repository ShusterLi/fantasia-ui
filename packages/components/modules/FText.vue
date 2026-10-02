<script lang="ts" setup>
import type { FTextProps } from '@/types';

const props = withDefaults(defineProps<FTextProps>(), {
  tag: 'span',
  size: 'normal',
  weight: 'normal',
});

const headingSizeMap: Record<number, FTextProps['size']> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'normal',
  6: 'sm',
};

const headingWeightMap: Record<number, FTextProps['weight']> = {
  1: 'bolder',
  2: 'bold',
  3: 'bold',
  4: 'medium',
  5: 'medium',
  6: 'normal',
};

const resolvedTag = computed(() => props.heading ? `h${props.heading}` : props.tag ?? 'span');
const resolvedSize = computed(() => props.size ?? (props.heading ? headingSizeMap[props.heading] : 'normal'));
const resolvedWeight = computed(() => props.weight ?? (props.heading ? headingWeightMap[props.heading] : 'normal'));
</script>

<template>
  <component :is="resolvedTag" class="f-text" :class="[
    `f-text--${resolvedSize}`,
    `f-text--${resolvedWeight}`,
    color && `f-text--${color}`,
    { 'f-text--truncate': truncate, 'f-text--italic': italic }
  ]">
    <slot />
  </component>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-text.scss';
</style>

