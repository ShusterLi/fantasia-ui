<script lang="ts" setup>
import type { FSelectProps } from '@/types';
import type { FDropdownOption } from '@/types';
import { useEventListener } from '@vueuse/core';
import {
  ChevronDownOutline,
  CloseCircleOutline,
} from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FTag from './FTag.vue';
import FScrollbar from './FScrollbar.vue';

type SelectKey = string | number;

const props = withDefaults(defineProps<FSelectProps>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  multiple: false,
  filterable: false,
  size: 'medium',
  allowCreate: false,
  showAddOption: false,
  addOptionText: '新增选项',
});

const emit = defineEmits<{
  (e: 'select', key: SelectKey, option: FDropdownOption): void;
  (e: 'change', value: SelectKey | SelectKey[], option: FDropdownOption | FDropdownOption[]): void;
  (e: 'clear'): void;
  (e: 'add', label: string): void;
}>();

const modelValue = defineModel<SelectKey | SelectKey[] | null>();

const isOpen = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const selectRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const keyword = ref('');

/* ---------- 公共 ---------- */
const multiValue = computed<SelectKey[]>(() =>
  Array.isArray(modelValue.value) ? modelValue.value : []
);

const hasValue = computed(() => {
  if (props.multiple) return multiValue.value.length > 0;
  const v = modelValue.value;
  return v !== undefined && v !== null && v !== '';
});

const showClear = computed(() => props.clearable && hasValue.value && !props.disabled);

// 输入筛选后的选项
const filteredOptions = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!props.filterable || !kw) return props.options;
  return props.options.filter(o => String(o.label).toLowerCase().includes(kw));
});

// 下拉面板定位
const dropdownStyle = ref<Record<string, string>>({});

const updateDropdownPosition = () => {
  if (!selectRef.value) return;
  
  const rect = selectRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  // 默认显示在下方
  let top = rect.bottom + 4;
  let maxHeight = '240px';
  
  // 如果下方空间不足，显示在上方
  if (spaceBelow < 240 && spaceAbove > spaceBelow) {
    top = rect.top - 4;
    maxHeight = `${Math.min(spaceAbove - 8, 240)}px`;
  } else {
    maxHeight = `${Math.min(spaceBelow - 8, 240)}px`;
  }
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight,
    zIndex: '2000'
  };
};

// 打开时聚焦输入框，关闭时清空关键字
watch(isOpen, open => {
  if (open) {
    if (props.filterable) nextTick(() => inputRef.value?.focus());
    updateDropdownPosition();
  } else {
    keyword.value = '';
  }
});

/* ---------- 单选 ---------- */
const selectedLabel = computed(() => {
  const option = props.options.find(o => o.key === modelValue.value);
  return option?.label ?? props.placeholder;
});

const handleOptionClick = (option: FDropdownOption) => {
  if (option.disabled) return;
  
  if (props.multiple) {
    // 多选模式
    const keys = [...multiValue.value];
    const index = keys.indexOf(option.key);
    if (index > -1) {
      keys.splice(index, 1);
    } else {
      keys.push(option.key);
    }
    modelValue.value = keys;
    emit('select', option.key, option);
    emit('change', keys, props.options.filter(o => keys.includes(o.key)));
  } else {
    // 单选模式
    const oldValue = modelValue.value;
    modelValue.value = option.key;
    emit('select', option.key, option);
    if (oldValue !== option.key) emit('change', option.key, option);
    isOpen.value = false;
  }
};

const isSelected = (key: SelectKey) => {
  return props.multiple && multiValue.value.includes(key);
};

// 输入框已在展开状态时，点击它不应触发下拉面板的开关
const stopWhenOpen = (e: MouseEvent) => {
  if (isOpen.value) e.stopPropagation();
};

/* ---------- 多选 ---------- */
const selectedOptions = computed(() =>
  props.options.filter(o => multiValue.value.includes(o.key))
);

const removeTag = (key: SelectKey) => {
  if (props.disabled) return;
  const next = multiValue.value.filter(k => k !== key);
  modelValue.value = next;
  emit('change', next, props.options.filter(o => next.includes(o.key)));
};

// 输入框为空时按退格，删除最后一个标签
const handleBackspace = () => {
  if (keyword.value || !multiValue.value.length) return;
  const next = multiValue.value.slice(0, -1);
  modelValue.value = next;
  emit('change', next, props.options.filter(o => next.includes(o.key)));
};

const handleInputClick = () => {
  if (!props.disabled) isOpen.value = true;
};

/* ---------- 清空 ---------- */
const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  modelValue.value = props.multiple ? [] : undefined;
  keyword.value = '';
  emit('clear');
};

/* ---------- 新增选项 ---------- */
// 检查输入内容是否存在于选项中
const isInputInOptions = computed(() => {
  const kw = keyword.value.trim();
  if (!kw) return false;
  return props.options.some(o => o.label === kw);
});

// 处理输入框回车事件，创建新选项
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter' || !props.filterable || !props.allowCreate) return;
  
  const kw = keyword.value.trim();
  if (!kw || isInputInOptions.value) return;
  
  e.preventDefault();
  emit('add', kw);
  
  // 创建新选项并选中
  const newKey = `new_${Date.now()}`;
  const newOption: FDropdownOption = { key: newKey, label: kw };
  
  if (props.multiple) {
    // 多选模式：添加到选中列表
    const next = [...multiValue.value, newKey];
    modelValue.value = next;
    emit('select', newKey, newOption);
    emit('change', next, [...props.options, newOption]);
  } else {
    // 单选模式：选中新选项
    modelValue.value = newKey;
    emit('select', newKey, newOption);
    emit('change', newKey, newOption);
    isOpen.value = false;
  }
  
  // 清空输入
  keyword.value = '';
};

// 处理新增选项按钮点击
const handleAddOption = () => {
  if (!props.showAddOption) return;
  
  // 触发add事件，由父组件处理新增逻辑
  emit('add', keyword.value.trim());
};

/* ---------- 点击外部关闭 ---------- */
const handleWindowClick = (e: MouseEvent) => {
  if (!isOpen.value) return;
  
  const target = e.target as HTMLElement;
  if (
    selectRef.value?.contains(target) ||
    dropdownRef.value?.contains(target)
  ) {
    return;
  }
  
  isOpen.value = false;
};

useEventListener(window, 'click', handleWindowClick);
useEventListener(window, 'resize', updateDropdownPosition);
useEventListener(window, 'scroll', updateDropdownPosition, true);
</script>

<template>
  <div ref="selectRef" class="f-select-wrapper">
    <div 
      class="f-select" 
      :class="{
        'is-active': hasValue,
        'is-open': isOpen,
        'is-disabled': disabled,
        'is-clearable': showClear,
        'is-multiple': multiple,
        [`f-select--${size}`]: size,
      }"
      @click="!disabled && (isOpen = !isOpen)"
    >
      <!-- 多选：标签展示 -->
      <div v-if="multiple" class="f-select__tags">
        <f-tag 
          v-for="opt in selectedOptions" 
          :key="opt.key"
          color="pink"
          size="small"
          :closable="!disabled"
          class="f-select__tag"
          @close="removeTag(opt.key)"
        >
          {{ opt.label }}
        </f-tag>
        <input 
          v-if="filterable" 
          ref="inputRef" 
          v-model="keyword" 
          class="f-select__input is-multiple"
          :placeholder="selectedOptions.length ? '' : placeholder" 
          :disabled="disabled" 
          @click.stop="handleInputClick"
          @input="isOpen = true" 
          @keydown.delete="handleBackspace" 
          @keydown.enter="handleKeydown"
          @keydown.esc="isOpen = false" 
        />
        <span v-else-if="!selectedOptions.length" class="f-select__label is-placeholder">{{ placeholder }}</span>
      </div>

      <!-- 单选：输入框或文本 -->
      <template v-else>
        <input 
          v-if="filterable && isOpen" 
          ref="inputRef" 
          v-model="keyword" 
          class="f-select__input"
          :class="{ 'has-value': hasValue }" 
          :placeholder="hasValue ? selectedLabel : placeholder"
          @click="stopWhenOpen" 
          @keydown.enter="handleKeydown"
        />
        <span v-else class="f-select__label" :class="{ 'is-placeholder': !hasValue }">
          {{ selectedLabel }}
        </span>
      </template>

      <div class="f-select__suffix">
        <f-icon v-if="showClear" class="f-select__clear" @click="handleClear">
          <CloseCircleOutline />
        </f-icon>
        <f-icon class="f-select__arrow">
          <ChevronDownOutline />
        </f-icon>
      </div>
    </div>

    <!-- 下拉面板 -->
    <Teleport to="body">
      <Transition name="f-select-dropdown">
        <div 
          v-if="isOpen"
          ref="dropdownRef"
          class="f-select-dropdown"
          :style="dropdownStyle"
          @click.stop
        >
          <f-scrollbar :max-height="dropdownStyle.maxHeight">
            <div class="f-select-dropdown__content">
              <!-- 选项列表 -->
              <div
                v-for="opt in filteredOptions"
                :key="opt.key"
                class="f-select-option"
                :class="{
                  'is-disabled': opt.disabled,
                  'is-selected': isSelected(opt.key)
                }"
                @click="handleOptionClick(opt)"
              >
                <span class="f-select-option__label">{{ opt.label }}</span>
              </div>
              
              <!-- 空状态 -->
              <div v-if="filteredOptions.length === 0" class="f-select-option is-empty">
                暂无数据
              </div>
            </div>
            
            <!-- 新增选项按钮 -->
            <div v-if="showAddOption" class="f-select__add-option" @click="handleAddOption">
              {{ addOptionText }}
            </div>
          </f-scrollbar>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-select.scss';
</style>