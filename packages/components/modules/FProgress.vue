<script lang="ts" setup>
import type { FProgressProps } from '@/types';

const props = withDefaults(defineProps<FProgressProps>(), {
  showText: false,
  height: 5,
});

const clampedPercent = computed(() => Math.min(100, Math.max(0, props.percent)));
</script>

<template>
  <div class="f-progress">
    <div class="f-progress__track" :style="{ height: `${height}px` }">
      <div class="f-progress__fill" :style="{
        width: `${clampedPercent}%`,
        background: color,
      }" />
    </div>
    <span v-if="showText" class="f-progress__text">{{ clampedPercent }}%</span>
  </div>
</template>

<style lang="scss" scoped>
.f-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  &__track {
    flex: 1;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(to right, var(--gold), #f59e0b);
    border-radius: 3px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__text {
    font-size: 11px;
    color: var(--text-dim);
    width: 32px;
    flex-shrink: 0;
    text-align: right;
  }
}
</style>