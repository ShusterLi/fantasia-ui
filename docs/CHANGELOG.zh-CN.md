# 更新日志

## [0.2.31] - 2026-07-11

### 新增
- ✨ 新增 `FMessage` 和 `FNotification` 组件的命令式 API 导出

### 修复
- 🐛 修复 FButtonGroup 组件的类型默认值错误
- 🐛 修复构建时内存溢出问题（移除 vite-plugin-dts，改用 vue-tsc）
- 🐛 修复类型声明文件路径错误

### 优化
- ⚡ 禁用 esbuild minifier 以避免循环依赖问题
- 🎨 优化 FButton 和 FButtonGroup 的类型定义，避免循环引用
- 📦 增加构建内存限制到 8GB

### 文档
- 📚 创建完整的类型支持文档 `TYPE_SUPPORT.md`
- 📚 添加 FMessage 和 FNotification 使用指南

## [0.2.23] - 2026-07-11

### 修复
- 🐛 修复类型声明文件无法找到的问题
- 🐛 创建 `scripts/post-build.cjs` 自动生成正确的主类型声明文件
- 🐛 修复 `dist/index.d.ts` 路径引用错误

### 优化
- 📦 优化构建脚本，确保类型声明正确导出

## [0.2.19] - 2026-06-08

### 优化
- ⚡ 优化依赖配置，移除未使用的依赖
- 📦 将 `vue`、`@vueuse/core`、`@vicons/ionicons5` 移至 peerDependencies
- 🎨 使用路径别名 `@/` 替代相对路径导入
- ⚡ 配置外部依赖，防止打包到组件库中
- 📦 添加 `skipLibCheck: true` 优化构建速度
- 🎨 简化构建脚本，移除重复的 tsc 步骤

### 文档
- 📚 完全重写 README.md 和 README.en.md
- 📚 创建 CHANGELOG.md 和 CHANGELOG.zh-CN.md
- 📚 添加 OPTIMIZATION.md 依赖优化文档
- 📚 添加 TYPE_SUPPORT.md TypeScript 配置指南
- 📚 添加 USAGE_GUIDE.md 完整使用示例

### 构建
- 📦 最终构建体积：
  - ES: ~230KB (gzip: ~34KB)
  - UMD: ~250KB (gzip: ~35KB)
  - CSS: ~140KB (gzip: ~20KB)

## [0.2.0] - 2024

### 新增
- ✨ 初始版本发布
- 🎉 包含 40+ 个常用 UI 组件
- 💪 完整的 TypeScript 支持
- 🎨 支持暗色/亮色主题
- 📦 零依赖（运行时）
- 🌐 支持 Tree-shaking

### 组件列表
- 基础组件：Button、Icon、Link、Text、Typography
- 布局组件：Container、Row、Col、Space、Divider
- 表单组件：Input、InputNumber、Checkbox、Select、ColorPicker、Upload、Rate、Slider
- 数据展示：Card、Table、Tabs、Collapse、Badge、Avatar、Progress、Empty、Result
- 反馈组件：Alert、Message、Notification、Dialog、Loading、Tooltip
- 导航组件：Breadcrumb、Pagination、Dropdown、Affix
- 其他：Scrollbar、Editor、Form

---

## 版本说明

- **主版本号（Major）**：不兼容的 API 修改
- **次版本号（Minor）**：向下兼容的功能性新增
- **修订号（Patch）**：向下兼容的问题修正

## 图例

- ✨ 新增功能
- 🐛 Bug 修复
- ⚡ 性能优化
- 🎨 代码格式/结构优化
- 📦 构建/打包相关
- 📚 文档更新
- 💪 增强功能
- 🔥 移除功能/文件
- 🚀 部署相关
- 🔧 配置文件修改
