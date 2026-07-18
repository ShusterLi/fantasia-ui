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
.f-text {

  // 字号
  &--xs {
    font-size: 11px;
  }

  &--sm {
    font-size: 13px;
  }

  &--normal {
    font-size: 14px;
  }

  &--lg {
    font-size: 16px;
  }

  &--xl {
    font-size: 18px;
  }

  &--2xl {
    font-size: 22px;
  }

  &--3xl {
    font-size: 28px;
  }

  // 字重
  &--normal {
    font-weight: 400;
  }

  &--medium {
    font-weight: 500;
  }

  &--bold {
    font-weight: 600;
  }

  &--bolder {
    font-weight: 700;
  }

  // 颜色
  &--default {
    color: var(--text);
  }

  &--muted {
    color: var(--text-muted);
  }

  &--dim {
    color: var(--text-dim);
  }

  &--link {
    color: var(--text-link);
  }

  &--accent {
    color: var(--accent);
  }

  &--accent2 {
    color: var(--accent2);
  }

  &--accent3 {
    color: var(--accent3);
  }

  &--gold {
    color: var(--gold);
  }

  &--green {
    color: var(--green);
  }

  &--red {
    color: var(--red);
  }

  &--blue {
    color: var(--blue);
  }

  &--orange {
    color: var(--orange);
  }

  // 修饰
  &--truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  &--italic {
    font-style: italic;
  }
}
</style>
