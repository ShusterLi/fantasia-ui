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
export type {
    FDialogFn,
    FDialogOptions,
    FMessageFn,
    FMessageOptions,
    FMessageInstance,
    FNotificationFn,
    FNotificationOptions,
    FNotificationInstance,
    UploadFileItem
} from './types/components'