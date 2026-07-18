# TypeScript 类型支持文档

Fantasia UI 提供完整的 TypeScript 类型支持，包括组件属性、插槽、事件等的类型提示。

## 📦 安装后自动支持

安装 `fantasia-ui` 后，TypeScript 会自动识别类型声明文件（`dist/index.d.ts`），你可以直接使用：

```typescript
import { FButton, FCard, FMessage } from 'fantasia-ui'

// 类型会自动推断
const message = FMessage.success('操作成功')
```

## 🎯 Vue 模板中的类型提示（Volar）

如果你在 Vue 模板中无法获得组件属性的智能提示，需要进行以下配置：

### 方法一：全局类型声明（推荐）

在项目的 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "types": ["fantasia-ui/global"]
  }
}
```

### 方法二：环境声明文件

在项目的 `src/env.d.ts` 或任何 `.d.ts` 文件中添加：

```typescript
/// <reference types="fantasia-ui/global" />
```

如果文件不存在，创建 `src/env.d.ts`：

```typescript
/// <reference types="vite/client" />
/// <reference types="fantasia-ui/global" />
```

### 方法三：Volar 配置

在 `tsconfig.json` 中启用 Volar 的 `strictTemplates` 选项：

```json
{
  "vueCompilerOptions": {
    "target": 3.3,
    "strictTemplates": true
  }
}
```

## 🔍 验证配置

配置完成后，在 Vue 模板中应该能看到完整的类型提示：

```vue
<template>
  <!-- ✅ 能看到 type、size、disabled 等属性提示 -->
  <f-button type="primary" size="large" @click="handleClick">
    按钮
  </f-button>

  <!-- ✅ 能看到 header 插槽提示 -->
  <f-card>
    <template #header>
      卡片标题
    </template>
    卡片内容
  </f-card>
</template>
```

## 📝 组件 Props 类型推断

如果需要获取组件的 Props 类型，可以使用 Vue 的内置工具类型：

```typescript
import type { ComponentProps } from 'vue'
import { FButton, FCard } from 'fantasia-ui'

// 推断 FButton 的 Props 类型
type FButtonProps = ComponentProps<typeof FButton>

// 推断 FCard 的 Props 类型
type FCardProps = ComponentProps<typeof FCard>

// 使用
const buttonProps: FButtonProps = {
  type: 'primary',
  size: 'large',
  disabled: false
}
```

## 🎨 命令式 API 类型

FMessage 和 FNotification 提供完整的类型定义：

```typescript
import { FMessage, FNotification } from 'fantasia-ui'

// ✅ 类型安全的调用
FMessage.success('操作成功')
FMessage({
  message: '自定义消息',
  type: 'info',
  duration: 3000
})

// ✅ 获取实例类型
const instance = FNotification.info('通知内容')
instance.close() // 类型安全的方法调用
```

## 🛠️ 常见问题

### Q: 模板中仍然没有类型提示？

A: 确保：
1. 安装了 [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件
2. **禁用** Vetur 插件（Volar 和 Vetur 冲突）
3. 重启 VS Code
4. 重新加载 TypeScript 服务（VS Code 命令面板 → `TypeScript: Reload Project`）

### Q: 提示 "Cannot find module 'fantasia-ui/global'"？

A: 确保 `fantasia-ui` 已正确安装，并且版本 >= 0.2.23。检查 `node_modules/fantasia-ui/dist/types/global.d.ts` 文件是否存在。

### Q: 自定义组件注册后没有类型提示？

A: 如果使用自定义组件名称注册：

```typescript
// 这样注册会失去类型提示
app.component('MyButton', FButton)
```

建议使用原组件名或手动声明类型：

```typescript
// 方式一：使用原组件名
app.component('FButton', FButton)

// 方式二：手动声明
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MyButton: typeof FButton
  }
}
```

### Q: JSX/TSX 中如何使用？

A: Fantasia UI 完全支持 JSX/TSX：

```tsx
import { defineComponent } from 'vue'
import { FButton, FCard } from 'fantasia-ui'

export default defineComponent({
  setup() {
    return () => (
      <FCard>
        {{
          header: () => '卡片标题',
          default: () => (
            <FButton type="primary" onClick={() => console.log('clicked')}>
              按钮
            </FButton>
          )
        }}
      </FCard>
    )
  }
})
```

## 📚 相关资源

- [Vue 3 TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)
- [Volar 官方文档](https://github.com/vuejs/language-tools)
- [TypeScript 配置参考](https://www.typescriptlang.org/tsconfig)

## 💡 最佳实践

1. **始终使用 TypeScript**：虽然支持 JavaScript，但 TypeScript 能提供更好的开发体验
2. **启用严格模式**：在 `tsconfig.json` 中设置 `"strict": true`
3. **使用组合式 API**：配合 TypeScript 有更好的类型推断
4. **善用类型推断**：大多数情况下不需要手动声明类型，让 TypeScript 自动推断

```typescript
// ❌ 不推荐：过度声明类型
const message: string = FMessage.success('成功')

// ✅ 推荐：让 TypeScript 推断
const instance = FMessage.success('成功')
// instance 的类型会自动推断为 FMessageInstance
```
