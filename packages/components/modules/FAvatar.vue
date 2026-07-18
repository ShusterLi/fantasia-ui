<script setup lang="ts">
import type { FAvatarProps, Size } from '@/types';
import type { CSSProperties } from 'vue';
import { Person } from '@vicons/ionicons5'
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FAvatarProps>(), {
  size: 'normal',
  shape: 'circle'
});

const sizeMap: Record<Size, string> = {
  small: '32px',
  normal: '48px',
  large: '64px'
};

const AvatarStyle = computed<CSSProperties>(() => {
  return {
    width: typeof props.size === 'string' ? sizeMap[props.size] : `${props.size}px`,
    height: typeof props.size === 'string' ? sizeMap[props.size] : `${props.size}px`,
    borderRadius: props.shape === 'circle' ? '50%' : '8px'
  };
});
</script>

<template>
  <div class="f-avatar" :style="AvatarStyle">
    <img v-if="src" :src="src" :alt="alt" />
    <f-icon v-else :size="24">
      <component :is="icon ? icon : Person" />
    </f-icon>
  </div>
</template>

<style lang="scss" scoped>
.f-avatar {
  background-color: var(--surface);
  color: var(--text-dim);
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);

  img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
