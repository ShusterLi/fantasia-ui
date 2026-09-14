# 贡献指南

首先，感谢你愿意为 Fantasia UI 做出贡献！

## 开发设置

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开始开发

1. Fork 本仓库并克隆到本地：

```bash
git clone https://github.com/ShusterLi/fantasia-ui.git
cd fantasia-ui
```

2. 安装依赖：

```bash
pnpm install
```

3. 启动开发服务器：

```bash
pnpm dev
```

4. 构建项目：

```bash
pnpm build
```

## 项目结构

```
fantasia-ui/
├── packages/
│   ├── components/       # 组件源码
│   │   └── modules/      # 各个组件
│   ├── types/            # TypeScript 类型定义
│   ├── styles/           # 样式文件
│   ├── utils/            # 工具函数
│   ├── assets/           # 静态资源
│   ├── index.ts          # 主入口文件
│   ├── global.d.ts       # Vue 全局组件类型
│   └── volar.d.ts        # Volar 支持
├── scripts/              # 构建脚本
├── dist/                 # 构建输出（不提交到 Git）
├── .github/              # GitHub Actions 工作流
└── docs/                 # 文档（可选）
```

## 开发规范

### 代码风格

- 使用 TypeScript
- 使用 2 空格缩进
- 使用单引号
- 组件名使用 PascalCase（如 `FButton`）
- 文件名使用 PascalCase（如 `FButton.vue`）

### 组件开发

1. 在 `packages/components/modules/` 下创建新组件
2. 在 `packages/types/components/modules/` 下定义类型
3. 在 `packages/components/index.ts` 中导出组件
4. 在 `packages/global.d.ts` 中添加全局类型声明
5. 更新 README.md 组件列表

### 示例：创建新组件

```vue
<!-- packages/components/modules/FNewComponent.vue -->
<script setup lang="ts">
import type { FNewComponentProps } from '@/types'

const props = withDefaults(defineProps<FNewComponentProps>(), {
  type: 'default'
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="f-new-component">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.f-new-component {
  // 样式
}
</style>
```

```typescript
// packages/types/components/modules/f-new-component.ts
export interface FNewComponentProps {
  type?: 'default' | 'primary'
}

export type { FNewComponentProps }
```

### 提交规范

使用 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响代码运行）
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：

```bash
git commit -m "feat: add FNewComponent"
git commit -m "fix: resolve FButton type error"
git commit -m "docs: update README"
```

## Pull Request 流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### PR 检查清单

- [ ] 代码通过 TypeScript 检查
- [ ] 代码可以成功构建 (`pnpm build`)
- [ ] 新功能已添加文档
- [ ] 提交信息遵循规范
- [ ] PR 标题清晰描述了更改内容

## 发布流程

发布由维护者通过 GitHub Actions 自动完成：

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md` 和 `CHANGELOG.zh-CN.md`
3. 提交更改：`git commit -m "chore: release v0.x.x"`
4. 创建标签：`git tag v0.x.x`
5. 推送标签：`git push origin v0.x.x`
6. GitHub Actions 自动构建并发布到 npm

## 遇到问题？

- 查看 [Issue](https://github.com/ShusterLi/fantasia-ui/issues)
- 创建新的 Issue 描述问题
- 加入讨论区交流

## 行为准则

- 尊重所有贡献者
- 保持友善和专业
- 接受建设性批评
- 关注对社区最有利的事情

---

再次感谢你的贡献！ 🎉
