const fs = require('fs');
const path = require('path');

// 复制辅助文件
fs.copyFileSync('packages/global.d.ts', 'dist/types/global.d.ts');
fs.copyFileSync('packages/volar.d.ts', 'dist/types/volar.d.ts');

// 创建正确的主类型声明文件
const mainDts = `import type { App, Plugin } from 'vue'

declare const install: Plugin

export default install

// 导出所有组件
export * from './types/components'
`;

fs.writeFileSync('dist/index.d.ts', mainDts, 'utf-8');

console.log('✓ Post-build tasks completed');
