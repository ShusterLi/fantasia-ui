<script lang="ts" setup>
import type { FTabsProps } from '@/types';

const props = withDefaults(defineProps<FTabsProps>(), {
  type: 'line'
})
const emit = defineEmits<{
  (e: 'update:active', value: string): void
  (e: 'change', value: string): void
}>()

const activeTab = computed({
  get: () => {
    if (props.active && props.tabs.some(tab => tab.name === props.active && !tab.disabled)) {
      return props.active
    }
    const firstEnabled = props.tabs.find(tab => !tab.disabled)
    return firstEnabled?.name ?? ''
  },
  set: (val: string) => {
    emit('update:active', val)
    emit('change', val)
  }
})

const setActiveTab = (tabName: string, disabled?: boolean) => {
  if (disabled) return
  activeTab.value = tabName
}
</script>

<template>
  <div class="f-tabs" :class="[`f-tabs--${type}`]">
    <div class="f-tabs__nav-container">
      <div class="f-tabs__nav">
        <div v-for="tab in tabs" :key="tab.name" class="f-tabs__tab" :class="{
          active: activeTab === tab.name,
          disabled: tab.disabled
        }" @click="setActiveTab(tab.name, tab.disabled)">
          <span class="f-tabs__label">{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <div v-for="tab in tabs" v-show="activeTab === tab.name" :key="tab.name" class="f-tabs__panel">
      <slot :name="tab.name"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-tabs.scss';
</style>

