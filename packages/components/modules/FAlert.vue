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
@use '../../styles/components/f-alert.scss';
</style>

