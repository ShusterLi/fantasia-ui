<script lang="ts" setup>
import type { FTooltipProps } from '@/types';

const props = withDefaults(defineProps<FTooltipProps>(), {
  placement: 'top',
  disabled: false,
  delay: 100,
  offset: 6,
  maxWidth: 240,
});

const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const position = ref({ top: 0, left: 0 });

let showTimer: ReturnType<typeof setTimeout> | null = null;

const getAnchorRect = (): DOMRect | null => {
  const root = triggerRef.value;
  if (!root) return null;

  const el = root.firstElementChild as HTMLElement | null;
  if (el) return el.getBoundingClientRect();

  // 插槽只有文本：用 Range 量文本节点的实际矩形
  const range = document.createRange();
  range.selectNodeContents(root);
  const rect = range.getBoundingClientRect();
  return rect.width || rect.height ? rect : null;
};

const show = () => {
  if (props.disabled) return;
  showTimer = setTimeout(() => {
    visible.value = true;
    nextTick(updatePosition);
  }, props.delay);
};

const hide = () => {
  if (showTimer) clearTimeout(showTimer);
  visible.value = false;
};

const updatePosition = () => {
  if (!tooltipRef.value) return;

  const trigger = getAnchorRect();
  if (!trigger) { visible.value = false; return; }

  const tooltip = tooltipRef.value.getBoundingClientRect();
  const gap = props.offset;
  const [side, align] = props.placement.split('-') as [string, string | undefined];

  let top = 0;
  let left = 0;

  switch (side) {
    case 'top': top = trigger.top - tooltip.height - gap; break;
    case 'bottom': top = trigger.bottom + gap; break;
    case 'left': left = trigger.left - tooltip.width - gap; break;
    case 'right': left = trigger.right + gap; break;
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') left = trigger.left;
    else if (align === 'end') left = trigger.right - tooltip.width;
    else left = trigger.left + (trigger.width - tooltip.width) / 2;
  } else {
    if (align === 'start') top = trigger.top;
    else if (align === 'end') top = trigger.bottom - tooltip.height;
    else top = trigger.top + (trigger.height - tooltip.height) / 2;
  }

  const padding = 8;
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltip.width - padding));
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltip.height - padding));

  position.value = { top, left };
};

onUnmounted(hide);
</script>

<template>
  <div class="f-tooltip" ref="triggerRef" @mouseenter="show" @mouseleave="hide">
    <slot />

    <Teleport to="body">
      <Transition name="f-tooltip">
        <div v-if="visible && (content || $slots.content)" ref="tooltipRef" class="f-tooltip-wrapper"
          :class="`is-${placement.split('-')[0]}`" :style="{
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxWidth: `${maxWidth}px`,
          }">
          <slot name="content">{{ content }}</slot>
          <span class="f-tooltip-arrow" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-tooltip.scss';
</style>
