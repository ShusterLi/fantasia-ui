<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { FButtonProps, FButtonGroupContext } from '@/types';

const SIZE_MAP = {
  small: { h: '24px', p: '0 8px', f: '12px', i: '14px' },
  normal: { h: '32px', p: '0 12px', f: '13px', i: '16px' },
  large: { h: '40px', p: '0 16px', f: '14px', i: '18px' },
} as const;

const props = withDefaults(defineProps<FButtonProps & { active?: boolean }>(), {
  nativeType: 'button',
});

const groupContext = inject<FButtonGroupContext | null>('FButtonGroupContext', null);

const mergedSize = computed(() => props.size ?? groupContext?.size ?? 'normal');
const mergedType = computed(() => props.type ?? groupContext?.type ?? 'default');
const isDisabled = computed(() => props.disabled || props.loading || groupContext?.disabled);

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
</script>

<template>
  <button :type="nativeType" class="f-button" :disabled="isDisabled" :style="buttonStyle" :class="[
    `f-button--${mergedType}`,
    `f-button--${mergedSize}`,
    { 'is-disabled': isDisabled, 'is-loading': loading, 'is-active': active }
  ]">
    <span class="f-button__inner">
      <span v-if="loading" class="f-loader"></span>
      <slot />
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
    gap: 4px;
    height: 100%;
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
  &--primary {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }

  &--success {
    background: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }

  &--error {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
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