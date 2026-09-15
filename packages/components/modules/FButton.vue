<script lang="ts" setup>
import type { CSSProperties, Component } from 'vue';
import type { FButtonProps, FButtonGroupContext } from '@/types';
import FIcon from './FIcon.vue';

const SIZE_MAP = {
  small: { h: '24px', p: '0 8px', f: '12px', i: '14px' },
  normal: { h: '32px', p: '0 12px', f: '13px', i: '16px' },
  large: { h: '40px', p: '0 16px', f: '14px', i: '18px' },
} as const;

const props = withDefaults(defineProps<FButtonProps & { active?: boolean }>(), {
  nativeType: 'button',
});

const slots = defineSlots<{
  default?: () => any;
  icon?: () => any;
}>();

const groupContext = inject<FButtonGroupContext | null>('FButtonGroupContext', null);

const mergedSize = computed(() => props.size ?? groupContext?.size ?? 'normal');
const mergedType = computed(() => props.type ?? groupContext?.type ?? 'default');
const isDisabled = computed(() => props.disabled || props.loading || groupContext?.disabled);

// 检测是否有文本内容
const hasText = computed(() => !!slots.default);

const buttonStyle = computed(() => {
  const s = SIZE_MAP[mergedSize.value] || SIZE_MAP.normal;
  const style: CSSProperties = {
    height: s.h,
    padding: props.circle ? '0' : s.p,
    fontSize: s.f,
    minWidth: props.circle ? s.h : 'auto',
    backgroundColor: props.bgColor,
    color: props.color,
  };

  // 圆角只有在非 Group 模式下才默认生效
  if (props.circle) {
    style.borderRadius = '50%';
    style.width = s.h;
  } else if (typeof props.round === 'number') {
    style.borderRadius = `${props.round}px`;
  } else if (props.round === true) {
    style.borderRadius = '999px';
  }

  return style;
});

const iconSize = computed(() => {
  const s = SIZE_MAP[mergedSize.value] || SIZE_MAP.normal;
  return s.i;
});
</script>

<template>
  <button :type="nativeType" class="f-button" :disabled="isDisabled" :style="buttonStyle" :class="[
    `f-button--${mergedType}`,
    `f-button--${mergedSize}`,
    { 
      'is-disabled': isDisabled, 
      'is-loading': loading, 
      'is-active': active,
      'is-text': text,
      'is-icon-only': !hasText && (icon || $slots.icon)
    }
  ]">
    <span class="f-button__inner">
      <span v-if="loading" class="f-loader"></span>
      
      <!-- 图标插槽优先，然后是 icon prop -->
      <template v-if="!loading">
        <f-icon v-if="$slots.icon || icon" class="f-button__icon" :style="{ fontSize: iconSize }">
          <slot name="icon">
            <component v-if="icon" :is="icon" />
          </slot>
        </f-icon>
      </template>
      
      <!-- 文本内容 -->
      <span v-if="hasText" class="f-button__text">
        <slot />
      </span>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.f-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--f-border-color, #dcdfe6);
  background: transparent;
  color: #606266;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.1s;
  line-height: 1;
  box-sizing: border-box;

  .f-button__inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 100%;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__text {
    display: inline-flex;
    align-items: center;
  }

  // 纯图标按钮时去掉间距
  &.is-icon-only .f-button__inner {
    gap: 0;
  }

  :deep(.f-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
  }

  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background: #f5f7fa;
  }

  &:active {
    background: #eeeeee;
  }

  // 颜色变体
  &--default {
    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background: #f5f7fa;
    }
  }

  &--primary {
    background: #409eff;
    border-color: #409eff;
    color: #fff;

    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
    }

    &:active {
      background: #3a8ee6;
      border-color: #3a8ee6;
    }
  }

  &--success {
    background: #67c23a;
    border-color: #67c23a;
    color: #fff;

    &:hover {
      background: #85ce61;
      border-color: #85ce61;
    }

    &:active {
      background: #5daf34;
      border-color: #5daf34;
    }
  }

  &--error {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;

    &:hover {
      background: #f78989;
      border-color: #f78989;
    }

    &:active {
      background: #dd6161;
      border-color: #dd6161;
    }
  }

  &--warning {
    background: #e6a23c;
    border-color: #e6a23c;
    color: #fff;

    &:hover {
      background: #ebb563;
      border-color: #ebb563;
    }

    &:active {
      background: #cf9236;
      border-color: #cf9236;
    }
  }

  &--info {
    background: #909399;
    border-color: #909399;
    color: #fff;

    &:hover {
      background: #a6a9ad;
      border-color: #a6a9ad;
    }

    &:active {
      background: #82848a;
      border-color: #82848a;
    }
  }

  &--failed {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;

    &:hover {
      background: #f78989;
      border-color: #f78989;
    }

    &:active {
      background: #dd6161;
      border-color: #dd6161;
    }
  }

  // 文本按钮
  &.is-text {
    border-color: transparent;
    background: transparent;
    color: #409eff;
    padding-left: 0;
    padding-right: 0;

    &:hover {
      color: #66b1ff;
      border-color: transparent;
      background: transparent;
    }

    &:active {
      color: #3a8ee6;
      background: transparent;
    }

    &.is-disabled {
      background: transparent;
      border-color: transparent;
    }

    // 文本按钮的不同类型颜色
    &.f-button--primary {
      color: #409eff;
      background: transparent;
      border-color: transparent;

      &:hover { color: #66b1ff; }
      &:active { color: #3a8ee6; }
    }

    &.f-button--success {
      color: #67c23a;
      background: transparent;
      border-color: transparent;

      &:hover { color: #85ce61; }
      &:active { color: #5daf34; }
    }

    &.f-button--warning {
      color: #e6a23c;
      background: transparent;
      border-color: transparent;

      &:hover { color: #ebb563; }
      &:active { color: #cf9236; }
    }

    &.f-button--failed {
      color: #f56c6c;
      background: transparent;
      border-color: transparent;

      &:hover { color: #f78989; }
      &:active { color: #dd6161; }
    }

    &.f-button--info {
      color: #909399;
      background: transparent;
      border-color: transparent;

      &:hover { color: #a6a9ad; }
      &:active { color: #82848a; }
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
    filter: grayscale(1);
  }

  .f-loader {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>