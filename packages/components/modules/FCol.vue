<script lang="ts" setup>
import type { FColProps, ColSize } from '@/types';

const props = withDefaults(defineProps<FColProps>(), {
  span: 24,
  offset: 0,
  order: 0,
})

const normalize = (size: ColSize): { span?: number; offset?: number; order?: number } =>
  typeof size === 'number' ? { span: size } : size

const colStyle = computed(() => ({
  '--col-span': props.span,
  '--col-offset': props.offset,
  '--col-order': props.order,
}))

const colClass = computed(() => {
  const classes: string[] = []
  const breakpoints = { xs: props.xs, sm: props.sm, md: props.md, lg: props.lg } as const

  for (const [bp, val] of Object.entries(breakpoints)) {
    if (val === undefined) continue
    const { span, offset, order } = normalize(val)
    if (span !== undefined) classes.push(`f-col--${bp}-${span}`)
    if (offset !== undefined) classes.push(`f-col--${bp}-offset-${offset}`)
    if (order !== undefined) classes.push(`f-col--${bp}-order-${order}`)
  }

  return classes
})
</script>

<template>
  <div class="f-col" :class="colClass" :style="colStyle">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-col.scss';
</style>

