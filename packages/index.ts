import type { App, Plugin } from 'vue'
import './styles/base.scss'
import * as components from './components'

const install: Plugin = (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
        app.component(name, component as any)
    })
}

export default install
export * from './components'
// 不导出 types，用户不需要直接导入 Props 类型