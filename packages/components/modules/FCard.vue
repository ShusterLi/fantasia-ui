<script lang="ts" setup>
import type { FCardProps } from '@/types';

const props = withDefaults(defineProps<FCardProps>(), {
  hoverable: true,
  direction: 'vertical'
})

defineSlots<{
  header?: () => any;
  'header-extra'?: () => any;
  cover?: () => any;
  default?: () => any;
  footer?: () => any;
}>();
</script>

<template>
  <div class="f-card" :class="[`f-card--${direction}`, { 'is-hoverable': hoverable }]">

    <template v-if="direction === 'vertical'">
      <div v-if="$slots.header || $slots['header-extra']" class="f-card__header">
        <slot name="header" />
        <div v-if="$slots['header-extra']" class="f-card__header-extra">
          <slot name="header-extra" />
        </div>
      </div>
      <div v-if="$slots.cover" class="f-card__cover">
        <slot name="cover" />
      </div>
      <div v-if="$slots.default" class="f-card__body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="f-card__footer">
        <slot name="footer" />
      </div>
    </template>


    <template v-else>
      <div v-if="$slots.header || $slots['header-extra']" class="f-card__header">
        <slot name="header" />
        <div v-if="$slots['header-extra']" class="f-card__header-extra">
          <slot name="header-extra" />
        </div>
      </div>

      <div v-if="$slots.cover" class="f-card__cover">
        <slot name="cover" />
      </div>
      <div class="f-card__content">
        <div v-if="$slots.default" class="f-card__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="f-card__footer">
          <slot name="footer" />
        </div>
      </div>
    </template>

  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-card.scss';
</style>
