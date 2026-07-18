<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { FDropdownProps, FDropdownOption } from '@/types';
import { useEventListener } from '@vueuse/core';

const props = withDefaults(defineProps<FDropdownProps>(), {
  trigger: 'hover',
  placement: 'right-start',
  offset: 12,
  zIndex: 2000,
  options: () => [],
});

const emit = defineEmits(['select']);

const show = ref(false);
const anchorRect = ref<DOMRect | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownHeight = ref(0);
const dropdownWidth = ref(0);

// ── 定位计算 ────────────────────────────────────────
const bridgeStyle = computed<CSSProperties>(() => {
  const [side] = props.placement.split('-');
  const gap = Array.isArray(props.offset) ? props.offset[0] : props.offset;

  const size = gap + 4;
  const styles: CSSProperties = { position: 'absolute' };

  if (side === 'right') {
    styles.width = `${size}px`;
    styles.left = `-${size}px`;
    styles.top = 0;
    styles.bottom = 0;
  } else if (side === 'left') {
    styles.width = `${size}px`;
    styles.right = `-${size}px`;
    styles.top = 0;
    styles.bottom = 0;
  } else if (side === 'bottom') {
    styles.height = `${size}px`;
    styles.top = `-${size}px`;
    styles.left = 0;
    styles.right = 0;
  } else if (side === 'top') {
    styles.height = `${size}px`;
    styles.bottom = `-${size}px`;
    styles.left = 0;
    styles.right = 0;
  }
  return styles;
});

const dropdownStyle = computed<CSSProperties>(() => {
  if (!anchorRect.value) return {};
  const rect = anchorRect.value;
  const { placement } = props;

  const gap = Array.isArray(props.offset) ? props.offset[0] : props.offset;

  const [side, align] = placement.split('-') as [string, string | undefined];

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const w = dropdownWidth.value || 160;
  const h = dropdownHeight.value || 200;

  let top = 0;
  let left = 0;
  let resolvedSide = side;

  if (side === 'right') {
    left = rect.right + gap;
    if (left + w > vw) { left = rect.left - w - gap; resolvedSide = 'left'; }
  } else if (side === 'left') {
    left = rect.left - w - gap;
    if (left < 0) { left = rect.right + gap; resolvedSide = 'right'; }
  } else if (side === 'bottom') {
    top = rect.bottom + gap;
    if (top + h > vh) { top = rect.top - h - gap; resolvedSide = 'top'; }
  } else if (side === 'top') {
    top = rect.top - h - gap;
    if (top < 0) { top = rect.bottom + gap; resolvedSide = 'bottom'; }
  }

  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    if (align === 'start') left = rect.left;
    else if (align === 'end') left = rect.right - w;
    else left = rect.left + (rect.width - w) / 2;

    left = Math.max(8, Math.min(left, vw - w - 8));
  } else {
    if (align === 'start') top = rect.top;
    else if (align === 'end') top = rect.bottom - h;
    else top = rect.top + (rect.height - h) / 2;

    top = Math.max(8, Math.min(top, vh - h - 8));
  }

  // 计算动画原点
  const originX = resolvedSide === 'right' ? 'left' : resolvedSide === 'left' ? 'right' : align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
  const originY = resolvedSide === 'bottom' ? 'top' : resolvedSide === 'top' ? 'bottom' : align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';

  return {
    top: `${top}px`,
    left: `${left}px`,
    transformOrigin: `${originY} ${originX}`,
  };
});

// ── 逻辑控制 ──────────────────────────────────────
let leaveTimer: ReturnType<typeof setTimeout> | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;

const clearLeaveTimer = () => {
  if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
};

const handleTriggerClick = (e: MouseEvent) => {
  if (props.trigger !== 'click') return;
  e.stopPropagation();
  if (!show.value) {
    anchorRect.value = triggerRef.value!.getBoundingClientRect();
    show.value = true;
  } else {
    show.value = false;
  }
};

const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return;
  clearLeaveTimer();
  showTimer = setTimeout(() => {
    if (triggerRef.value) {
      anchorRect.value = triggerRef.value.getBoundingClientRect();
    }
    show.value = true;
  }, 400);
};

const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return;
  if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  leaveTimer = setTimeout(() => { show.value = false; }, 400);
}

const handleWindowClick = (e: MouseEvent) => {
  if (props.trigger !== 'click' || !show.value) return;
  show.value = false;
};

const handleOptionClick = (option: FDropdownOption) => {
  if (option.disabled) return;
  emit('select', option.key, option);
  if (!option.children) show.value = false;
};

// ── 生命周期与事件绑定 ────────────────────────────────
watch(show, async (val) => {
  if (val) {
    anchorRect.value = triggerRef.value!.getBoundingClientRect();
    await nextTick();
    dropdownHeight.value = dropdownRef.value?.offsetHeight || 200;
    dropdownWidth.value = dropdownRef.value?.offsetWidth || 160;
  } else {
    dropdownHeight.value = 0;
    dropdownWidth.value = 0;
  }
});

onUnmounted(() => {
  clearLeaveTimer();
  if (showTimer) clearTimeout(showTimer);
});

useEventListener(window, 'click', handleWindowClick);
</script>

<template>
  <div class="f-dropdown-wrapper">
    <div ref="triggerRef" class="f-dropdown-trigger-wrapper" @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave" @click="handleTriggerClick">
      <slot />
    </div>

    <Teleport to="body">
      <Transition name="f-dropdown-motion">
        <div v-if="show" ref="dropdownRef" class="f-dropdown-item" :style="[dropdownStyle, { zIndex }]"
          @mouseenter="clearLeaveTimer" @mouseleave="handleMouseLeave" @click.stop>
          <div v-if="trigger === 'hover'" class="f-dropdown-bridge" :style="bridgeStyle" />

          <div class="f-dropdown-content">
            <template v-if="options && options.length > 0">
              <div v-for="opt in options" :key="opt.key" class="f-dropdown-option"
                :class="{ 'is-disabled': opt.disabled }" @click="handleOptionClick(opt)">
                <span v-if="opt.icon" class="opt-icon">
                  <component :is="opt.icon" />
                </span>
                <span class="opt-label">{{ opt.label }}</span>
              </div>
            </template>
            <slot v-else name="content" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.f-dropdown-wrapper {
  display: inline-flex;
  align-items: center;
}

.f-dropdown-trigger-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.f-dropdown-item {
  position: fixed;
  pointer-events: auto;
}

.f-dropdown-bridge {
  position: absolute;
  background: transparent;
}

.f-dropdown-content {
  background: var(--surface);
  border-radius: 4px;
  border: 1px solid var(--border);
  box-shadow:
    0 4px 6px -2px var(--shadow, rgba(0, 0, 0, 0.05)),
    0 10px 24px -4px var(--shadow, rgba(0, 0, 0, 0.1));
  padding: 4px;
  min-width: 140px;
  width: fit-content;

  .f-dropdown-option {
    display: flex;
    align-items: center;
    padding: 7px 10px;
    gap: 8px;
    border-radius: calc(var(--radius, 8px) - 4px);
    cursor: pointer;
    color: var(--text-muted);
    font-size: 13px;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover:not(.is-disabled) {
      background: var(--surface3);
      color: var(--text);
    }

    &.is-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .opt-icon {
      display: inline-flex;
      align-items: center;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--text-dim);

      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }

    .opt-label {
      flex: 1;
      white-space: nowrap;
    }
  }
}

// ── 动效 ────────────────────────────────────────────
.f-dropdown-motion-enter-active,
.f-dropdown-motion-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.f-dropdown-motion-enter-from,
.f-dropdown-motion-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
