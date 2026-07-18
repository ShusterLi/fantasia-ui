<script lang="ts" setup>
import type { FRowProps, Justify, Align } from '@/types';

const props = withDefaults(defineProps<FRowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: 'wrap',
  tag: 'div',
})

const gutterH = computed(() =>
  Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
)
const gutterV = computed(() =>
  Array.isArray(props.gutter) ? props.gutter[1] : 0
)

const justifyMap: Record<Justify, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
}

const alignMap: Record<Align, string> = {
  'top': 'flex-start',
  'middle': 'center',
  'bottom': 'flex-end',
  'stretch': 'stretch',
}

const rowStyle = computed(() => ({
  marginLeft: gutterH.value ? `-${gutterH.value / 2}px` : undefined,
  marginRight: gutterH.value ? `-${gutterH.value / 2}px` : undefined,
  rowGap: gutterV.value ? `${gutterV.value}px` : undefined,
  justifyContent: justifyMap[props.justify],
  alignItems: alignMap[props.align],
  flexWrap: props.wrap,
  '--row-gutter-h': gutterH.value ? `${gutterH.value / 2}px` : '0px',
}))
</script>

<template>
  <component :is="tag" class="f-row" :style="rowStyle">
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.f-row {
  display: flex;
  box-sizing: border-box;

  :deep(.f-col) {
    padding-left: var(--row-gutter-h);
    padding-right: var(--row-gutter-h);
  }
}
</style>
