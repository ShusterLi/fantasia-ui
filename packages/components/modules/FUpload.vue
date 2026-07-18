<script lang="ts" setup>
import { Close, CloseCircle, CloudUpload, DocumentOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FProgress from './FProgress.vue';

const file = defineModel<string>('file', { default: '' });

const props = defineProps<{
  accept?: string;
  limit?: number;
  progress?: number | null;
}>();

const emit = defineEmits<{
  change: [file: File];
  exceed: [file: File];
}>();

const dragActive = ref(false);
const isCloseHover = ref(false);

const clearFile = () => { file.value = ''; };

const onDragOver = (e: DragEvent) => { e.preventDefault(); dragActive.value = true; };
const onDragLeave = (e: DragEvent) => { e.preventDefault(); dragActive.value = false; };
const onDrop = (e: DragEvent) => {
  e.preventDefault();
  dragActive.value = false;
  const f = e.dataTransfer?.files?.[0];
  if (!f) return;
  if (props.limit && f.size > props.limit) {
    emit('exceed', f);
    return;
  }
  emit('change', f);
};

const onFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  if (props.limit && f.size > props.limit) {
    emit('exceed', f);
    return;
  }
  emit('change', f);
};
</script>

<template>
  <div class="f-upload">
    <div class="f-upload__zone" :class="{ 'f-upload--drag': dragActive }" @dragover="onDragOver"
      @dragleave="onDragLeave" @drop="onDrop">
      <label class="f-upload__label">
        <input type="file" :accept="accept" class="f-upload__input" @change="onFileChange" />
        <slot>
          <f-icon :size="40">
            <CloudUpload />
          </f-icon>
          <span class="f-upload__title">点击或拖拽文件至此处</span>
          <span class="f-upload__hint">支持 .xlsx .xls .json .txt</span>
        </slot>
      </label>
    </div>

    <div v-if="file" class="f-upload__file-item">
      <f-icon>
        <DocumentOutline />
      </f-icon>
      <div class="f-upload__file-info">
        <span class="f-upload__file-name">{{ file }}</span>
        <f-progress v-if="progress != null" :percent="progress" show-text />
      </div>
      <f-icon @click.stop="clearFile" @mouseenter="isCloseHover = true" @mouseleave="isCloseHover = false"
        style="cursor: pointer; transition: color 0.2s;">
        <component :is="isCloseHover ? CloseCircle : Close" />
      </f-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.f-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__zone {
    height: 11rem;
    border: 2px dashed #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    text-align: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #818cf8;
      background: rgba(248, 250, 252, 0.3);
    }
  }

  &--drag {
    border-color: #6366f1;
    background: rgba(238, 242, 255, 0.2);
  }

  &__input {
    display: none;
  }

  &__label {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  &__title {
    font-size: 0.75rem;
    font-weight: 700;
    color: #334155;
  }

  &__hint {
    font-size: 0.625rem;
    font-weight: 700;
    color: #94a3b8;
    margin-top: 0.25rem;
    line-height: 1.4;
  }

  &__file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(238, 242, 255, 0.5);
    border: 1px solid #e0e7ff;
    border-radius: 6px;
    font-size: 0.75rem;
    color: #4338ca;
  }

  &__file-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  &__file-name {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
