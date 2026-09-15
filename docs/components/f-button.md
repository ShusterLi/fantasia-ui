# FButton - 按钮

基本用法：

```vue
<template>
  <div>
    <FButton type="primary" @click="onClick">主要按钮</FButton>
    <FButton>默认按钮</FButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 按需导入或全局注册，示例：
// import { FButton } from 'fantasia-ui'

const onClick = () => {
  alert('clicked')
}
</script>
```

Props（常用）：

- `type`：按钮类型，`primary` / `default` / `danger` 等。
- `disabled`：是否禁用。

更多示例和 API 请查看源码组件定义。
