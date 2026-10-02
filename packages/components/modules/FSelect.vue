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
@use '../../styles/components/f-select.scss';
</style>

