<script lang="ts" setup>
import type { FTagProps } from '@/types';
import { Close, CloseCircle } from '@vicons/ionicons5'
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FTagProps>(), {
  size: 'normal',
  type: 'round',
  theme: 'light',
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isHover = ref(false);
</script>

<template>
  <span class="f-tag" :class="[
    `f-tag--${type ?? 'round'}`,
    `f-tag--${effect ?? 'light'}`,
    color ?? 'default'
  ]" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <span v-if="type === 'dot'" class="f-tag__dot" />
    <slot />
    <f-icon v-if="closable" class="f-tag__close" @click.stop="emit('close')">
      <component :is="isHover ? CloseCircle : Close" />
    </f-icon>
  </span>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-tag.scss';
</style>

