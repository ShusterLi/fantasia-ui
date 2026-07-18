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
.f-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
  font-size: 12px;

  &__sep {
    color: var(--text-dim);
    user-select: none;
    line-height: 1;
  }

  &__link {
    color: var(--text-link);
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
      color: var(--accent-hover);
    }

    &:active {
      opacity: 0.7;
    }
  }

  &__text {
    color: var(--text-dim);
  }

  &__current {
    color: var(--text-muted);
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(6px);
}

.f-breadcrumb:not(.f-breadcrumb--animated) {

  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: none;
  }

  .breadcrumb-enter-from,
  .breadcrumb-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>