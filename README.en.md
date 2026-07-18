# Fantasia UI

<p align="center">
  <img src="https://img.shields.io/npm/v/fantasia-ui" alt="npm version">
  <img src="https://img.shields.io/npm/dm/fantasia-ui" alt="npm downloads">
  <img src="https://img.shields.io/npm/l/fantasia-ui" alt="license">
  <img src="https://img.shields.io/badge/vue-3.x-brightgreen.svg" alt="vue3">
</p>

<p align="center">
  A modern UI component library based on Vue 3 + TypeScript
</p>

<p align="center">
  English | <a href="./README.md">简体中文</a>
</p>

## ✨ Features

- 🎨 **Modern Design** - Clean and elegant design style
- 🔧 **TypeScript** - Full TypeScript support with type definitions
- 📦 **Tree Shaking** - Support on-demand loading to reduce bundle size
- ⚡ **Vue 3** - Built with Vue 3 Composition API
- 🎯 **Out of the Box** - Rich components for daily development needs
- 📱 **Responsive** - Mobile-friendly interaction experience

## 📦 Installation

```bash
# npm
npm install fantasia-ui

# yarn
yarn add fantasia-ui

# pnpm
pnpm add fantasia-ui
```

### Optional Dependencies

If you need to use icon components, install additionally:

```bash
# Install icon library (optional)
npm install @vicons/ionicons5

# If using VueUse features (optional)
npm install @vueuse/core
```

## 🔨 Quick Start

### Global Registration

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

### Import on Demand

```vue
<script setup lang="ts">
import { FButton, FInput } from 'fantasia-ui'
import 'fantasia-ui/dist/index.css'
</script>

<template>
  <FButton type="primary">Button</FButton>
  <FInput v-model="value" placeholder="Please input" />
</template>
```

## 📚 Component List

### Basic Components
- **FButton** - Button
- **FIcon** - Icon
- **FText** - Text
- **FLink** - Link
- **FTypography** - Typography

### Layout Components
- **FContainer** - Container
- **FRow** - Row
- **FCol** - Column
- **FSpace** - Space
- **FDivider** - Divider

### Data Display
- **FCard** - Card
- **FImage** - Image
- **FAvatar** - Avatar
- **FBadge** - Badge
- **FTag** - Tag
- **FProgress** - Progress
- **FRate** - Rate
- **FBreadcrumb** - Breadcrumb

### Form Components
- **FInput** - Input
- **FSelect** - Select
- **FUpload** - Upload

### Data Components
- **FPagination** - Pagination
- **FTabs** - Tabs

### Feedback Components
- **FLoading** - Loading
- **FTooltip** - Tooltip
- **FSliderCaptcha** - Slider Captcha

### Others
- **FDropdown** - Dropdown
- **FAffix** - Affix

## 📝 Usage Examples

### Button Component

```vue
<script setup lang="ts">
import { FButton } from 'fantasia-ui'

const handleClick = () => {
  console.log('clicked!')
}
</script>

<template>
  <FButton type="primary" @click="handleClick">
    Primary Button
  </FButton>
  <FButton type="success">Success Button</FButton>
  <FButton type="warning">Warning Button</FButton>
  <FButton type="danger">Danger Button</FButton>
</template>
```

### Upload Component

```vue
<script setup lang="ts">
import { FUpload } from 'fantasia-ui'

const handleUpload = (file: File, done: () => void, error: (err: any) => void) => {
  try {
    // Upload logic
    console.log('Upload file:', file)
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

### Pagination Component

```vue
<script setup lang="ts">
import { FPagination } from 'fantasia-ui'
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('Current page:', page)
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

### Layout Components

```vue
<script setup lang="ts">
import { FRow, FCol, FSpace } from 'fantasia-ui'
</script>

<template>
  <!-- Grid Layout -->
  <FRow :gutter="20">
    <FCol :span="12">Column 1</FCol>
    <FCol :span="12">Column 2</FCol>
  </FRow>

  <!-- Space Layout -->
  <FSpace direction="horizontal" :size="16">
    <FButton>Button 1</FButton>
    <FButton>Button 2</FButton>
    <FButton>Button 3</FButton>
  </FSpace>
</template>
```

## 🎨 Theme Customization

The component library supports theme customization via CSS variables:

```css
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
}
```

## 📖 TypeScript Support

Fantasia UI provides complete TypeScript type definitions:

```vue
<script setup lang="ts">
import { FButton } from 'fantasia-ui'

// TypeScript will automatically infer props types
// No need to manually import FButtonProps
</script>

<template>
  <FButton variant="primary" size="large">
    Button
  </FButton>
</template>
```

### If you need component Props types

You can use TypeScript utility types to infer from components:

```typescript
import { FButton } from 'fantasia-ui'
import type { ComponentProps } from 'vue'

// Infer props type from component
type FButtonProps = ComponentProps<typeof FButton>

const buttonProps: FButtonProps = {
  variant: 'primary',
  size: 'large'
}
```

### Volar / IDE Type Hints

If your editor cannot suggest component props, please refer to [Type Support Documentation](./TYPE_SUPPORT.md) for configuration.

**Quick Setup (Global Registration):**

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["fantasia-ui/global"]
  }
}
```

Or add to `src/env.d.ts`:

```typescript
/// <reference types="fantasia-ui/global" />
```

## 🔗 Links

- [Changelog](./CHANGELOG.md)
- [Optimization Report](./OPTIMIZATION.md)
- [Issues](https://github.com/shuster/fantasia-ui/issues)
- [Contributing Guide](./CONTRIBUTING.md)

## 📄 License

[MIT](./LICENSE) License © 2024 Shuster

## 🤝 Contributing

Issues and Pull Requests are welcome!

If this project helps you, please give it a ⭐️ Star!
