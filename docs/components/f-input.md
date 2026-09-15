# FInput - 输入框

基本用法：

```vue
<template>
  <FInput v-model="value" placeholder="请输入内容" />
  <p>当前值：{{ value }}</p>
</template>

<script setup>
import { ref } from 'vue'
// import { FInput } from 'fantasia-ui'
const value = ref('')
</script>
```

Props（常用）：

- `modelValue` / `v-model`：绑定值。
- `placeholder`：占位文本。
- `disabled`：禁用输入。

事件：

- `update:modelValue`：值变化事件。

样式与表单结合示例可在组件页补充。
