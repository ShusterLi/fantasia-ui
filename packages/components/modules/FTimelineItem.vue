<script setup lang="ts">
import type { FTimelineItemProps } from '@/types';
import FIcon from './FIcon.vue';
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5';

const props = withDefaults(defineProps<FTimelineItemProps>(), {
  color: 'default',
  type: 'default',
  collapsible: false,
  defaultCollapsed: false,
});

const direction = inject<'vertical' | 'horizontal'>('timelineDirection', 'vertical');
const isCollapsed = ref(props.defaultCollapsed);

const toggleCollapse = () => {
  if (!props.collapsible) return;
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="f-timeline-item" :class="[
    `f-timeline-item--${color}`,
    `f-timeline-item--${type}`,
    { 'is-collapsible': collapsible, 'is-collapsed': isCollapsed }
  ]">
    <div class="f-timeline-item__tail" />
    
    <div class="f-timeline-item__node" @click="toggleCollapse">
      <slot name="dot">
        <f-icon v-if="icon" :size="16">
          <component :is="icon" />
        </f-icon>
        <div v-else class="f-timeline-item__dot" />
      </slot>
      
      <!-- 折叠按钮 -->
      <div v-if="collapsible" class="f-timeline-item__collapse-icon">
        <f-icon :size="14">
          <component :is="isCollapsed ? ChevronDownOutline : ChevronUpOutline" />
        </f-icon>
      </div>
    </div>
    
    <div class="f-timeline-item__wrapper">
      <div 
        v-if="timestamp || collapsible" 
        class="f-timeline-item__header"
        :class="{ 'is-clickable': collapsible }"
        @click="toggleCollapse"
      >
        <div v-if="timestamp" class="f-timeline-item__timestamp">
          {{ timestamp }}
        </div>
        <slot name="title" />
      </div>
      
      <Transition name="timeline-collapse">
        <div v-show="!isCollapsed" class="f-timeline-item__content">
          <slot />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-timeline-item.scss';
</style>
