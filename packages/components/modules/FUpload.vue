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

  // 数量限制：超出的部分直接拒绝,并抛给外部处理提示
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
      if (!ok) continue; // 校验未通过:不加入列表,也不触发上传
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

defineExpose({ 
  /** 重试上传单个失败的文件 */
  retryUpload, 
  /** 移除文件 */
  removeFile, 
  /** 批量上传所有 ready 状态的文件 */
  submitAll: () => {
    fileList.value
      .filter(f => f.status === 'ready')
      .forEach(item => submitUpload(item));
  }
});
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
  gap: 12px;

  &__trigger {
    display: inline-block;
    cursor: pointer;
  }

  &__zone {
    height: 180px;
    width: 100%;
    border: 2px dashed #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    transition: all 0.2s;

    &:hover {
      border-color: #ec4899;
      background: rgba(236, 72, 153, 0.05);
    }
  }

  &--drag &__zone {
    border-color: #ec4899;
    background: rgba(236, 72, 153, 0.1);
  }

  &__input {
    display: none;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #606266;
    margin-top: 8px;
  }

  &__hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fdf2f8;
    border: 1px solid #fce7f3;
    border-radius: 4px;
    font-size: 14px;
    color: #ec4899;
    transition: all 0.2s;

    &--uploading {
      background: #fdf2f8;
      border-color: #fce7f3;
      color: #ec4899;
    }

    &--error {
      background: #fef0f0;
      border-color: #fde2e2;
      color: #f56c6c;
    }

    &--success {
      background: #f0f9ff;
      border-color: #e1f3d8;
      color: #67c23a;
    }
  }

  &__file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  &__file-name {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__file-error {
    font-size: 12px;
    color: #f56c6c;
  }
}
</style>
