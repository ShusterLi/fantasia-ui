<script lang="ts" setup>
import type { FLinkProps } from '@/types';

const props = withDefaults(defineProps<FLinkProps>(), {
  target: '_self',
  underline: 'hover',
});
</script>

<template>
  <a class="f-link" :class="[
    props.color && `f-link--${props.color}`,
    `f-link--underline-${props.underline}`,
    { 'f-link--disabled': props.disabled }
  ]" :href="props.disabled ? undefined : props.href" :target="props.target"
    :rel="props.target === '_blank' ? 'noopener noreferrer' : undefined">
    <slot />
  </a>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-link.scss';
</style>

