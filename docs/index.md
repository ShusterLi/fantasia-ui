# Fantasia UI 文档

<div align="center">
<img src="/logo.png" alt="Fantasia UI Logo" width="200" />

**基于 Vue 3 + TypeScript 的现代化 UI 组件库**
</div>

## 导航

- 📖 [快速开始](./guide/getting-started.md) - 安装和使用指南
- 🎨 [主题定制](./guide/theming.md) - 自定义主题和样式
- 🔧 [开发指南](./guide/development.md) - 开发环境搭建和项目结构
- 📋 [组件列表](./components/README.md) - 完整的组件文档
- 🤝 [贡献指南](./contributing.md) - 如何参与贡献
- 📄 [许可证](./license.md) - 开源许可证信息

## 特性概述

### 🚀 现代化技术栈
- 基于 Vue 3 组合式 API
- 完整的 TypeScript 支持
- 支持 Composition API 和 Options API

### 🎨 精美的设计
- 现代化设计语言
- 支持深色/浅色主题
- 响应式布局
- 60+ 个高质量组件

### 🔧 强大的功能
- 组件按需加载
- 支持主题定制
- 完整的国际化支持
- 无障碍访问支持

### 📱 跨平台支持
- 支持桌面端和移动端
- 兼容主流现代浏览器
- 支持 SSR（服务端渲染）

## 核心组件

### 基础组件
- **按钮** (FButton) - 各种样式的按钮组件
- **输入框** (FInput) - 文本输入和表单控件
- **选择器** (FSelect) - 下拉选择器，支持新增选项功能
- **复选框** (FCheckbox) - 多选框组件
- **单选框** (FRadio) - 单选按钮组件

### 布局组件
- **布局容器** (FContainer) - 页面布局容器
- **栅格系统** (FGrid, FRow, FCol) - 灵活的网格布局
- **间距** (FSpace) - 组件间距控制
- **分割线** (FDivider) - 内容分割线

### 数据展示
- **卡片** (FCard) - 内容卡片容器
- **标签** (FTag) - 标签展示组件
- **表格** (FTable) - 数据表格
- **时间轴** (FTimeline) - 时间线展示

### 反馈组件
- **对话框** (FDialog) - 模态对话框
- **抽屉** (FDrawer) - 侧边抽屉
- **消息提示** (FMessage) - 全局消息提示
- **通知** (FNotification) - 桌面通知

### 导航组件
- **下拉菜单** (FDropdown) - 下拉菜单组件
- **标签页** (FTabs) - 标签切换组件
- **面包屑** (FBreadcrumb) - 导航面包屑
- **菜单** (FMenu) - 导航菜单

### 特色功能

#### FSelect 新增选项功能
FSelect 组件支持两种新增选项模式：
1. **输入时新增** - 在过滤模式下输入不存在的选项，按回车键创建
2. **新增按钮模式** - 在下拉菜单底部显示新增按钮

#### FCollapse 新增面板功能
折叠面板组件支持动态添加新面板项，可通过新增按钮快速扩展内容。

## 快速体验

```bash
# 创建一个新的 Vue 项目
npm create vue@latest

# 安装 Fantasia UI
cd your-project
npm install fantasia-ui

# 导入组件
import { FButton, FInput } from 'fantasia-ui'
import 'fantasia-ui/dist/fantasia-ui.css'

# 使用组件
<template>
  <FButton type="primary">主要按钮</FButton>
  <FInput placeholder="请输入内容" />
</template>
```

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge |
| --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 社区和支持

- **GitHub Issues**: [问题反馈](https://github.com/ShusterLi/fantasia-ui/issues)
- **GitHub Discussions**: [社区讨论](https://github.com/ShusterLi/fantasia-ui/discussions)
- **Stack Overflow**: 使用标签 `fantasia-ui`
- **Discord**: [加入社区](https://discord.gg/fantasia-ui)

## 许可证

Fantasia UI 基于 MIT 许可证开源。查看 [LICENSE](../LICENSE) 文件了解更多详情。

---

<div align="center">
<sub>使用 ❤️ 构建 | Made with ❤️ by Shuster and Contributors</sub>
</div>
