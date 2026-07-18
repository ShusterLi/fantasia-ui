# Fantasia UI

<p align="center">
  <img src="https://img.shields.io/npm/v/fantasia-ui" alt="npm version">
  <img src="https://img.shields.io/npm/dm/fantasia-ui" alt="npm downloads">
  <img src="https://img.shields.io/npm/l/fantasia-ui" alt="license">
  <img src="https://img.shields.io/badge/vue-3.x-brightgreen.svg" alt="vue3">
</p>

<p align="center">
  一个基于 Vue 3 + TypeScript 的现代化 UI 组件库
</p>

<p align="center">
  <a href="./README.en.md">English</a> | 简体中文
</p>

## ✨ 特性

- 🎨 **现代化设计** - 简洁优雅的设计风格
- 🔧 **TypeScript** - 完整的类型定义支持
- 📦 **按需加载** - 支持 Tree Shaking，减小打包体积
- ⚡ **Vue 3** - 基于 Vue 3 Composition API
- 🎯 **开箱即用** - 丰富的组件，满足日常开发需求
- 📱 **响应式** - 移动端友好的交互体验

## 📦 安装

```bash
# npm
npm install fantasia-ui

# yarn
yarn add fantasia-ui

# pnpm
pnpm add fantasia-ui
```

### 可选依赖

如果你需要使用图标组件，需要额外安装：

```bash
# 安装图标库（可选）
npm install @vicons/ionicons5

# 如果使用了 VueUse 相关功能（可选）
npm install @vueuse/core
```

## 🔨 快速开始

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import FantasiaUI, { install } from 'fantasia-ui'
import 'fantasia-ui/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(install)
app.mount('#app')
```

### 按需引入

```vue
<script setup lang="ts">
import { FButton, FInput } from 'fantasia-ui'
import 'fantasia-ui/dist/index.css'
</script>

<template>
  <FButton type="primary">按钮</FButton>
  <FInput v-model="value" placeholder="请输入" />
</template>
```

## 📚 组件列表

### 基础组件
- **FButton** - 按钮
- **FIcon** - 图标
- **FText** - 文本
- **FLink** - 链接
- **FTypography** - 排版

### 布局组件
- **FContainer** - 容器
- **FRow** - 行
- **FCol** - 列
- **FSpace** - 间距
- **FDivider** - 分割线

### 数据展示
- **FCard** - 卡片
- **FImage** - 图片
- **FAvatar** - 头像
- **FBadge** - 徽章
- **FTag** - 标签
- **FProgress** - 进度条
- **FRate** - 评分
- **FBreadcrumb** - 面包屑

### 表单组件
- **FInput** - 输入框
- **FSelect** - 选择器
- **FUpload** - 上传

### 数据组件
- **FPagination** - 分页
- **FTabs** - 标签页

### 反馈组件
- **FLoading** - 加载
- **FTooltip** - 提示
- **FSliderCaptcha** - 滑块验证

### 其他
- **FDropdown** - 下拉菜单
- **FAffix** - 固钉

## 📝 使用示例

### 按钮组件

```vue
<script setup lang="ts">
import { FButton } from 'fantasia-ui'

const handleClick = () => {
  console.log('clicked!')
}
</script>

<template>
  <FButton type="primary" @click="handleClick">
    主要按钮
  </FButton>
  <FButton type="success">成功按钮</FButton>
  <FButton type="warning">警告按钮</FButton>
  <FButton type="danger">危险按钮</FButton>
</template>
```

### 上传组件

```vue
<script setup lang="ts">
import { FUpload } from 'fantasia-ui'

const handleUpload = (file: File, done: () => void, error: (err: any) => void) => {
  try {
    // 上传逻辑
    console.log('上传文件:', file)
    done()
  } catch (err) {
    error(err)
  }
}
</script>

<template>
  <FUpload 
    crop 
    mosaic 
    @upload="handleUpload" 
  />
</template>
```

### 分页组件

```vue
<script setup lang="ts">
import { FPagination } from 'fantasia-ui'
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('当前页:', page)
}
</script>

<template>
  <FPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    @change="handlePageChange"
  />
</template>
```

### 布局组件

```vue
<script setup lang="ts">
import { FRow, FCol, FSpace } from 'fantasia-ui'
</script>

<template>
  <!-- 栅格布局 -->
  <FRow :gutter="20">
    <FCol :span="12">列 1</FCol>
    <FCol :span="12">列 2</FCol>
  </FRow>

  <!-- 间距布局 -->
  <FSpace direction="horizontal" :size="16">
    <FButton>按钮 1</FButton>
    <FButton>按钮 2</FButton>
    <FButton>按钮 3</FButton>
  </FSpace>
</template>
```

### 消息提示和通知

```vue
<script setup lang="ts">
import { FMessage, FNotification } from 'fantasia-ui'

// 消息提示
const showMessage = () => {
  FMessage.success('操作成功！')
}

// 通知
const showNotification = () => {
  FNotification({
    title: '系统通知',
    message: '您有一条新消息',
    type: 'info'
  })
}

// 在异步操作中使用
const handleSubmit = async () => {
  try {
    await submitForm()
    FMessage.success('提交成功！')
  } catch (error) {
    FMessage.error('提交失败，请重试')
  }
}
</script>

<template>
  <div>
    <FButton @click="showMessage">显示消息</FButton>
    <FButton @click="showNotification">显示通知</FButton>
    <FButton @click="handleSubmit">提交表单</FButton>
  </div>
</template>
```

> 💡 查看完整的 FMessage 和 FNotification API 文档：[使用指南](./MESSAGE_USAGE.md)

## 🎨 主题定制

组件库支持 CSS 变量自定义主题：

```css
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
}
```

## 📝 TypeScript 支持

Fantasia UI 提供完整的 TypeScript 类型定义：

```vue
<script setup lang="ts">
import { FButton } from 'fantasia-ui'

// TypeScript 会自动推断 props 类型
// 无需手动导入 FButtonProps
</script>

<template>
  <FButton variant="primary" size="large">
    按钮
  </FButton>
</template>
```

### 如果需要组件 Props 类型

可以使用 TypeScript 工具类型从组件推断：

```typescript
import { FButton } from 'fantasia-ui'
import type { ComponentProps } from 'vue'

// 从组件推断 props 类型
type FButtonProps = ComponentProps<typeof FButton>

const buttonProps: FButtonProps = {
  variant: 'primary',
  size: 'large'
}
```

### Volar / IDE 类型提示

如果编辑器无法提示组件属性，请参考 [类型支持文档](./TYPE_SUPPORT.md) 进行配置。

**快速配置（全局注册）：**

在 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "types": ["fantasia-ui/global"]
  }
}
```

或在 `src/env.d.ts` 中添加：

```typescript
/// <reference types="fantasia-ui/global" />
```

## 🔗 相关链接

- [更新日志（中文）](./CHANGELOG.zh-CN.md)
- [更新日志（English）](./CHANGELOG.md)
- [类型支持文档](./TYPE_SUPPORT.md)
- [优化报告](./OPTIMIZATION.md)
- [构建问题解决方案](./BUILD_FIX.md)
- [贡献指南](./CONTRIBUTING.md)
- [发布指南](./.github/PUBLISH_GUIDE.md)
- [问题反馈](https://github.com/ShusterLi/fantasia-ui/issues)

## 📄 开源协议

[MIT](./LICENSE) License © 2026 Shuster

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！
