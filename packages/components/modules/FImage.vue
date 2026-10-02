<script lang="ts" setup>
import type { FImageProps } from '@/types';
import { PictureError } from '@/assets';
import FIcon from './FIcon.vue';
import FLoading from './FLoading.vue';

const props = withDefaults(defineProps<FImageProps>(), {
  fit: 'cover',
  lazy: true
});

const status = ref<'loading' | 'loaded' | 'error'>('loading');

watch(() => props.src, () => {
  status.value = 'loading';
}, { immediate: false });

const onLoad = () => status.value = 'loaded';
const onError = () => status.value = 'error';

defineSlots<{
  error?: () => any
}>();
</script>

<template>
  <div class="f-image">
    <Transition name="fade">
      <div v-if="status === 'loading'" class="f-image__placeholder">
        <f-loading type="classic first" />
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="status === 'error'" class="f-image__error">
        <slot name="error">
          <f-icon size="48px">
            <PictureError />
          </f-icon>
        </slot>
      </div>
    </Transition>

    <img v-show="status === 'loaded'" :src="props.src" :loading="lazy ? 'lazy' : 'eager'"
      :style="{ objectFit: props.fit }" class="f-image__img" @load="onLoad" @error="onError" />
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-image.scss';
</style>

