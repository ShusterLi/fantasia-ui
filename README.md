# Fantasia UI

<div align="center">
一个基于 Vue 3 + TypeScript 的现代化 UI 组件库，提供 60+ 个高质量组件
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/fantasia-ui.svg)](https://www.npmjs.com/package/fantasia-ui)
[![npm downloads](https://img.shields.io/npm/dm/fantasia-ui.svg)](https://www.npmjs.com/package/fantasia-ui)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/vue-3.3+-green.svg)](https://vuejs.org/)

</div>

## ✨ 特性

- **现代化的设计** - 简洁优雅的设计语言，支持深色/浅色主题
- **完整的 TypeScript 支持** - 提供完整的类型定义和智能提示
- **高性能** - 基于 Vue 3 组合式 API，组件按需加载
- **响应式设计** - 完美适配桌面端和移动端
- **可定制性** - 支持主题定制、组件样式覆盖
- **丰富的组件库** - 60+ 个高质量的 Vue 3 组件
- **完善的文档** - 详细的 API 文档和使用示例
- **活跃的维护** - 持续更新，及时修复问题

## 📦 安装

### NPM 安装

```bash
npm install fantasia-ui
```

### Yarn 安装

```bash
yarn add fantasia-ui
```

### PNPM 安装

```bash
pnpm add fantasia-ui
```

## 🚀 快速开始

### 完整导入

```typescript
// main.ts
import { createApp } from 'vue'
import FantasiaUI from 'fantasia-ui'
import 'fantasia-ui/dist/fantasia-ui.css'

const app = createApp(App)
app.use(FantasiaUI)
app.mount('#app')
```

### 按需导入

```typescript
// 在你的 Vue 组件中
import { FButton, FInput, FSelect } from 'fantasia-ui'
import 'fantasia-ui/dist/fantasia-ui.css'

export default {
  components: {
    FButton,
    FInput,
    FSelect
  }
}
```

### Vite 项目配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

## 📚 组件列表

### 基础组件
- **FButton** - 按钮
- **FInput** - 输入框
- **FSelect** - 选择器（支持新增选项功能）
- **FCheckbox** - 复选框
- **FRadio** - 单选框
- **FSlider** - 滑动输入条
- **FInputNumber** - 数字输入框
- **FColorPicker** - 颜色选择器
- **FDatePicker** - 日期选择器
- **FTimePicker** - 时间选择器

### 布局组件
- **FContainer** - 布局容器
- **FGrid** - 栅格布局
- **FRow** / **FCol** - 行/列
- **FDivider** - 分割线
- **FSpace** - 间距
- **FScrollbar** - 滚动条

### 数据展示
- **FCard** - 卡片
- **FTag** - 标签
- **FBadge** - 徽章
- **FTable** - 表格
- **FTimeline** - 时间轴
- **FEmpty** - 空状态
- **FResult** - 结果页
- **FImage** - 图片
- **FAvatar** - 头像
- **FList** - 列表

### 反馈组件
- **FDialog** - 对话框
- **FDrawer** - 抽屉
- **FMessage** - 消息提示
- **FNotification** - 通知
- **FLoading** - 加载中
- **FAlert** - 警告提示
- **FPopover** - 气泡卡片
- **FTooltip** - 文字提示
- **FPopconfirm** - 气泡确认框

### 导航组件
- **FDropdown** - 下拉菜单
- **FTabs** - 标签页
- **FBreadcrumb** - 面包屑
- **FMenu** - 菜单
- **FAffix** - 固钉
- **FPagination** - 分页
- **FSteps** - 步骤条

### 其他组件
- **FUpload** - 文件上传
- **FIcon** - 图标
- **FCollapse** - 折叠面板（支持新增面板功能）
- **FCarousel** - 走马灯
- **FEditor** - 富文本编辑器
- **FMask** - 遮罩层
- **FSliderCaptcha** - 滑块验证码
- **FCrop** - 图片裁剪

## 🔧 新增功能亮点

### FSelect 新增选项功能

Fantasia UI 的 FSelect 组件支持两种新增选项模式：

#### 1. 输入时新增（allowCreate）

```vue
<template>
  <FSelect 
    :options="options"
    filterable
    allow-create
    placeholder="输入内容后按回车新增选项"
    @add="handleAddOption"
  />
</template>

<script setup>
const options = ref([
  { key: '1', label: '选项1' },
  { key: '2', label: '选项2' }
])

function handleAddOption(label) {
  const newKey = `new_${Date.now()}`
  const newOption = { key: newKey, label }
  options.value.push(newOption)
}
</script>
```

#### 2. 新增按钮模式（showAddOption）

```vue
<template>
  <FSelect 
    :options="options"
    show-add-option
    add-option-text="添加新选项"
    @add="handleAddOption"
  />
</template>
```

### FCollapse 新增面板功能

```vue
<template>
  <FCollapse 
    show-add-button
    add-button-position="bottom"
    add-button-text="添加新面板"
    @add="handleAddPanel"
  >
    <FCollapseItem name="1" title="面板1">
      内容1
    </FCollapseItem>
  </FCollapse>
</template>
```

## 🎨 主题定制

### 使用 CSS 变量

```css
/* 在你的样式文件中 */
:root {
  --fantasia-primary-color: #ec4899;
  --fantasia-border-radius: 8px;
  --fantasia-font-size: 14px;
}
```

### 使用 SCSS 变量

```scss
// 覆盖 SCSS 变量
$primary-color: #ec4899;
$border-radius: 8px;

@import 'fantasia-ui/dist/style.css';
```

## 📖 API 文档

每个组件都有详细的 API 文档，包括：
- **Props** - 组件属性配置
- **Events** - 组件事件
- **Slots** - 插槽用法
- **Methods** - 组件方法
- **Types** - TypeScript 类型定义

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- Vue >= 3.3.0
- TypeScript >= 5.0.0

### 开发命令

```bash
# 克隆项目
git clone https://github.com/ShusterLi/fantasia-ui.git
cd fantasia-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview

# 运行测试
pnpm run test

# 格式化代码
pnpm run lint
```

### 项目结构

```
fantasia-ui/
├── packages/
│   ├── components/     # 组件源代码
│   │   └── modules/    # 组件模块
│   ├── styles/         # 样式文件
│   ├── types/          # TypeScript 类型定义
│   ├── composables/    # 组合式函数
│   └── utils/          # 工具函数
├── docs/               # 文档
├── examples/           # 示例代码
├── tests/              # 测试文件
└── scripts/            # 构建脚本
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看我们的 [贡献指南](docs/CONTRIBUTING.md)。

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 编写组件单元测试
- 更新相关文档

## 🐛 问题反馈

如果你遇到任何问题或有功能建议，请：

1. 查看 [现有问题](https://github.com/ShusterLi/fantasia-ui/issues)
2. 如果没有相关问题，请创建新 issue
3. 提供详细的重现步骤和环境信息

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

感谢所有为 Fantasia UI 做出贡献的开发者！

## 📞 联系方式

- GitHub: [@ShusterLi](https://github.com/ShusterLi)
- Email: [通过 GitHub Issues 联系](https://github.com/ShusterLi/fantasia-ui/issues)

---

<div align="center">
  <sub>使用 ❤️ 构建 | Made with ❤️ by Shuster and Contributors</sub>
</div>
