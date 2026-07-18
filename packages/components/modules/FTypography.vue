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
.f-typography {
  display: flex;
  align-items: stretch;
  gap: 8px;
  height: fit-content;

  &::before {
    content: '';
    width: 3px;
    min-height: 14px;
    background: linear-gradient(to bottom, var(--accent), var(--accent2));
    border-radius: 2px;
    flex-shrink: 0;
  }
}
</style>
