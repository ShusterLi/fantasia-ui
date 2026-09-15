import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function genComponentSidebar() {
  const dir = path.resolve(__dirname, '../components')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  const items = files.map(f => {
    const name = f.replace(/\.md$/, '')
    const text = name.replace(/[-_]/g, ' ').replace(/\b\w/g, s => s.toUpperCase())
    return { text, link: `/components/${name}` }
  })
  return [{ text: '组件', items }]
}

export default defineConfig({
  title: 'Fantasia UI',
  description: '一个基于 Vue 3 的轻量级 UI 组件库文档',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ],
      '/components/': genComponentSidebar()
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShusterLi/fantasia-ui' }
    ]
  }
})
