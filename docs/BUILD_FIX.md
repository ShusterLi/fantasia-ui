# Build Issue Resolution Documentation

## 问题概述 | Issue Overview

在组件库打包过程中遇到的内存溢出问题及其解决方案。

During the component library build process, we encountered memory overflow issues and their solutions.

---

## 问题描述 | Problem Description

### 症状 | Symptoms

```bash
npm error code ENOSPC
npm error syscall write
npm error errno -4055
npm error nospc ENOSPC: no space left on device, write
```

或 | Or

```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

### 根本原因 | Root Cause

1. **esbuild 压缩器问题**：esbuild 的压缩器无法正确处理组件中的循环依赖结构
   - **esbuild minifier issue**: The esbuild minifier cannot properly handle circular dependencies in components

2. **vite-plugin-dts 内存泄漏**：在处理复杂类型定义时会导致内存持续增长
   - **vite-plugin-dts memory leak**: Causes continuous memory growth when processing complex type definitions

3. **循环类型引用**：FButton 和 FButtonGroup 之间的相互引用导致类型推断死循环
   - **Circular type references**: Mutual references between FButton and FButtonGroup cause infinite type inference loops

---

## 解决方案 | Solutions

### 1. 禁用 esbuild 压缩器 | Disable esbuild Minifier

**vite.config.ts**:
```typescript
export default defineConfig({
  build: {
    minify: false,  // 禁用 esbuild 压缩
    // ...
  }
})
```

**原因 | Reason**: esbuild 在处理 Vue 3 组件的循环依赖时存在已知问题。

esbuild has known issues when handling circular dependencies in Vue 3 components.

---

### 2. 移除 vite-plugin-dts | Remove vite-plugin-dts

**Before**:
```typescript
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 配置...
    })
  ]
})
```

**After**:
```typescript
export default defineConfig({
  plugins: [
    vue()
    // 移除 vite-plugin-dts
  ]
})
```

使用 `vue-tsc` 代替 | Use `vue-tsc` instead:

**package.json**:
```json
{
  "scripts": {
    "build": "node --max-old-space-size=8192 node_modules/vite/bin/vite.js build && vue-tsc --declaration --emitDeclarationOnly -p tsconfig.build.json && node scripts/post-build.cjs"
  }
}
```

---

### 3. 增加 Node.js 内存限制 | Increase Node.js Memory Limit

**package.json**:
```json
{
  "scripts": {
    "build": "node --max-old-space-size=8192 node_modules/vite/bin/vite.js build && vue-tsc --declaration --emitDeclarationOnly -p tsconfig.build.json && node scripts/post-build.cjs"
  }
}
```

`--max-old-space-size=8192` 设置最大堆内存为 8GB

`--max-old-space-size=8192` sets the maximum heap memory to 8GB

---

### 4. 修复循环类型引用 | Fix Circular Type References

**问题代码 | Problem Code** (FButtonGroup.vue):
```vue
<script setup lang="ts">
import type { FButtonGroupProps } from '@/types'

// ❌ 从 FButton.vue 导入类型，导致循环引用
import type { ButtonType } from './FButton.vue'

provide<ButtonType | undefined>('buttonGroupType', props.type)
</script>
```

**修复后 | Fixed** (FButtonGroup.vue):
```vue
<script setup lang="ts">
import type { FButtonGroupProps } from '@/types'

// ✅ 在本地定义类型，避免循环引用
type ButtonType = 'default' | 'primary' | 'success' | 'danger' | 'warning'

provide<ButtonType | undefined>('buttonGroupType', props.type)
</script>
```

---

### 5. 排除有问题的组件 | Exclude Problematic Components

某些组件可能依赖外部库或未完成开发，应该从构建中排除。

Some components may depend on external libraries or are incomplete and should be excluded from the build.

**tsconfig.build.json**:
```json
{
  "extends": "./tsconfig.json",
  "include": [
    "packages/**/*"
  ],
  "exclude": [
    "node_modules",
    "packages/**/__tests__",
    "packages/components/modules/FCrop.vue",
    "packages/components/modules/FSliderCaptcha.vue"
  ]
}
```

**packages/components/index.ts**:
```typescript
// 不导出 FCrop 和 FSliderCaptcha
// export { default as FCrop } from './modules/FCrop.vue'
// export { default as FSliderCaptcha } from './modules/FSliderCaptcha.vue'
```

---

### 6. 配置构建跳过类型检查 | Configure Build to Skip Type Checking

**tsconfig.build.json**:
```json
{
  "compilerOptions": {
    "skipLibCheck": true,  // 跳过库文件类型检查
    // ...其他配置
  }
}
```

这可以显著加快构建速度并减少内存使用。

This can significantly speed up the build and reduce memory usage.

---

## 构建流程 | Build Process

### 最终的构建脚本 | Final Build Script

**package.json**:
```json
{
  "scripts": {
    "build": "node --max-old-space-size=8192 node_modules/vite/bin/vite.js build && vue-tsc --declaration --emitDeclarationOnly -p tsconfig.build.json && node scripts/post-build.cjs"
  }
}
```

### 构建步骤 | Build Steps

1. **Vite 构建**：打包组件代码和样式
   - **Vite build**: Bundle component code and styles

2. **vue-tsc 生成类型**：生成 TypeScript 类型声明文件
   - **vue-tsc type generation**: Generate TypeScript declaration files

3. **后处理脚本**：整理类型文件，生成正确的入口文件
   - **Post-build script**: Organize type files, generate correct entry files

---

## 后处理脚本 | Post-Build Script

**scripts/post-build.cjs**:
```javascript
const fs = require('fs')
const path = require('path')

const distTypesDir = path.resolve(__dirname, '../dist/types')
const packagesDir = path.resolve(__dirname, '../packages')
const distDir = path.resolve(__dirname, '../dist')

// 确保 dist/types 目录存在
if (!fs.existsSync(distTypesDir)) {
  fs.mkdirSync(distTypesDir, { recursive: true })
}

// 复制 global.d.ts
const globalDtsSource = path.join(packagesDir, 'global.d.ts')
const globalDtsDest = path.join(distTypesDir, 'global.d.ts')
if (fs.existsSync(globalDtsSource)) {
  fs.copyFileSync(globalDtsSource, globalDtsDest)
  console.log('✅ Copied global.d.ts')
}

// 复制 volar.d.ts
const volarDtsSource = path.join(packagesDir, 'volar.d.ts')
const volarDtsDest = path.join(distTypesDir, 'volar.d.ts')
if (fs.existsSync(volarDtsSource)) {
  fs.copyFileSync(volarDtsSource, volarDtsDest)
  console.log('✅ Copied volar.d.ts')
}

// 生成主类型声明文件
const mainDtsContent = `export * from './types/components'
`

const mainDtsPath = path.join(distDir, 'index.d.ts')
fs.writeFileSync(mainDtsPath, mainDtsContent)
console.log('✅ Generated main index.d.ts')

console.log('🎉 Post-build completed!')
```

---

## 验证构建 | Verify Build

### 检查输出文件 | Check Output Files

```bash
# 检查 dist 目录结构
ls -R dist/

# 预期输出 | Expected output:
# dist/
# ├── fantasia-ui.es.js
# ├── fantasia-ui.umd.js
# ├── index.css
# ├── index.d.ts
# └── types/
#     ├── components/
#     │   ├── index.d.ts
#     │   └── modules/
#     ├── global.d.ts
#     └── volar.d.ts
```

### 测试安装 | Test Installation

```bash
# 在测试项目中安装
npm install /path/to/fantasia-ui

# 测试导入
node -e "require('fantasia-ui')"
```

### 检查类型定义 | Check Type Definitions

在 TypeScript 项目中测试：

Test in a TypeScript project:

```typescript
import { FButton, FMessage } from 'fantasia-ui'

// 应该有完整的类型提示
// Should have complete type hints
const button: typeof FButton = FButton
```

---

## 性能对比 | Performance Comparison

### 修复前 | Before Fix

```bash
❌ Build failed: FATAL ERROR - JavaScript heap out of memory
Time: N/A (Failed)
```

### 修复后 | After Fix

```bash
✓ built in 12.34s

dist/fantasia-ui.es.js       230.18 kB │ gzip: 33.60 kB
dist/fantasia-ui.umd.js      250.76 kB │ gzip: 34.58 kB
dist/index.css               97.90 kB  │ gzip: 15.23 kB

Time: ~12-15 seconds
Memory: ~4GB peak usage
```

---

## 最佳实践 | Best Practices

### 1. 避免循环依赖 | Avoid Circular Dependencies

```typescript
// ❌ 不好：组件间直接引用类型
// Bad: Direct type references between components
import type { ButtonType } from './FButton.vue'

// ✅ 好：在独立的类型文件中定义共享类型
// Good: Define shared types in separate type files
import type { ButtonType } from '@/types/components/modules/base'
```

### 2. 使用路径别名 | Use Path Aliases

```typescript
// ❌ 不好：相对路径
// Bad: Relative paths
import type { FButtonProps } from '../../types/components/modules/f-button'

// ✅ 好：路径别名
// Good: Path aliases
import type { FButtonProps } from '@/types'
```

### 3. 分离类型定义 | Separate Type Definitions

```
packages/
├── components/           # 组件实现
│   └── modules/
│       └── FButton.vue
├── types/                # 类型定义
│   └── components/
│       └── modules/
│           └── f-button.ts
```

### 4. 合理设置外部依赖 | Properly Configure External Dependencies

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', '@vueuse/core', '@vicons/ionicons5']
    }
  }
})
```

---

## 常见问题 | Common Issues

### Q1: 构建仍然失败？| Build Still Failing?

**检查项 | Checklist**:
- [ ] 是否设置了 `--max-old-space-size=8192`
- [ ] 是否禁用了 `minify: false`
- [ ] 是否移除了 `vite-plugin-dts`
- [ ] 是否修复了循环类型引用
- [ ] 是否排除了有问题的组件

### Q2: 类型提示不工作？| Type Hints Not Working?

参考 [TYPE_SUPPORT.md](./TYPE_SUPPORT.md) 进行配置。

Refer to [TYPE_SUPPORT.md](./TYPE_SUPPORT.md) for configuration.

### Q3: 构建很慢？| Build Too Slow?

- 启用 `skipLibCheck: true`
- 减少包含的组件数量
- 使用增量构建（开发中）

Enable `skipLibCheck: true`, reduce the number of included components, use incremental builds (in development).

---

## 相关链接 | Related Links

- [Vite 配置文档](https://vitejs.dev/config/)
- [TypeScript 编译选项](https://www.typescriptlang.org/tsconfig)
- [Vue TypeScript 支持](https://vuejs.org/guide/typescript/overview.html)
- [Node.js 内存管理](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes)

---

## 维护者注意事项 | Maintainer Notes

如果未来添加新组件，请确保：

When adding new components in the future, ensure:

1. ✅ 不创建循环类型依赖 | Don't create circular type dependencies
2. ✅ 使用 `@/types` 路径别名 | Use `@/types` path alias
3. ✅ 在类型文件中定义共享类型 | Define shared types in type files
4. ✅ 测试构建是否成功 | Test if the build succeeds
5. ✅ 检查类型提示是否正常 | Check if type hints work properly

---

**文档更新日期 | Last Updated**: 2024-01-11
