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
.f-tabs {
  width: 100%;
  overflow: hidden;
  transition: background 0.3s ease;

  &__nav-container {
    position: relative;
    width: 100%;
  }

  &__nav {
    display: flex;
    position: relative;
    transition: all 0.3s ease;
  }

  &__tab {
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);

    &:hover:not(.disabled):not(.active) {
      color: var(--text);
    }

    &.active {
      color: var(--accent);
      font-weight: 600;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  &__panel {
    padding: 20px;
    animation: tabFadeIn 0.3s ease-out;
  }

  @keyframes tabFadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // ----- line 样式 (下划线风格) -----
  &--line {
    .f-tabs__nav {
      border-bottom: 1px solid var(--border);
      padding: 0 10px;
    }

    .f-tabs__tab {
      padding: 14px 20px;
      margin-bottom: -1px;
      border-bottom: 2px solid transparent;

      &.active {
        border-bottom-color: var(--accent);
      }

      &:hover:not(.disabled):not(.active) {
        color: var(--text);
      }
    }
  }

  // ----- bar 样式 (胶囊风格) -----
  &--bar {
    .f-tabs__nav {
      gap: 6px;
      padding: 10px;
    }

    .f-tabs__tab {
      padding: 8px 18px;
      border-radius: 100px;

      &:hover:not(.disabled):not(.active) {
        background: var(--surface2);
      }

      &.active {
        background: var(--accent);
        color: #fff; // 胶囊模式Active文字强制白色以保证对比度
        box-shadow: 0 4px 12px rgba(var(--accent), 0.2);
      }
    }
  }

  // ----- card 样式 (卡片/浏览器标签风格) -----
  &--card {
    background: transparent; // 卡片模式通常背景透明或靠 Panel 撑起

    .f-tabs__nav {
      gap: 4px;
      padding: 10px 10px 0 10px;
    }

    .f-tabs__tab {
      padding: 10px 20px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: var(--radius) var(--radius) 0 0;

      &.active {
        background: var(--surface);
        border-color: var(--border);
        color: var(--accent);
        position: relative;
        z-index: 2;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--surface);
        }
      }
    }

    .f-tabs__panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }
  }

  // ----- segment 样式 (分段控制器风格) -----
  &--segment {
    background: transparent;

    .f-tabs__nav {
      background: var(--surface3);
      border-radius: var(--radius);
      padding: 4px;
      margin: 0;
      border: 1px solid var(--border);
    }

    .f-tabs__tab {
      flex: 1;
      padding: 6px 12px;
      border-radius: calc(var(--radius) - 2px);

      &.active {
        background: var(--surface);
        color: var(--accent);
        box-shadow: 0 2px 8px var(--shadow);
      }
    }
  }
}

:root.light {
  .f-tabs--bar .f-tabs__tab.active {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .f-tabs--segment .f-tabs__tab.active {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
}
</style>