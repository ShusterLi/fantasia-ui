import type { App, Plugin } from 'vue'
import './styles/index.scss'
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

// 导出常用公开类型，方便在业务代码中引用
export type {
    Justify,
    Align,
    Wrap,
    Direction,
    Size,
    Placement,
    Type,
    Position,
    ActiveInstance,
    FButtonProps,
    FInputProps,
    FUploadProps,
    FTransferItem,
    FTreeSelectOption,
    FTableColumn,
    Rule,
    Rules,
    FDialogFn,
    FDialogOptions,
    FMessageFn,
    FMessageOptions,
    FMessageInstance,
    FNotificationFn,
    FNotificationOptions,
    FNotificationInstance,
    UploadFileItem,
    MenuItem,
    Columns,
    Actions
} from './types'