<script lang="ts" setup>
import type { FTagProps } from '@/types';
import { Close, CloseCircle } from '@vicons/ionicons5'
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FTagProps>(), {
  size: 'normal',
  type: 'round',
  theme: 'light',
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isHover = ref(false);
</script>

<template>
  <span class="f-tag" :class="[
    `f-tag--${type ?? 'round'}`,
    `f-tag--${effect ?? 'light'}`,
    color ?? 'default'
  ]" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <span v-if="type === 'dot'" class="f-tag__dot" />
    <slot />
    <f-icon v-if="closable" class="f-tag__close" @click.stop="emit('close')">
      <component :is="isHover ? CloseCircle : Close" />
    </f-icon>
  </span>
</template>

<style lang="scss" scoped>
.f-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  padding: 2px 8px;
  letter-spacing: .05em;
  white-space: nowrap;
  line-height: 1.6;

  &__close {
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s;

    &:hover {
      opacity: 1;
    }
  }

  &--round {
    border-radius: 10px;
  }

  &--square {
    border-radius: 4px;
  }

  &--dot {
    border-radius: 10px;
    gap: 6px;

    .f-tag__dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
  }

  &--bookmark {
    border-radius: 0 3px 3px 0;
    padding: 2px 14px 2px 10px;
    position: relative;
    clip-path: polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%);
    border: none !important;
    margin-left: 8px;

    &::after {
      content: '';
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--bg);
    }
  }

  // 颜色 token
  &.purple {
    --_color: var(--accent);
    --_dim: rgba(192, 132, 252, .15);
  }

  &.pink {
    --_color: var(--accent2);
    --_dim: rgba(244, 114, 182, .15);
  }

  &.cyan {
    --_color: var(--accent3);
    --_dim: rgba(103, 232, 249, .15);
  }

  &.blue {
    --_color: var(--blue);
    --_dim: var(--blue-dim);
  }

  &.green {
    --_color: var(--green);
    --_dim: var(--green-dim);
  }

  &.gold {
    --_color: var(--gold);
    --_dim: var(--gold-dim);
  }

  &.orange {
    --_color: var(--orange);
    --_dim: var(--orange-dim);
  }

  &.black {
    --_color: rgba(0, 0, 0, .7);
    --_dim: var(--gold)
  }

  &.red {
    --_color: var(--red);
    --_dim: var(--red-dim);
  }

  &.default {
    --_color: var(--text-muted);
    --_dim: var(--surface3);
  }

  // light 主题（半透明，默认）
  &--light {
    background: var(--_dim);
    color: var(--_color);
    border: 1px solid color-mix(in srgb, var(--_color) 30%, transparent);

    &.default {
      background: var(--surface3);
      border: 1px solid var(--border2);
    }
  }

  // dark 主题（实色背景）
  &--dark {
    background: var(--_color);
    color: var(--_dim);
    border: 1px solid var(--_color);

    &.default {
      background: var(--surface3);
      color: var(--text-muted);
      border: 1px solid var(--border2);
    }
  }

  // plain 主题（透明背景，只有边框文字）
  &--plain {
    background: transparent;
    color: var(--_color);
    border: 1px solid color-mix(in srgb, var(--_color) 50%, transparent);

    &.default {
      color: var(--text-muted);
      border: 1px solid var(--border2);
    }
  }
}
</style>
