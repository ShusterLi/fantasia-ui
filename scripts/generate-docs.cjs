const fs = require('fs')
const path = require('path')
const glob = require('glob')
const vueDocgen = require('vue-docgen-api')

const searchDirs = [
  path.resolve(__dirname, '../components'),
  path.resolve(__dirname, '../packages/components/modules'),
  path.resolve(__dirname, '../packages/components')
]
const outDir = path.resolve(__dirname, '../docs/components')
const demoDir = path.resolve(__dirname, '../docs/.vitepress/demo')
const enhanceAppPath = path.resolve(__dirname, '../docs/.vitepress/enhanceApp.ts')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

let files = []
searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = files.concat(glob.sync('**/*.vue', { cwd: dir, absolute: true }))
  }
})

if (!files.length) {
  console.log('No component .vue files found under components/')
  process.exit(0)
}

if (!fs.existsSync(demoDir)) fs.mkdirSync(demoDir, { recursive: true })

files.forEach(file => {
  try {
    const doc = vueDocgen.parse(file)
    const name = doc.displayName || path.basename(file, '.vue')
    const kebab = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    const outFile = path.join(outDir, `${kebab}.md`)

    let md = `# ${name} \n\n`
    if (doc.description) md += `${doc.description}\n\n`

    // Usage example (basic)
    md += '## 基本用法\n\n'
    md += '```vue\n<template>\n  <div>\n    <!-- 请按需引入或全局注册组件 -->\n    <' + kebab + ' />\n  </div>\n</template>\n```\n\n'

    // Props
    if (doc.props && doc.props.length) {
      md += '## Props\n\n'
      md += '| 名称 | 类型 | 默认 | 描述 |\n'
      md += '| ---- | ---- | ---- | ---- |\n'
      doc.props.forEach(p => {
        const type = p.type ? (Array.isArray(p.type) ? p.type.join(' | ') : p.type.name || JSON.stringify(p.type)) : ''
        const def = p.defaultValue ? (p.defaultValue.value || p.defaultValue) : ''
        const desc = p.description ? p.description.replace(/\r?\n/g, ' ') : ''
        md += `| ${p.name} | ${type} | ${def} | ${desc} |\n`
      })
      md += '\n'
    }

    // Events
    if (doc.events && doc.events.length) {
      md += '## Events\n\n'
      md += '| 事件名 | 描述 |\n'
      md += '| ------ | ---- |\n'
      doc.events.forEach(e => {
        md += `| ${e.name} | ${e.description || ''} |\n`
      })
      md += '\n'
    }

    // Slots
    if (doc.slots && doc.slots.length) {
      md += '## Slots\n\n'
      md += '| 名称 | 描述 |\n'
      md += '| ---- | ---- |\n'
      doc.slots.forEach(s => {
        md += `| ${s.name || 'default'} | ${s.description || ''} |\n`
      })
      md += '\n'
    }

    // Methods
    if (doc.methods && doc.methods.length) {
      md += '## Methods\n\n'
      doc.methods.forEach(m => {
        md += `- **${m.name}**(${(m.params || []).map(p => p.name).join(', ')}): ${m.returns ? m.returns.type : ''} — ${m.description || ''}\n`
      })
      md += '\n'
    }

    md += '\n---\n\n*此页面由 `scripts/generate-docs.cjs` 自动生成，可在源码注释中补充说明以完善文档。*\n'

    fs.writeFileSync(outFile, md, 'utf8')
    console.log('Generated:', outFile)

    // 创建 demo 组件并在文档中引用
    try {
      const demoName = 'Demo' + name
      const demoFileName = `${kebab}-demo.vue`
      const demoFilePath = path.join(demoDir, demoFileName)
      const importPath = path.relative(path.dirname(demoFilePath), file).replace(/\\/g, '/')

      const demoContent = `<script setup>\nimport Comp from '${importPath}'\n</script>\n\n<template>\n  <div style=\"padding:16px;background:#fff;\">\n    <Comp />\n  </div>\n</template>\n`

      fs.writeFileSync(demoFilePath, demoContent, 'utf8')

      // 在 md 中添加演示引用
      md += `\n## 示例\n\n<${demoName} />\n\n`
      fs.writeFileSync(outFile, md, 'utf8')
      console.log('Generated demo:', demoFilePath)
    } catch (e) {
      console.error('Failed to generate demo for', file, e.message)
    }
  } catch (err) {
    console.error('Failed to parse', file, err.message)
  }
})

// 生成 enhanceApp.ts，注册 demo 组件
try {
  const demoFiles = glob.sync('**/*-demo.vue', { cwd: demoDir })
  let enhance = `import { App } from 'vue'\n`
  demoFiles.forEach(f => {
    const compName = 'Demo' + f.replace(/(^.|-.)/g, s => s.replace(/-/g, '').toUpperCase()).replace(/Demo/, 'Demo')
    const importPath = `./demo/${f}`
    enhance += `import ${compName} from '${importPath}'\n`
  })

  enhance += `\nexport default ({{ app }}: {{ app: App }}) => {\n`
  demoFiles.forEach(f => {
    const compName = 'Demo' + f.replace(/(^.|-.)/g, s => s.replace(/-/g, '').toUpperCase()).replace(/Demo/, 'Demo')
    enhance += `  app.component('${compName}', ${compName})\n`
  })
  enhance += `}\n`

  fs.writeFileSync(enhanceAppPath, enhance, 'utf8')
  console.log('Generated enhanceApp:', enhanceAppPath)
} catch (e) {
  console.error('Failed to write enhanceApp.ts', e.message)
}

console.log('Done generation.')
