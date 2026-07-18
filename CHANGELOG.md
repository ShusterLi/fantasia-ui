# Changelog

## [0.2.31] - 2026-07-11

### Added
- ✨ Added imperative API exports for `FMessage` and `FNotification` components
- 📝 Added `MESSAGE_USAGE.md` documentation

### Fixed
- 🐛 Fixed type default value error in FButtonGroup component
- 🐛 Fixed memory overflow issue during build (removed vite-plugin-dts, switched to vue-tsc)
- 🐛 Fixed incorrect type declaration file paths

### Optimized
- ⚡ Disabled esbuild minifier to avoid circular dependency issues
- 🎨 Optimized type definitions for FButton and FButtonGroup to avoid circular references
- 📦 Increased build memory limit to 8GB

### Documentation
- 📚 Created comprehensive type support documentation `TYPE_SUPPORT.md`
- 📚 Added usage guide for FMessage and FNotification

## [0.2.23] - 2026-07-11

### Fixed
- 🐛 Fixed issue where type declaration files could not be found
- 🐛 Created `scripts/post-build.cjs` to automatically generate correct main type declaration file
- 🐛 Fixed path reference error in `dist/index.d.ts`

### Optimized
- 📦 Optimized build scripts to ensure type declarations are correctly exported

## [0.2.19] - 2026-06-08

### Optimized
- ⚡ Optimized dependency configuration, removed unused dependencies
- 📦 Moved `vue`, `@vueuse/core`, `@vicons/ionicons5` to peerDependencies
- 🎨 Used path alias `@/` instead of relative path imports
- ⚡ Configured external dependencies to prevent bundling into component library
- 📦 Added `skipLibCheck: true` to optimize build speed
- 🎨 Simplified build script, removed duplicate tsc step

### Documentation
- 📚 Completely rewrote README.md and README.en.md
- 📚 Created CHANGELOG.md and CHANGELOG.zh-CN.md
- 📚 Added OPTIMIZATION.md dependency optimization documentation
- 📚 Added TYPE_SUPPORT.md TypeScript configuration guide
- 📚 Added USAGE_GUIDE.md complete usage examples

### Build
- 📦 Final build size:
  - ES: ~230KB (gzip: ~34KB)
  - UMD: ~250KB (gzip: ~35KB)
  - CSS: ~140KB (gzip: ~20KB)

## [0.2.0] - 2024

### Added
- ✨ Initial release
- 🎉 Includes 40+ common UI components
- 💪 Full TypeScript support
- 🎨 Supports dark/light themes
- 📦 Zero dependencies (runtime)
- 🌐 Supports Tree-shaking

### Component List
- Basic: Button, Icon, Link, Text, Typography
- Layout: Container, Row, Col, Space, Divider
- Form: Input, InputNumber, Checkbox, Select, ColorPicker, Upload, Rate, Slider
- Data Display: Card, Table, Tabs, Collapse, Badge, Avatar, Progress, Empty, Result
- Feedback: Alert, Message, Notification, Dialog, Loading, Tooltip
- Navigation: Breadcrumb, Pagination, Dropdown, Affix
- Others: Scrollbar, Editor, Form

---

## Version Notes

- **Major**: Incompatible API changes
- **Minor**: Backwards-compatible functionality additions
- **Patch**: Backwards-compatible bug fixes

## Legend

- ✨ New feature
- 🐛 Bug fix
- ⚡ Performance optimization
- 🎨 Code format/structure optimization
- 📦 Build/packaging related
- 📚 Documentation update
- 💪 Enhancement
- 🔥 Removal
- 🚀 Deployment related
- 🔧 Configuration file changes
