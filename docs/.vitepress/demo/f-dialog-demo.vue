<script setup>
import FDialog from '../../../packages/components/modules/FDialog.vue'
import FButton from '../../../packages/components/modules/FButton.vue'
import { ref } from 'vue'
const open = ref(false)
const confirm = () => { open.value = false }
</script>

<template>
  <div style="padding:12px; background:#fff;">
    <FButton type="primary" @click="open = true">打开对话框</FButton>
    <FDialog v-model:visible="open" title="示例对话框">
      <p>这是对话框内容</p>
      <template #footer>
        <FButton @click="open = false">取消</FButton>
        <FButton type="primary" @click="confirm">确定</FButton>
      </template>
    </FDialog>
  </div>
</template>
