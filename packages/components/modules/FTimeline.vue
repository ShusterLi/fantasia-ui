<script setup lang="ts">
import type { FTimelineProps } from '@/types';

const props = withDefaults(defineProps<FTimelineProps>(), {
  mode: 'left',
  direction: 'vertical',
});

// 通过 provide 将 direction 传递给子组件
provide('timelineDirection', props.direction);
</script>

<template>
  <div 
    class="f-timeline" 
    :class="[
      `f-timeline--${mode}`,
      `f-timeline--${direction}`
    ]"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-timeline.scss';
</style>
