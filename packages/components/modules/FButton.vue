<script lang="ts" setup>
import type { CSSProperties, VNode } from 'vue';
import { Comment, Text, Fragment } from 'vue';
import type { FButtonProps, FButtonGroupContext } from '@/types';
import FIcon from './FIcon.vue';

const SIZE_MAP = {
  small: { h: '24px', p: '0 8px', f: '12px', i: '14px', g: '6px' },
  normal: { h: '32px', p: '0 12px', f: '13px', i: '16px', g: '8px' },
  large: { h: '40px', p: '0 16px', f: '14px', i: '18px', g: '10px' },
} as const;

const props = withDefaults(defineProps<FButtonProps & { active?: boolean }>(), {
  nativeType: 'button',
});

const slots = defineSlots<{
  default?: () => VNode[];
  icon?: () => VNode[];
}>();

const groupContext = inject<FButtonGroupContext | null>('FButtonGroupContext', null);

const mergedSize = computed(() => props.size ?? groupContext?.size ?? 'normal');
const mergedType = computed(() => props.type ?? groupContext?.type ?? 'default');
const isDisabled = computed(() => props.disabled || props.loading || groupContext?.disabled);

// 检测是否有文本内容
const hasContent = (nodes: VNode[]): boolean =>
  nodes.some((n) => {
    if (n.type === Comment) return false;
    if (n.type === Text) return String(n.children).trim() !== '';
    if (n.type === Fragment) return hasContent((n.children as VNode[]) ?? []);
    return true;
  });

const hasText = computed(() => hasContent(slots.default?.() ?? []));

const buttonStyle = computed(() => {
  const sizeKey = typeof mergedSize.value === 'number' ? 'normal' : mergedSize.value;
  const s = SIZE_MAP[sizeKey as keyof typeof SIZE_MAP] || SIZE_MAP.normal;
  const style = {
    height: typeof mergedSize.value === 'number' ? `${mergedSize.value}px` : s.h,
    padding: props.circle ? '0' : s.p,
    fontSize: s.f,
    minWidth: props.circle ? (typeof mergedSize.value === 'number' ? `${mergedSize.value}px` : s.h) : 'auto',
    backgroundColor: props.bgColor,
    color: props.color,
    '--f-button-gap': s.g,
    '--f-button-h': typeof mergedSize.value === 'number' ? `${mergedSize.value}px` : s.h
  } as CSSProperties;

  // 圆角只有在非 Group 模式下才默认生效
  if (props.circle) {
    style.borderRadius = '50%';
    style.width = typeof mergedSize.value === 'number' ? `${mergedSize.value}px` : s.h;
  } else if (typeof props.round === 'number') {
    style.borderRadius = `${props.round}px`;
  } else if (props.round === true) {
    style.borderRadius = '999px';
  }

  return style;
});

const iconSize = computed(() => {
  if (typeof mergedSize.value === 'number') {
    return Math.round(mergedSize.value * 0.6); // 图标大小约为按钮高度的 60%
  }
  const s = SIZE_MAP[mergedSize.value as keyof typeof SIZE_MAP] || SIZE_MAP.normal;
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
@use '../../styles/components/f-button.scss';
</style>
