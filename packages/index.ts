import type { App, Plugin } from 'vue'
import './styles/base.scss'
import * as components from './components'

const install: Plugin = (app: App) => {
    Object.entries(components).forEach(([name, component]) => {
        if (name.startsWith('F')) {
            app.component(name, component as any)
        }
    })
}

export default install

// 导出所有组件
export * from './components'

// 导出所有 composables (函数式 API)
export * from './composables'

// 导出类型
export type { FDialogFn, FDialogOptions } from './types/components'
export type { FMessageFn, FMessageOptions, FMessageInstance } from './types/components'
export type { FNotificationFn, FNotificationOptions, FNotificationInstance } from './types/components'