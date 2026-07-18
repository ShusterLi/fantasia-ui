<script lang="ts" setup>
import type { FLoadingProps } from '@/types';

const props = withDefaults(defineProps<FLoadingProps>(), {
  type: 'dots',
  mask: false
});
</script>

<template>
  <div class="flex-center-col size-full loading-container" :class="{ 'global-mask': mask }">
    <div v-if="type === 'cubes'" class="loop cubes">
      <div class="item cubes" v-for="i in 6" :key="i"></div>
    </div>
    <div v-else class="loader" :class="type"></div>
    <p v-if="props.text" class="msg">{{ props.text }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/modules/loading.scss';
</style>