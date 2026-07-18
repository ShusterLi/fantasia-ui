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
.f-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &.is-hoverable {
    cursor: pointer;

    &:hover {
      border-color: var(--border2);
      box-shadow: 0 8px 24px -4px var(--shadow);
      transform: translateY(-2px);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  &__header-extra {
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 400;
  }

  &__cover {
    position: relative;
  }

  &__body {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.6;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 12px 16px;
    font-size: 13px;
  }

  // 纵向布局
  &--vertical {
    display: flex;
    flex-direction: column;

    .f-card__cover {
      width: 100%;
      height: auto;
    }

    .f-card__body {
      flex: 1;
      padding: 16px;
    }
  }

  // 横向布局
  &--horizontal {
    display: flex;
    flex-direction: row;
    align-items: stretch;

    .f-card__cover {
      flex-shrink: 0;
    }

    .f-card__content {
      flex: 1;
      display: flex;
      flex-direction: row;
      min-width: 0;

      .f-card__body {
        flex: 1;
        padding: 12px 16px;
      }
    }
  }
}
</style>
