<script lang="ts" setup>
import type { FBreadcrumbProps } from '@/types';

const props = withDefaults(defineProps<FBreadcrumbProps>(), {
  items: () => [],
  separator: '/',
  animated: false
})
</script>

<template>
  <nav class="f-breadcrumb" :class="{ 'f-breadcrumb--animated': animated }" aria-label="breadcrumb">
    <TransitionGroup name="breadcrumb">
      <template v-for="(item, index) in items" :key="item.label">
        <span v-if="index > 0" :key="`sep-${item.label}`" class="f-breadcrumb__sep" aria-hidden="true">
          {{ separator }}
        </span>

        <template v-if="index === items.length - 1">
          <slot :item="item">
            <span class="f-breadcrumb__current" aria-current="page">{{ item.label }}</span>
          </slot>
        </template>

        <a v-else-if="item.href" :href="item.href" class="f-breadcrumb__link">
          {{ item.label }}
        </a>
        <span v-else class="f-breadcrumb__text">{{ item.label }}</span>
      </template>
    </TransitionGroup>
  </nav>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-breadcrumb.scss';
</style>
