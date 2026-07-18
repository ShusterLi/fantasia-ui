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
.f-badge {
  position: relative;
  display: inline-flex;

  &__content {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    box-sizing: border-box;
    border: 1.5px solid var(--bg);
    z-index: 1;
  }

  &--dot {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  }

  &--danger {
    background: var(--red);
    color: #fff;
  }

  &--primary {
    background: var(--accent);
    color: #fff;
  }

  &--success {
    background: var(--green);
    color: #fff;
  }

  &--warning {
    background: var(--gold);
    color: #fff;
  }

  &--info {
    background: var(--blue);
    color: #fff;
  }
}
</style>
