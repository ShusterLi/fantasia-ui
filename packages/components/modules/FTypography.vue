<script lang="ts" setup>
import type { FTypographyProps } from '@/types';
import type { CSSProperties } from 'vue';

const props = withDefaults(defineProps<FTypographyProps>(), {
  color: ''
});

const Style = computed<CSSProperties>(() => {
  return {
    color: props.color,
  }
})
</script>

<template>
  <div class="f-typography" :style="Style">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-typography.scss';
</style>

