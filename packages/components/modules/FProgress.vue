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
@use '../../styles/components/f-progress.scss';
</style>

