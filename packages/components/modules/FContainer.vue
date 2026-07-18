<script setup lang="ts">
import type { FContainerProps } from '@/types';
import type { CSSProperties } from 'vue';

const props = withDefaults(defineProps<FContainerProps>(), {
  gap: 12,
})

const ContainerStyle = computed<CSSProperties>(() => ({
  gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
}))
</script>

<template>
  <div class="f-container" :style="ContainerStyle">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.f-container {
  width: 100%;
  height: 100%;
}
</style>
