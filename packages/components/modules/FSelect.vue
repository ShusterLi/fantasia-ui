<script lang="ts" setup>
import type { FDropdownOption } from '@/types';
import { ChevronDownOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FDropdown from './FDropdown.vue';

const props = defineProps<{
  options: FDropdownOption[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'select', key: string | number, option: FDropdownOption): void;
}>();

const modelValue = defineModel<string | number>();

const isOpen = ref(false);

const selectedLabel = computed(() =>
  props.options.find(o => o.key === modelValue.value)?.label ?? (props.placeholder ?? '请选择')
);

const hasValue = computed(() => modelValue.value !== undefined && modelValue.value !== '');

const handleSelect = (key: string | number, option: FDropdownOption) => {
  modelValue.value = key;
  emit('select', key, option);
  isOpen.value = false;
};

const handleDropdownShow = (val: boolean) => {
  isOpen.value = val;
};
</script>

<template>
  <f-dropdown :options="options" trigger="click" @select="handleSelect" @show="handleDropdownShow(true)"
    @hide="handleDropdownShow(false)" placement="bottom" :offset="4">
    <div class="f-select" :class="{ 'is-active': hasValue, 'is-open': isOpen }">
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
  min-width: 100px;
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

  &:hover {
    background: var(--surface3);
    border-color: var(--border2);
  }

  &.is-open,
  &:focus-within {
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
    }
  }

  &__arrow {
    font-size: 15px;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &.is-open &__arrow {
    transform: rotate(180deg);
  }
}
</style>