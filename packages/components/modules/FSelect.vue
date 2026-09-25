<script lang="ts" setup>
import type { FSelectProps } from '@/types';
import { ChevronDownOutline, CloseCircleOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FDropdown from './FDropdown.vue';

const props = withDefaults(defineProps<FSelectProps>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  size: 'medium',
});

const emit = defineEmits<{
  (e: 'select', key: string | number, option: any): void;
  (e: 'change', key: string | number, option: any): void;
  (e: 'clear'): void;
}>();

const modelValue = defineModel<string | number>();

const isOpen = ref(false);
const dropdownRef = ref<InstanceType<typeof FDropdown>>();

const selectedLabel = computed(() => {
  const option = props.options.find(o => o.key === modelValue.value);
  return option?.label ?? props.placeholder;
});

const hasValue = computed(() => {
  return modelValue.value !== undefined && modelValue.value !== null && modelValue.value !== '';
});

const showClear = computed(() => {
  return props.clearable && hasValue.value && !props.disabled;
});

const handleSelect = (key: string | number, option: any) => {
  const oldValue = modelValue.value;
  modelValue.value = key;
  emit('select', key, option);
  
  if (oldValue !== key) {
    emit('change', key, option);
  }
  
  isOpen.value = false;
};

const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  modelValue.value = undefined;
  emit('clear');
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
        'is-disabled': disabled,
        [`f-select--${size}`]: size
      }"
    >
      <span class="f-select__label" :class="{ 'is-placeholder': !hasValue }">
        {{ selectedLabel }}
      </span>
      
      <div class="f-select__suffix">
        <f-icon 
          v-if="showClear" 
          class="f-select__clear"
          @click="handleClear"
        >
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
.f-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 180px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 12px;
  height: 36px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover:not(.is-disabled) {
    border-color: #c0c4cc;
  }

  &.is-open:not(.is-disabled),
  &:focus-within:not(.is-disabled) {
    border-color: #409eff;
    
    .f-select__arrow {
      transform: rotate(180deg);
    }
  }

  &.is-active {
    .f-select__label {
      color: #606266;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;

    .f-select__label,
    .f-select__arrow {
      cursor: not-allowed;
    }
  }

  // Size variants
  &--small {
    height: 32px;
    font-size: 13px;
    
    .f-select__label {
      font-size: 13px;
    }
  }

  &--medium {
    height: 36px;
    font-size: 14px;
  }

  &--large {
    height: 40px;
    font-size: 16px;
    
    .f-select__label {
      font-size: 16px;
    }
  }

  &__label {
    font-size: 14px;
    line-height: 1.5;
    color: #606266;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;

    &.is-placeholder {
      color: #c0c4cc;
    }
  }

  &__suffix {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  &__clear {
    font-size: 14px;
    color: #c0c4cc;
    transition: color 0.2s;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  &__arrow {
    font-size: 14px;
    color: #c0c4cc;
    transition: transform 0.3s, color 0.2s;
  }

  &:hover:not(.is-disabled) &__arrow {
    color: #909399;
  }
}
</style>