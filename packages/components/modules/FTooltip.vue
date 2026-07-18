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

  const triggerEl = (triggerRef.value?.firstElementChild as HTMLElement) ?? triggerRef.value;
  if (!triggerEl) return;

  const trigger = triggerEl.getBoundingClientRect();
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

  // 视口边界保护
  const padding = 8;
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltip.width - padding));
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltip.height - padding));

  position.value = { top: top + window.scrollY, left: left + window.scrollX };
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
.f-tooltip {
  display: contents;
}

.f-tooltip-wrapper {
  position: absolute;
  z-index: 999;
  padding: 5px 9px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--surface);
  background: var(--text);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  word-break: break-word;
  white-space: pre-wrap;

  .f-tooltip-arrow {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--text);
    transform: rotate(45deg);
  }

  &.is-top .f-tooltip-arrow {
    bottom: -3px;
    left: 50%;
    translate: -50% 0;
  }

  &.is-bottom .f-tooltip-arrow {
    top: -3px;
    left: 50%;
    translate: -50% 0;
  }

  &.is-left .f-tooltip-arrow {
    right: -3px;
    top: 50%;
    translate: 0 -50%;
  }

  &.is-right .f-tooltip-arrow {
    left: -3px;
    top: 50%;
    translate: 0 -50%;
  }
}

.f-tooltip-enter-active,
.f-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.f-tooltip-enter-from,
.f-tooltip-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
