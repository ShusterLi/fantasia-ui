<script setup lang="ts">
import type { FMarqueeProps } from '@/types';

const props = withDefaults(defineProps<FMarqueeProps>(), {
  direction: 'left',
  speed: 50,
  pauseOnHover: false,
  autoplay: true,
});

const emit = defineEmits<{
  (e: 'scroll-end'): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const isPlaying = ref(props.autoplay);
const translateX = ref(0);
const translateY = ref(0);
const contentWidth = ref(0);
const contentHeight = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);

let animationId: number | null = null;
let lastTimestamp = 0;

// 更新尺寸
const updateDimensions = () => {
  if (!containerRef.value || !contentRef.value) return;

  containerWidth.value = containerRef.value.offsetWidth;
  containerHeight.value = containerRef.value.offsetHeight;
  contentWidth.value = contentRef.value.scrollWidth;
  contentHeight.value = contentRef.value.scrollHeight;
};

// 动画循环
const animate = (timestamp: number) => {
  if (!isPlaying.value) {
    animationId = requestAnimationFrame(animate);
    return;
  }

  if (lastTimestamp === 0) {
    lastTimestamp = timestamp;
  }

  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  const moveDistance = (props.speed * deltaTime) / 1000;

  if (props.direction === 'left' || props.direction === 'right') {
    // 水平滚动
    if (props.direction === 'left') {
      translateX.value -= moveDistance;
      if (Math.abs(translateX.value) >= contentWidth.value) {
        translateX.value = containerWidth.value;
        emit('scroll-end');
      }
    } else {
      translateX.value += moveDistance;
      if (translateX.value >= containerWidth.value) {
        translateX.value = -contentWidth.value;
        emit('scroll-end');
      }
    }
  } else {
    // 垂直滚动
    if (props.direction === 'up') {
      translateY.value -= moveDistance;
      if (Math.abs(translateY.value) >= contentHeight.value) {
        translateY.value = containerHeight.value;
        emit('scroll-end');
      }
    } else {
      translateY.value += moveDistance;
      if (translateY.value >= containerHeight.value) {
        translateY.value = -contentHeight.value;
        emit('scroll-end');
      }
    }
  }

  animationId = requestAnimationFrame(animate);
};

// 开始播放
const play = () => {
  isPlaying.value = true;
};

// 暂停播放
const pause = () => {
  isPlaying.value = false;
};

// 重置
const reset = () => {
  translateX.value = 0;
  translateY.value = 0;
  if (props.direction === 'left') {
    translateX.value = containerWidth.value;
  } else if (props.direction === 'right') {
    translateX.value = -contentWidth.value;
  } else if (props.direction === 'up') {
    translateY.value = containerHeight.value;
  } else if (props.direction === 'down') {
    translateY.value = -contentHeight.value;
  }
};

// 内容样式
const contentStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px)`,
  whiteSpace: props.direction === 'left' || props.direction === 'right' ? 'nowrap' : 'normal',
}));

// 鼠标事件
const handleMouseEnter = () => {
  if (props.pauseOnHover) {
    pause();
  }
};

const handleMouseLeave = () => {
  if (props.pauseOnHover) {
    play();
  }
};

onMounted(() => {
  updateDimensions();
  reset();
  if (props.autoplay) {
    animationId = requestAnimationFrame(animate);
  }
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

// 监听窗口大小变化
useEventListener(window, 'resize', updateDimensions);

// 暴露方法
defineExpose({
  play,
  pause,
  reset
});
</script>

<template>
  <div
    ref="containerRef"
    class="f-marquee"
    :class="`f-marquee--${direction}`"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="contentRef"
      class="f-marquee__content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-marquee.scss';
</style>
