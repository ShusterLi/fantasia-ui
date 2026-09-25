import type { App, Plugin } from 'vue'

declare const install: Plugin

export default install

// 导出所有组件
export * from './components'

// 导出所有 composables
export * from './composables'

// 导出类型
export type { FDialogFn, FDialogOptions } from './types/components'
export type { FMessageFn, FMessageOptions, FMessageInstance } from './types/components'
export type { FNotificationFn, FNotificationOptions, FNotificationInstance } from './types/components'
