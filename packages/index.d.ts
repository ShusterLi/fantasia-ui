import type { App, Plugin } from 'vue'

declare const install: Plugin

export default install

// 导出所有组件
export * from './components'

// 导出所有 composables
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
