# 快速开始

## 安装

```bash
npm install fantasia-ui
# 或
yarn add fantasia-ui
# 或
pnpm add fantasia-ui
```

## 使用

### 完整导入

```typescript
import { createApp } from 'vue'
import FantasiaUI from 'fantasia-ui'
import 'fantasia-ui/dist/fantasia-ui.css'

createApp(App).use(FantasiaUI).mount('#app')
```

### 按需导入

```typescript
import { FButton, FInput } from 'fantasia-ui'

// 在你的组件中使用
<template>
  <FButton type="primary">按钮</FButton>
  <FInput placeholder="请输入" />
</template>
```

## 开发

```bash
# 克隆项目
git clone https://github.com/ShusterLi/fantasia-ui.git
cd fantasia-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建
pnpm run build
```
