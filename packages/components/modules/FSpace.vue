<script lang="ts" setup>
import type { FSpaceProps, Size } from '@/types';
import type { VNode, CSSProperties, Slots } from "vue";
import { Fragment } from 'vue'

const props = withDefaults(defineProps<FSpaceProps>(), {
  direction: 'horizontal',
  size: 'normal',
  align: 'center',
  justify: 'start',
  wrap: false,
})

const sizeMap: Record<string, number> = {
  small: 6,
  normal: 12,
  large: 18,
}

const resolveSize = (s: Size) =>
  typeof s === 'number' ? s : sizeMap[s]

const gapStyle = computed(() => {
  const size = props.size
  if (Array.isArray(size)) {
    return `${resolveSize(size[1])}px ${resolveSize(size[0])}px`
  }
  return `${resolveSize(size)}px`
})

const spaceStyle = computed((): CSSProperties => ({
  flexDirection: props.direction === 'vertical' ? 'column' : 'row',
  alignItems: props.align,
  justifyContent: props.justify,
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  gap: gapStyle.value,
}))

const slots = useSlots() as Slots

const children = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  const result: VNode[] = []
  for (const vnode of defaultSlot) {
    if (vnode.type === Fragment) {
      result.push(...(vnode.children as VNode[]))
    } else {
      result.push(vnode)
    }
  }
  return result.filter(v => v.type !== Comment)
})
</script>

<template>
  <div class="f-space" :style="spaceStyle">
    <template v-for="(child, index) in children" :key="index">
      <div class="f-space__item">
        <component :is="child" />
      </div>
      <span v-if="split && index < children.length - 1" class="f-space__split" aria-hidden="true">{{ split }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.f-space {
  display: inline-flex;
  box-sizing: border-box;

  &__item {
    display: flex;
    align-items: center;
  }

  &__split {
    display: flex;
    align-items: center;
    color: var(--border3);
    user-select: none;
  }
}
</style>
