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
.f-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s, opacity 0.2s;
  color: var(--text-link);

  &--underline-none {
    text-decoration: none;
  }

  &--underline-always {
    text-decoration: underline;
  }

  &--underline-hover {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &--default {
    color: var(--text);
  }

  &--muted {
    color: var(--text-muted);
  }

  &--accent {
    color: var(--accent);

    &:hover {
      color: var(--accent-hover);
    }
  }

  &--accent2 {
    color: var(--accent2);

    &:hover {
      color: var(--accent2-hover);
    }
  }

  &--green {
    color: var(--green);
  }

  &--red {
    color: var(--red);
  }

  &--blue {
    color: var(--blue);
  }

  &--gold {
    color: var(--gold);
  }

  &:hover {
    color: var(--accent-hover);
  }

  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
