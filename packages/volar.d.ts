// Volar 类型提示支持
// 用户需要在 tsconfig.json 中引用此文件

import type * as components from './components'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FAffix: typeof components.FAffix
    FAlert: typeof components.FAlert
    FAvatar: typeof components.FAvatar
    FBadge: typeof components.FBadge
    FBreadcrumb: typeof components.FBreadcrumb
    FButton: typeof components.FButton
    FCard: typeof components.FCard
    FCheckbox: typeof components.FCheckbox
    FRadio: typeof components.FRadio
    FRadioGroup: typeof components.FRadioGroup
    FSwitch: typeof components.FSwitch
    FTreeSelect: typeof components.FTreeSelect
    FTransfer: typeof components.FTransfer
    FCol: typeof components.FCol
    FContainer: typeof components.FContainer
    FDialog: typeof components.FDialog
    FDivider: typeof components.FDivider
    FDropdown: typeof components.FDropdown
    FEditor: typeof components.FEditor
    FForm: typeof components.FForm
    FFormItem: typeof components.FFormItem
    FIcon: typeof components.FIcon
    FImage: typeof components.FImage
    FInput: typeof components.FInput
    FLink: typeof components.FLink
    FLoading: typeof components.FLoading
    FPagination: typeof components.FPagination
    FProgress: typeof components.FProgress
    FRate: typeof components.FRate
    FRow: typeof components.FRow
    FSelect: typeof components.FSelect
    FSpace: typeof components.FSpace
    FTable: typeof components.FTable
    FTabs: typeof components.FTabs
    FTag: typeof components.FTag
    FText: typeof components.FText
    FTooltip: typeof components.FTooltip
    FTypography: typeof components.FTypography
    FUpload: typeof components.FUpload
    FButtonGroup: typeof components.FButtonGroup
    FCollapse: typeof components.FCollapse
    FCollapseItem: typeof components.FCollapseItem
    FColorPicker: typeof components.FColorPicker
    FEmpty: typeof components.FEmpty
    FSlider: typeof components.FSlider
    FScrollbar: typeof components.FScrollbar
    FInputNumber: typeof components.FInputNumber
    FMask: typeof components.FMask
    FMarquee: typeof components.FMarquee
    FSteps: typeof components.FSteps
    FResult: typeof components.FResult
    // FMessage 和 FNotification 只作为函数式 API 使用，从 composables 导出
  }
}

export { }
