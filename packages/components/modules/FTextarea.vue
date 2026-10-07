<script setup lang="ts">
import type { FTextareaProps } from '@/types';

const modelValue = defineModel<string>({ default: '' });
const props = withDefaults(defineProps<FTextareaProps>(), {
  disabled: false,
  showCount: false,
  resize: 'vertical',
  autosize: false,
});

const formItemContext = inject<{ errorMsg: Ref<string>, validate: () => void } | null>('FFormItemContext', null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const hasError = computed(() => !!formItemContext?.errorMsg?.value);

const currentLength = computed(() => modelValue.value.length);

const countText = computed(() => {
  if (!props.showCount) return '';
  if (props.maxlength) {
    return `${currentLength.value} / ${props.maxlength}`;
  }
  return `${currentLength.value}`;
});

const textareaStyle = computed(() => {
  const style: Record<string, string> = {
    resize: props.resize,
  };
  
  if (props.minRows) {
    style.minHeight = `${props.minRows * 1.5 + 1.4}em`;
  }
  
  if (props.maxRows) {
    style.maxHeight = `${props.maxRows * 1.5 + 1.4}em`;
  }
  
  return style;
});

const calcAutoHeight = () => {
  if (!props.autosize || !textareaRef.value) return;
  
  const textarea = textareaRef.value;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const onInput = (e: Event) => {
  modelValue.value = (e.target as HTMLTextAreaElement).value;
  if (props.autosize) {
    nextTick(() => calcAutoHeight());
  }
};

const onBlur = () => {
  isFocused.value = false;
  formItemContext?.validate();
};

const onFocus = () => {
  isFocused.value = true;
};

watch(() => modelValue.value, () => {
  if (props.autosize) {
    nextTick(() => calcAutoHeight());
  }
});

onMounted(() => {
  if (props.autosize) {
    calcAutoHeight();
  }
});
</script>

<template>
  <div class="f-textarea" :class="{
    'is-focus': isFocused,
    'is-error': hasError,
    'is-disabled': disabled,
    'has-count': showCount,
  }">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :style="textareaStyle"
      class="f-textarea__inner"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />
    
    <div v-if="showCount" class="f-textarea__count">
      {{ countText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-textarea.scss';
</style>
