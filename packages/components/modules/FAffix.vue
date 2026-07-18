<script lang="ts" setup>
import type { FAffixProps } from '@/types';

const props = withDefaults(defineProps<FAffixProps>(), {
  placement: 'top-right',
  offset: () => [8, 8],
});

const style = computed(() => {
  const [x, y] = props.offset;
  const map = {
    'top-left': { top: `${y}px`, left: `${x}px` },
    'top-right': { top: `${y}px`, right: `${x}px` },
    'bottom-left': { bottom: `${y}px`, left: `${x}px` },
    'bottom-right': { bottom: `${y}px`, right: `${x}px` },
  };
  return map[props.placement];
});
</script>

<template>
  <div class="f-affix" :style="style">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.f-affix {
  position: absolute;
  z-index: 1;
}
</style>
