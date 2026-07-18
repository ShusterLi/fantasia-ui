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
.f-col {
  box-sizing: border-box;
  flex-shrink: 0;
  width: calc(var(--col-span) / 60 * 100%);
  margin-left: calc(var(--col-offset) / 60 * 100%);
  order: var(--col-order);

  // xs < 576px（默认，不加 media query）
  @for $i from 0 through 60 {
    &--xs-#{$i} {
      width: calc($i / 60 * 100%);
    }

    &--xs-offset-#{$i} {
      margin-left: calc($i / 60 * 100%);
    }

    &--xs-order-#{$i} {
      order: $i;
    }
  }

  // sm ≥ 576px
  @media (min-width: 576px) {
    @for $i from 0 through 60 {
      &--sm-#{$i} {
        width: calc($i / 60 * 100%);
      }

      &--sm-offset-#{$i} {
        margin-left: calc($i / 60 * 100%);
      }

      &--sm-order-#{$i} {
        order: $i;
      }
    }
  }

  // md ≥ 768px
  @media (min-width: 768px) {
    @for $i from 0 through 60 {
      &--md-#{$i} {
        width: calc($i / 60 * 100%);
      }

      &--md-offset-#{$i} {
        margin-left: calc($i / 60 * 100%);
      }

      &--md-order-#{$i} {
        order: $i;
      }
    }
  }

  // lg ≥ 1200px
  @media (min-width: 1200px) {
    @for $i from 0 through 60 {
      &--lg-#{$i} {
        width: calc($i / 60 * 100%);
      }

      &--lg-offset-#{$i} {
        margin-left: calc($i / 60 * 100%);
      }

      &--lg-order-#{$i} {
        order: $i;
      }
    }
  }
}
</style>
