# Fantasia UI

<div align="center">
A modern UI component library based on Vue 3 + TypeScript with 60+ high-quality components
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/fantasia-ui.svg)](https://www.npmjs.com/package/fantasia-ui)
[![npm downloads](https://img.shields.io/npm/dm/fantasia-ui.svg)](https://www.npmjs.com/package/fantasia-ui)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/vue-3.3+-green.svg)](https://vuejs.org/)

</div>

## ✨ Features

- **Modern Design** - Clean and elegant design language, supports dark/light themes
- **Full TypeScript Support** - Complete type definitions and intelligent code completion
- **High Performance** - Built with Vue 3 Composition API, components are loaded on demand
- **Responsive Design** - Perfectly adapts to desktop and mobile devices
- **Customizable** - Supports theme customization and component style overrides
- **Rich Component Library** - 60+ high-quality Vue 3 components
- **Comprehensive Documentation** - Detailed API documentation and usage examples
- **Active Maintenance** - Continuous updates and timely issue fixes

## 📦 Installation

### NPM

```bash
npm install fantasia-ui
```

### Yarn

```bash
yarn add fantasia-ui
```

### PNPM

```bash
pnpm add fantasia-ui
```

## 🚀 Quick Start

### Full Import

```typescript
// main.ts
import { createApp } from 'vue'
import FantasiaUI from 'fantasia-ui'
import 'fantasia-ui/dist/fantasia-ui.css'

const app = createApp(App)
app.use(FantasiaUI)
app.mount('#app')
```

### On-demand Import

```typescript
// In your Vue component
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

### Vite Project Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

## 📚 Component List

### Basic Components
- **FButton** - Button
- **FInput** - Input
- **FSelect** - Select (supports adding new options)
- **FCheckbox** - Checkbox
- **FRadio** - Radio
- **FSlider** - Slider
- **FInputNumber** - Number Input
- **FColorPicker** - Color Picker
- **FDatePicker** - Date Picker
- **FTimePicker** - Time Picker

### Layout Components
- **FContainer** - Container
- **FGrid** - Grid Layout
- **FRow** / **FCol** - Row/Column
- **FDivider** - Divider
- **FSpace** - Space
- **FScrollbar** - Scrollbar

### Data Display
- **FCard** - Card
- **FTag** - Tag
- **FBadge** - Badge
- **FTable** - Table
- **FTimeline** - Timeline
- **FEmpty** - Empty State
- **FResult** - Result Page
- **FImage** - Image
- **FAvatar** - Avatar
- **FList** - List

### Feedback Components
- **FDialog** - Dialog
- **FDrawer** - Drawer
- **FMessage** - Message
- **FNotification** - Notification
- **FLoading** - Loading
- **FAlert** - Alert
- **FPopover** - Popover
- **FTooltip** - Tooltip
- **FPopconfirm** - Popconfirm

### Navigation Components
- **FDropdown** - Dropdown
- **FTabs** - Tabs
- **FBreadcrumb** - Breadcrumb
- **FMenu** - Menu
- **FAffix** - Affix
- **FPagination** - Pagination
- **FSteps** - Steps

### Other Components
- **FUpload** - Upload
- **FIcon** - Icon
- **FCollapse** - Collapse (supports adding new panels)
- **FCarousel** - Carousel
- **FEditor** - Rich Text Editor
- **FMask** - Mask
- **FSliderCaptcha** - Slider Captcha
- **FCrop** - Image Crop

## 🔧 New Feature Highlights

### FSelect Add Option Feature

Fantasia UI's FSelect component supports two modes for adding new options:

#### 1. Create on Input (allowCreate)

```vue
<template>
  <FSelect 
    :options="options"
    filterable
    allow-create
    placeholder="Type and press Enter to add new option"
    @add="handleAddOption"
  />
</template>

<script setup>
const options = ref([
  { key: '1', label: 'Option 1' },
  { key: '2', label: 'Option 2' }
])

function handleAddOption(label) {
  const newKey = `new_${Date.now()}`
  const newOption = { key: newKey, label }
  options.value.push(newOption)
}
</script>
```

#### 2. Add Button Mode (showAddOption)

```vue
<template>
  <FSelect 
    :options="options"
    show-add-option
    add-option-text="Add New Option"
    @add="handleAddOption"
  />
</template>
```

### FCollapse Add Panel Feature

```vue
<template>
  <FCollapse 
    show-add-button
    add-button-position="bottom"
    add-button-text="Add New Panel"
    @add="handleAddPanel"
  >
    <FCollapseItem name="1" title="Panel 1">
      Content 1
    </FCollapseItem>
  </FCollapse>
</template>
```

## 🎨 Theme Customization

### Using CSS Variables

```css
/* In your style file */
:root {
  --fantasia-primary-color: #ec4899;
  --fantasia-border-radius: 8px;
  --fantasia-font-size: 14px;
}
```

### Using SCSS Variables

```scss
// Override SCSS variables
$primary-color: #ec4899;
$border-radius: 8px;

@import 'fantasia-ui/dist/style.css';
```

## 📖 API Documentation

Each component includes detailed API documentation:
- **Props** - Component properties
- **Events** - Component events
- **Slots** - Slot usage
- **Methods** - Component methods
- **Types** - TypeScript type definitions

## 🛠️ Development Guide

### Environment Requirements

- Node.js >= 16.0.0
- Vue >= 3.3.0
- TypeScript >= 5.0.0

### Development Commands

```bash
# Clone the repository
git clone https://github.com/ShusterLi/fantasia-ui.git
cd fantasia-ui

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview build result
pnpm run preview

# Run tests
pnpm run test

# Format code
pnpm run lint
```

### Project Structure

```
fantasia-ui/
├── packages/
│   ├── components/     # Component source code
│   │   └── modules/    # Component modules
│   ├── styles/         # Style files
│   ├── types/          # TypeScript type definitions
│   ├── composables/    # Composable functions
│   └── utils/          # Utility functions
├── docs/               # Documentation
├── examples/           # Example code
├── tests/              # Test files
└── scripts/            # Build scripts
```

## 🤝 Contributing

We welcome all forms of contributions! Please check our [Contributing Guide](docs/CONTRIBUTING.md).

### Development Workflow

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Code Standards

- Write code in TypeScript
- Follow ESLint rules
- Write component unit tests
- Update relevant documentation

## 🐛 Issue Reporting

If you encounter any issues or have feature suggestions:

1. Check [existing issues](https://github.com/ShusterLi/fantasia-ui/issues)
2. If no related issue exists, create a new one
3. Provide detailed reproduction steps and environment information

## 📄 License

This project is open source under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Thanks to all developers who have contributed to Fantasia UI!

## 📞 Contact

- GitHub: [@ShusterLi](https://github.com/ShusterLi)
- Email: [Contact via GitHub Issues](https://github.com/ShusterLi/fantasia-ui/issues)

---

<div align="center">
  <sub>Built with ❤️ | Made with ❤️ by Shuster and Contributors</sub>
</div>
