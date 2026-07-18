<script lang="ts" setup>
import type { FInputProps } from '@/types';
import { Search } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<FInputProps>(), {
  placeholder: '输入...',
  type: 'text',
  disabled: false,
  readonly: false,
  name: '',
  id: ''
})

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('input', value)
}

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<template>
  <div class="f-input" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <f-icon class="f-input__icon">
      <Search />
    </f-icon>
    <input class="f-input__text" v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled"
      :readonly="readonly" :name="name" :id="id" @input="handleInput" @change="handleChange" @focus="handleFocus"
      @blur="handleBlur" />
  </div>
</template>

<style lang="scss" scoped>
.f-input {
  flex: 1;
  position: relative;

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .f-input__text {
      cursor: not-allowed;
    }
  }

  &.is-readonly {
    .f-input__text {
      cursor: default;
      background-color: var(--surface-muted, #f5f5f5);
    }
  }

  .f-input__text {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px 12px 44px;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color .2s;

    &::placeholder {
      color: var(--text-dim)
    }

    &:focus {
      border-color: rgba(192, 132, 252, .3)
    }

    &:disabled {
      background: var(--surface-disabled, #f9f9f9);
      cursor: not-allowed;
    }
  }

  .f-input__icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    pointer-events: none;
  }
}
</style>