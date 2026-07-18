<script setup lang="ts">
import type { FAlertProps } from '@/types';
import {
  CheckmarkCircleOutline,
  AlertCircleOutline,
  WarningOutline,
  InformationCircleOutline,
} from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FAlertProps>(), {
  type: 'info',
});

const config = computed(() => ({
  success: { icon: CheckmarkCircleOutline, label: 'Success' },
  error: { icon: AlertCircleOutline, label: 'Error' },
  warning: { icon: WarningOutline, label: 'Warning' },
  info: { icon: InformationCircleOutline, label: 'Tips' },
}[props.type]));
</script>

<template>
  <div class="alert" :class="`alert--${type}`">
    <f-icon class="alert__icon">
      <component :is="config.icon" />
    </f-icon>
    <div class="alert__body">
      <h4 class="alert__title">{{ title ?? config.label }}</h4>
      <div class="alert__content">
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:list';

$types: (
  success: (#ecfdf5, #34d399, #065f46, #047857),
  error: (#fff1f2, #f43f5e, #9f1239, #be123c),
  warning: (#fffbeb, #f59e0b, #92400e, #b45309),
  info: (#eff6ff, #60a5fa, #1e3a5f, #1d4ed8),
);

.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 1rem;
  border-left: 4px solid;
  border-radius: 0 4px 4px 0;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  animation: fadeIn 0.3s ease;

  @each $type, $colors in $types {
    &--#{$type} {
      background: list.nth($colors, 1);
      border-color: list.nth($colors, 2);

      .alert__title {
        color: list.nth($colors, 3);
      }

      .alert__content {
        color: list.nth($colors, 4);
      }

      .alert__icon {
        color: list.nth($colors, 2);
      }
    }
  }
}

.alert__icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  line-height: 1.4;
}

.alert__title {
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0 0 0.125rem;
}

.alert__content {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.625;
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
