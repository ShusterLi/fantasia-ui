<script lang="ts" setup>
import type { FDropdownOption } from '@/types';
import { ChevronDownOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FDropdown from './FDropdown.vue';

const props = defineProps<{
  options: FDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', key: string | number, option: FDropdownOption): void;
  (e: 'change', key: string | number, option: FDropdownOption): void;
}>();

const modelValue = defineModel<string | number>();

const isOpen = ref(false);
const dropdownRef = ref<InstanceType<typeof FDropdown>>();

const selectedLabel = computed(() => {
  const option = props.options.find(o => o.key === modelValue.value);
  return option?.label ?? (props.placeholder ?? '请选择');
});

const hasValue = computed(() => {
  return modelValue.value !== undefined && modelValue.value !== null && modelValue.value !== '';
});

const handleSelect = (key: string | number, option: FDropdownOption) => {
  const oldValue = modelValue.value;
  modelValue.value = key;
  emit('select', key, option);
  
  // 只有值真正改变时才触发 change 事件
  if (oldValue !== key) {
    emit('change', key, option);
  }
  
  isOpen.value = false;
};
</script>

<template>
  <f-dropdown 
    ref="dropdownRef"
    :options="options" 
    :disabled="disabled"
    trigger="click" 
    @select="handleSelect"
    @show="isOpen = true"
    @hide="isOpen = false"
    placement="bottom" 
    :offset="4"
  >
    <div 
      class="f-select" 
      :class="{ 
        'is-active': hasValue, 
        'is-open': isOpen,
        'is-disabled': disabled 
      }"
    >
      <span class="f-select__label" :class="{ 'is-placeholder': !hasValue }">
        {{ selectedLabel }}
      </span>
      <f-icon class="f-select__arrow">
        <ChevronDownOutline />
      </f-icon>
    </div>
  </f-dropdown>
</template>

<style lang="scss" scoped>
.f-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 120px;
  width: fit-content;
  padding: 8px 12px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius, 8px);
  cursor: pointer;
  user-select: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(.is-disabled) {
    background: var(--surface3);
    border-color: var(--border2);
  }

  &.is-open:not(.is-disabled),
  &:focus-within:not(.is-disabled) {
    background: var(--surface);
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
  }

  &.is-active {
    .f-select__label {
      color: var(--text);
      font-weight: 500;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: var(--surface2);

    .f-select__label,
    .f-select__arrow {
      cursor: not-allowed;
    }
  }

  &__label {
    font-size: 14px;
    line-height: 1.4;
    color: var(--text);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;

    &.is-placeholder {
      color: var(--text-dim);
      font-weight: 400;
    }
  }

  &__arrow {
    font-size: 15px;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &.is-open:not(.is-disabled) &__arrow {
    transform: rotate(180deg);
  }
}
</style>