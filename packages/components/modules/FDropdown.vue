<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { FDropdownProps, FDropdownOption } from '@/types';
import { useEventListener } from '@vueuse/core';
import FScrollbar from './FScrollbar.vue';
import FCheckbox from './FCheckbox.vue';

const props = withDefaults(defineProps<FDropdownProps>(), {
  trigger: 'hover',
  placement: 'right-start',
  offset: 12,
  zIndex: 2000,
  options: () => [],
  disabled: false,
  multiple: false,
  modelValue: () => [],
  maxHeight: '300px',
});

const emit = defineEmits<{
  select: [key: string | number, option: FDropdownOption];
  show: [];
  hide: [];
  'update:modelValue': [value: (string | number)[]];
}>();

const selectedKeys = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
});

const show = ref(false);
const anchorRect = ref<DOMRect | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownHeight = ref(0);
const dropdownWidth = ref(0);

// 这里的包装层是 display: contents，原生元素没有实际 rect，取值会为 0，
// 因此需要改为取第一个实际节点作为定位锚点
const getAnchorRect = (): DOMRect | null => {
  const root = triggerRef.value;
  if (!root) return null;
  const el = (root.firstElementChild as HTMLElement | null) ?? root;
  return el.getBoundingClientRect();
};

// 定位计算
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

// 组件交互逻辑
let leaveTimer: ReturnType<typeof setTimeout> | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;

const clearLeaveTimer = () => {
  if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
};

const handleTriggerClick = (e: MouseEvent) => {
  if (props.trigger !== 'click' || props.disabled) return;
  e.stopPropagation();
  if (!show.value) {
    anchorRect.value = getAnchorRect();
    show.value = true;
  } else {
    show.value = false;
  }
};

const handleMouseEnter = () => {
  if (props.trigger !== 'hover' || props.disabled) return;
  clearLeaveTimer();
  showTimer = setTimeout(() => {
    anchorRect.value = getAnchorRect();
    show.value = true;
  }, 400);
};

const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return;
  if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  leaveTimer = setTimeout(() => { show.value = false; }, 400);
};

const handleWindowClick = () => {
  if (props.trigger !== 'click' || !show.value) return;
  show.value = false;
};

const handleOptionClick = (option: FDropdownOption) => {
  if (option.disabled) return;
  
  if (props.multiple) {
    const keys = [...selectedKeys.value];
    const index = keys.indexOf(option.key);
    if (index > -1) {
      keys.splice(index, 1);
    } else {
      keys.push(option.key);
    }
    selectedKeys.value = keys;
  }
  
  emit('select', option.key, option);
  
  // 多选模式下不关闭，单选且无子菜单时关闭
  if (!props.multiple && !option.children) {
    show.value = false;
  }
};

const isSelected = (key: string | number) => {
  return props.multiple && selectedKeys.value.includes(key);
};

// 监听外部事件与点击
watch(show, async (val) => {
  if (val) {
    anchorRect.value = getAnchorRect();
    await nextTick();
    dropdownHeight.value = dropdownRef.value?.offsetHeight || 200;
    dropdownWidth.value = dropdownRef.value?.offsetWidth || 160;
    emit('show');
  } else {
    dropdownHeight.value = 0;
    dropdownWidth.value = 0;
    emit('hide');
  }
});

onUnmounted(() => {
  clearLeaveTimer();
  if (showTimer) clearTimeout(showTimer);
});

useEventListener(window, 'click', handleWindowClick);
</script>

<template>
  <div ref="triggerRef" class="f-dropdown-trigger-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
    @click="handleTriggerClick">
    <slot />

    <Teleport to="body">
      <Transition name="f-dropdown-motion">
        <div v-if="show" ref="dropdownRef" class="f-dropdown-item" :style="[dropdownStyle, { zIndex }]"
          @mouseenter="clearLeaveTimer" @mouseleave="handleMouseLeave" @click.stop>
          <div v-if="trigger === 'hover'" class="f-dropdown-bridge" :style="bridgeStyle" />

          <f-scrollbar :max-height="maxHeight" class="f-dropdown-scrollbar">
            <div class="f-dropdown-content">
              <template v-if="options && options.length > 0">
                <div v-for="opt in options" :key="opt.key" class="f-dropdown-option"
                  :class="{ 'is-disabled': opt.disabled, 'is-selected': isSelected(opt.key) }" 
                  @click="handleOptionClick(opt)">
                  <f-checkbox 
                    v-if="multiple" 
                    :model-value="isSelected(opt.key)" 
                    :disabled="opt.disabled"
                    class="opt-checkbox"
                  />
                  <span v-if="opt.icon && !multiple" class="opt-icon">
                    <component :is="opt.icon" />
                  </span>
                  <span class="opt-label">{{ opt.label }}</span>
                </div>
              </template>

              <slot v-else name="content" />
            </div>
            <slot name="footer" />
          </f-scrollbar>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-dropdown.scss';
</style>
