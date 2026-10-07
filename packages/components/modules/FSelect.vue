<script lang="ts" setup>
import type { FSelectProps } from '@/types';
import type { FDropdownOption } from '@/types';
import {
  ChevronDownOutline,
  CloseCircleOutline,
} from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FDropdown from './FDropdown.vue';
import FTag from './FTag.vue';

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
const keyword = ref('');
const dropdownValue = ref<SelectKey[]>([]);

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

// 打开时聚焦输入框，关闭时清空关键字
watch(isOpen, open => {
  if (open) {
    if (props.filterable) nextTick(() => inputRef.value?.focus());
    // 同步到 dropdown 的 modelValue
    if (props.multiple) {
      dropdownValue.value = [...multiValue.value];
    }
  } else {
    keyword.value = '';
  }
});

/* ---------- 单选 ---------- */
const selectedLabel = computed(() => {
  const option = props.options.find(o => o.key === modelValue.value);
  return option?.label ?? props.placeholder;
});

const handleSelect = (key: SelectKey, option: FDropdownOption) => {
  if (props.multiple) {
    // 多选：通过 dropdown 的 v-model 同步
    const next = [...dropdownValue.value];
    modelValue.value = next;
    emit('select', key, option);
    emit('change', next, props.options.filter(o => next.includes(o.key)));
  } else {
    // 单选
    const oldValue = modelValue.value;
    modelValue.value = key;
    emit('select', key, option);
    if (oldValue !== key) emit('change', key, option);
    isOpen.value = false;
  }
};

// 输入框已在展开状态时，点击它不应触发 dropdown 的开关
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
  dropdownValue.value = next;
  emit('change', next, props.options.filter(o => next.includes(o.key)));
};

// 输入框为空时按退格，删除最后一个标签
const handleBackspace = () => {
  if (keyword.value || !multiValue.value.length) return;
  const next = multiValue.value.slice(0, -1);
  modelValue.value = next;
  dropdownValue.value = next;
  emit('change', next, props.options.filter(o => next.includes(o.key)));
};

const handleInputClick = () => {
  if (!props.disabled) isOpen.value = true;
};

/* ---------- 清空 ---------- */
const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  modelValue.value = props.multiple ? [] : undefined;
  dropdownValue.value = [];
  keyword.value = '';
  emit('clear');
};

const handleShow = () => {
  isOpen.value = true;
};

const handleHide = () => {
  isOpen.value = false;
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
    const next = [...dropdownValue.value, newKey];
    dropdownValue.value = next;
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
</script>

<template>
  <f-dropdown 
    :options="filteredOptions" 
    :disabled="disabled" 
    :multiple="multiple"
    v-model="dropdownValue"
    trigger="click" 
    placement="bottom-start" 
    :offset="4"
    max-height="240px"
    @select="handleSelect"
    @show="handleShow" 
    @hide="handleHide"
  >
    <template #footer>
      <div v-if="showAddOption" class="f-select__add-option" @click="handleAddOption">
        {{ addOptionText }}
      </div>
    </template>
    
    <div class="f-select" :class="{
      'is-active': hasValue,
      'is-open': isOpen,
      'is-disabled': disabled,
      'is-clearable': showClear,
      'is-multiple': multiple,
      [`f-select--${size}`]: size,
    }">
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
  </f-dropdown>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-select.scss';
</style>