import type { App, Plugin } from 'vue'
import './styles/base.scss'
import * as components from './components'

const install: Plugin = (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
        // 只注册组件,跳过函数式 API
        if (typeof component !== 'function' && name.startsWith('F')) {
            app.component(name, component as any)
        }
    })
}

export default install
export * from './components'

// 显式导出组件 (确保类型正确)
export { FDialog, FMessage, FNotification } from './components'

// 显式导出函数式 API
export { dialog, message, notification, FDialogAPI, FMessageAPI, FNotificationAPI } from './components'