# FDialog - 对话框

基本用法（受控）：

```vue
<template>
  <FButton @click="open = true">打开对话框</FButton>
  <FDialog v-model:visible="open" title="示例对话框">
    <p>对话框内容</p>
    <template #footer>
      <FButton @click="open = false">取消</FButton>
      <FButton type="primary" @click="confirm">确定</FButton>
    </template>
  </FDialog>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
const confirm = () => {
  // 处理确认逻辑
  open.value = false
}
</script>
```

说明：

- 使用 `v-model:visible` 控制显示/隐藏（示例组件可能使用不同的 prop 名称，请按源码为准）。
- 支持 `title`、插槽 `footer` 等自定义。
