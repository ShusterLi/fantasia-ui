const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 复制辅助文件
fs.copyFileSync('packages/global.d.ts', 'dist/types/global.d.ts');
fs.copyFileSync('packages/volar.d.ts', 'dist/types/volar.d.ts');

// 递归替换所有 .d.ts 文件中的 @/ 别名
function replaceAliasInDts(dir) {
  const files = glob.sync(dir + '/**/*.d.ts');
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // 计算当前文件到 types 目录的相对路径
    const fileDir = path.dirname(file);
    const typesDir = path.join(dir, 'types');
    const relativePath = path.relative(fileDir, typesDir);
    const normalizedPath = relativePath.replace(/\\/g, '/') || '.';
    
    // 替换 @/types 为相对路径
    content = content.replace(/@\/types/g, normalizedPath);
    
    // 替换其他 @/ 别名（如 @/styles, @/utils 等）
    const relativeToPackages = path.relative(fileDir, dir);
    const normalizedPackagesPath = relativeToPackages.replace(/\\/g, '/') || '.';
    
    // 替换剩余的 @/ 引用
    content = content.replace(/@\//g, normalizedPackagesPath + '/');
    
    fs.writeFileSync(file, content, 'utf-8');
  });
}

// 替换 dist/types/packages 目录下的所有别名
replaceAliasInDts('dist/types/packages');

// 创建正确的主类型声明文件
const mainDts = 'import type { App, Plugin } from \'vue\'\n\n' +
  'declare const install: Plugin\n\n' +
  'export default install\n\n' +
  '// 导出所有组件\n' +
  'export * from \'./types/packages/components\'\n\n' +
  '// 导出所有 composables\n' +
  'export * from \'./types/packages/composables\'\n\n' +
  '// 导出类型\n' +
  'export type { FDialogFn, FDialogOptions } from \'./types/packages/types/components\'\n' +
  'export type { FMessageFn, FMessageOptions, FMessageInstance } from \'./types/packages/types/components\'\n' +
  'export type { FNotificationFn, FNotificationOptions, FNotificationInstance } from \'./types/packages/types/components\'\n';

fs.writeFileSync('dist/index.d.ts', mainDts, 'utf-8');

console.log('✓ Post-build tasks completed');
console.log('✓ Path aliases replaced in .d.ts files');
