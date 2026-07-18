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

// 显式导出 FMessage 和 FNotification
export { FMessage, FNotification } from './components'