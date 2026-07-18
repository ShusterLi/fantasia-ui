<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { FDividerProps } from '@/types';
import { computed } from 'vue';

const props = withDefaults(defineProps<FDividerProps>(), {
  direction: 'horizontal',
  line: 'solid'
})

const style = computed<CSSProperties>(() => {
  const baseColor = props.color || 'var(--el-color-primary)'
  const isHorizontal = props.direction === 'horizontal'

  return {
    borderTop: isHorizontal ? `${props.line} ${baseColor}` : 'none',
    borderLeft: !isHorizontal ? `${props.line} ${baseColor}` : 'none',
    height: isHorizontal ? '0' : '100%',
    width: isHorizontal ? '100%' : '0',
    margin: isHorizontal ? '24px 0' : '0'
  }
})
</script>

<template>
  <hr :style="style" />
</template>

<style lang="scss" scoped>
hr {
  width: 100%;
  border-top: 2px solid var(--el-color-primary);
  height: 1px;
  margin: 24px 0;
  border-radius: 2px;
}
</style>
