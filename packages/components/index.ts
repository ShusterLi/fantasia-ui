export { default as FIcon } from "./modules/FIcon.vue";
export { default as FImage } from "./modules/FImage.vue";
export { default as FInput } from "./modules/FInput.vue";
export { default as FLoading } from "./modules/FLoading.vue";
export { default as FRate } from './modules/FRate.vue';
export { default as FDropdown } from "./modules/FDropdown.vue";
export { default as FSelect } from "./modules/FSelect.vue";
export { default as FPagination } from "./modules/FPagination.vue";
export { default as FCard } from "./modules/FCard.vue";
export { default as FTag } from "./modules/FTag.vue";
export { default as FTooltip } from "./modules/FTooltip.vue";
export { default as FProgress } from "./modules/FProgress.vue";
export { default as FTabs } from './modules/FTabs.vue';
export { default as FBreadcrumb } from "./modules/FBreadcrumb.vue";
export { default as FCol } from "./modules/FCol.vue";
export { default as FRow } from "./modules/FRow.vue";
export { default as FSpace } from "./modules/FSpace.vue";
export { default as FContainer } from "./modules/FContainer.vue";
export { default as FDivider } from "./modules/FDivider.vue";
export { default as FAvatar } from "./modules/FAvatar.vue";
export { default as FButton } from "./modules/FButton.vue";
export { default as FTypography } from './modules/FTypography.vue';
export { default as FText } from "./modules/FText.vue";
export { default as FLink } from "./modules/FLink.vue";
export { default as FBadge } from "./modules/FBadge.vue";
export { default as FAffix } from "./modules/FAffix.vue";
export { default as FForm } from "./modules/FForm.vue";
export { default as FFormItem } from "./modules/FFormItem.vue";
export { default as FCheckbox } from "./modules/FCheckbox.vue";
export { default as FAlert } from "./modules/FAlert.vue";
export { default as FEditor } from "./modules/FEditor.vue";
export { default as FTable } from "./modules/FTable.vue";
export { default as FDialog } from "./modules/FDialog.vue";
export { default as FUpload } from './modules/FUpload.vue';
export { default as FButtonGroup } from './modules/FButtonGroup.vue';
export { default as FCollapse } from './modules/FCollapse.vue';
export { default as FCollapseItem } from './modules/FCollapseItem.vue';
export { default as FColorPicker } from './modules/FColorPicker.vue';
export { default as FEmpty } from './modules/FEmpty.vue';
export { default as FSlider } from './modules/FSlider.vue';
export { default as FScrollbar } from './modules/FScrollbar.vue';
export { default as FInputNumber } from './modules/FInputNumber.vue';
export { default as FResult } from './modules/FResult.vue';

// FMessage 和 FNotification 使用命名导出
import FMessageDefault from './modules/FMessage';
import FNotificationDefault from './modules/FNotification';

export { FMessageDefault as FMessage };
export { FNotificationDefault as FNotification };

// 导出 FMessage 和 FNotification 类型
export type { FMessageFn, FMessageOptions, FMessageInstance } from '@/types';
export type { FNotificationFn, FNotificationOptions, FNotificationInstance } from '@/types';