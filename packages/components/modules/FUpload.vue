<script lang="ts" setup>
import type { FUploadProps, UploadFileItem } from '@/types';
import { Close, CloseCircle, CloudUpload, DocumentOutline, CheckmarkCircle, AlertCircle, Reload } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';
import FProgress from './FProgress.vue';


const fileList = defineModel<UploadFileItem[]>('fileList', { default: () => [] });

const props = withDefaults(defineProps<FUploadProps>(), {
  hint: '支持 .xlsx .xls .json .txt',
  autoUpload: true,
});

const emit = defineEmits<{
  change: [file: UploadFileItem];
  progress: [file: UploadFileItem];
  success: [file: UploadFileItem, response: string];
  error: [file: UploadFileItem, error: unknown];
  remove: [file: UploadFileItem];
  exceed: [files: File[]];
}>();

const dragActive = ref(false);
const hoveredUid = ref<string | null>(null);

const genUid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const findItem = (uid: string) => fileList.value.find(f => f.uid === uid);

const updateItem = (uid: string, patch: Partial<UploadFileItem>) => {
  const item = findItem(uid);
  if (item) Object.assign(item, patch);
  return item;
};

const submitUpload = async (item: UploadFileItem) => {
  if (!props.httpRequest) return;
  
  updateItem(item.uid, { status: 'uploading', percentage: 0 });

  try {
    const response = await props.httpRequest(item.raw, (percent) => {
      const current = updateItem(item.uid, { percentage: percent });
      if (current) emit('progress', current);
    });

    const done = updateItem(item.uid, { status: 'success', percentage: 100, response });
    if (done) emit('success', done, response);
  } catch (err: any) {
    const failed = updateItem(item.uid, { status: 'error', errorMessage: err?.message || '上传失败' });
    if (failed) emit('error', failed, err);
  }
};

const addFiles = async (files: File[]) => {
  if (!files.length) return;

  // 数量限制：超出的部分直接拒绝，并抛给外部处理提示
  const remaining = props.limit != null ? props.limit - fileList.value.length : Infinity;
  if (remaining <= 0) {
    emit('exceed', files);
    return;
  }
  const accepted = files.slice(0, remaining);
  const rejected = files.slice(remaining);
  if (rejected.length) emit('exceed', rejected);

  for (const raw of accepted) {
    if (props.beforeUpload) {
      const ok = await props.beforeUpload(raw);
      if (!ok) continue; // 校验未通过：不加入列表，也不触发上传
    }

    const item: UploadFileItem = {
      uid: genUid(),
      name: raw.name,
      status: 'ready',
      percentage: 0,
      raw,
    };
    fileList.value = [...fileList.value, item];
    emit('change', item);

    if (props.autoUpload) submitUpload(item);
  }
};

const retryUpload = (uid: string) => {
  const item = findItem(uid);
  if (item) submitUpload(item);
};

const removeFile = (uid: string) => {
  const item = findItem(uid);
  fileList.value = fileList.value.filter(f => f.uid !== uid);
  if (item) emit('remove', item);
};

const onDragOver = (e: DragEvent) => { e.preventDefault(); dragActive.value = true; };
const onDragLeave = (e: DragEvent) => { e.preventDefault(); dragActive.value = false; };
const onDrop = (e: DragEvent) => {
  e.preventDefault();
  dragActive.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []);
  addFiles(files);
};

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = '';
  addFiles(files);
};

defineExpose({ retryUpload, removeFile, submitAll: () => fileList.value.filter(f => f.status === 'ready').forEach(submitUpload) });
</script>

<template>
  <div class="f-upload">
    <label class="f-upload__trigger" :class="{ 'f-upload--drag': dragActive }" @dragover="onDragOver"
      @dragleave="onDragLeave" @drop="onDrop">
      <input type="file" :accept="accept" :multiple="limit == null || limit > 1" class="f-upload__input"
        @change="onFileChange" />
      <slot>
        <div class="f-upload__zone">
          <f-icon :size="40">
            <CloudUpload />
          </f-icon>
          <span class="f-upload__title">点击或拖拽文件至此处</span>
          <span class="f-upload__hint">{{ hint }}</span>
        </div>
      </slot>
    </label>

    <div v-if="fileList.length" class="f-upload__list">
      <div v-for="item in fileList" :key="item.uid" class="f-upload__file-item"
        :class="`f-upload__file-item--${item.status}`">
        <f-icon>
          <component
            :is="item.status === 'success' ? CheckmarkCircle : item.status === 'error' ? AlertCircle : DocumentOutline" />
        </f-icon>
        <div class="f-upload__file-info">
          <span class="f-upload__file-name">{{ item.name }}</span>
          <f-progress v-if="item.status === 'uploading'" :percent="item.percentage" show-text />
          <span v-else-if="item.status === 'error'" class="f-upload__file-error">{{ item.errorMessage }}</span>
        </div>
        <f-icon v-if="item.status === 'error'" @click.stop="retryUpload(item.uid)" style="cursor: pointer;">
          <Reload />
        </f-icon>
        <f-icon @click.stop="removeFile(item.uid)" @mouseenter="hoveredUid = item.uid" @mouseleave="hoveredUid = null"
          style="cursor: pointer; transition: color 0.2s;">
          <component :is="hoveredUid === item.uid ? CloseCircle : Close" />
        </f-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.f-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__trigger {
    display: inline-block;
    cursor: pointer;
  }

  &__zone {
    height: 11rem;
    width: 100%;
    border: 2px dashed #e2e8f0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
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

  &--drag &__zone {
    border-color: #6366f1;
    background: rgba(238, 242, 255, 0.2);
  }

  &__input {
    display: none;
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

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
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

    &--error {
      background: rgba(254, 226, 226, 0.5);
      border-color: #fecaca;
      color: #b91c1c;
    }

    &--success {
      border-color: #bbf7d0;
    }
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

  &__file-error {
    font-size: 0.6875rem;
    color: #dc2626;
  }
}
</style>