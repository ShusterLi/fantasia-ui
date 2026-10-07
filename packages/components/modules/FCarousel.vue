<script setup lang="ts">
import type { FCarouselProps, FCarouselItem } from '@/types';
import { ChevronBackOutline, ChevronForwardOutline, PauseOutline, PlayOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FCarouselProps>(), {
  items: () => [],
  autoplay: true,
  interval: 3000,
  showIndicators: true,
  showControls: true,
  loop: true,
  indicatorType: 'dot',
  indicatorPosition: 'bottom',
  direction: 'horizontal',
  effect: 'slide',
});

const emit = defineEmits<{
  (e: 'change', index: number, item: FCarouselItem): void;
  (e: 'prev', index: number): void;
  (e: 'next', index: number): void;
}>();

const currentIndex = ref(0);
const isPlaying = ref(props.autoplay);
const timer = ref<NodeJS.Timeout | null>(null);

// 获取当前项目
const currentItem = computed(() => {
  if (props.items.length === 0) return null;
  return props.items[currentIndex.value];
});

// 开始自动播放
const startAutoplay = () => {
  if (!props.autoplay || timer.value) return;
  
  timer.value = setInterval(() => {
    nextSlide();
  }, props.interval);
};

// 停止自动播放
const stopAutoplay = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

// 切换到指定索引
const goToSlide = (index: number) => {
  if (index === currentIndex.value) return;
  
  const oldIndex = currentIndex.value;
  currentIndex.value = index;
  
  emit('change', index, props.items[index]);
  if (oldIndex > index) {
    emit('prev', index);
  } else {
    emit('next', index);
  }
};

// 切换到上一张
const prevSlide = () => {
  if (props.loop) {
    const newIndex = (currentIndex.value - 1 + props.items.length) % props.items.length;
    goToSlide(newIndex);
  } else if (currentIndex.value > 0) {
    goToSlide(currentIndex.value - 1);
  }
};

// 切换到下一张
const nextSlide = () => {
  if (props.loop) {
    const newIndex = (currentIndex.value + 1) % props.items.length;
    goToSlide(newIndex);
  } else if (currentIndex.value < props.items.length - 1) {
    goToSlide(currentIndex.value + 1);
  }
};

// 播放/暂停
const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
};

// 鼠标悬停时暂停
const handleMouseEnter = () => {
  if (props.autoplay) {
    stopAutoplay();
  }
};

// 鼠标离开时恢复
const handleMouseLeave = () => {
  if (props.autoplay && isPlaying.value) {
    startAutoplay();
  }
};

onMounted(() => {
  if (props.autoplay && isPlaying.value) {
    startAutoplay();
  }
});

onBeforeUnmount(() => {
  stopAutoplay();
});

// 暴露方法
defineExpose({
  prevSlide,
  nextSlide,
  goToSlide,
  togglePlay,
  startAutoplay,
  stopAutoplay
});
</script>

<template>
  <div
    class="f-carousel"
    :class="[
      `f-carousel--${direction}`,
      `f-carousel--${effect}`,
      `f-carousel--indicator-${indicatorPosition}`,
      { 'f-carousel--vertical': direction === 'vertical' }
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 轮播容器 -->
    <div class="f-carousel__container">
      <!-- 轮播内容 -->
      <div class="f-carousel__track" :style="{ transform: direction === 'horizontal' ? `translateX(-${currentIndex * 100}%)` : `translateY(-${currentIndex * 100}%)` }">
        <slot>
          <template v-if="items && items.length > 0">
            <div
              v-for="(item, index) in items"
              :key="item.id || index"
              class="f-carousel__item"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.src"
                :alt="item.alt || ''"
                class="f-carousel__image"
              />
              <div
                v-else-if="item.type === 'html'"
                class="f-carousel__html-content"
                v-html="item.content"
              />
              <div
                v-else
                class="f-carousel__content"
              >
                {{ item.content }}
              </div>
              
              <!-- 内容覆盖层 -->
              <div v-if="item.title || item.description" class="f-carousel__overlay">
                <div v-if="item.title" class="f-carousel__title">{{ item.title }}</div>
                <div v-if="item.description" class="f-carousel__description">{{ item.description }}</div>
              </div>
            </div>
          </template>
          <slot v-else name="empty">
            <div class="f-carousel__empty">
              暂无内容
            </div>
          </slot>
        </slot>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div v-if="showControls && items && items.length > 1" class="f-carousel__controls">
      <button
        class="f-carousel__control f-carousel__control--prev"
        @click="prevSlide"
        :disabled="!loop && currentIndex === 0"
      >
        <FIcon>
          <ChevronBackOutline />
        </FIcon>
      </button>
      
      <button
        class="f-carousel__control f-carousel__control--next"
        @click="nextSlide"
        :disabled="!loop && currentIndex === items.length - 1"
      >
        <FIcon>
          <ChevronForwardOutline />
        </FIcon>
      </button>
    </div>

    <!-- 指示器 -->
    <div v-if="showIndicators && items && items.length > 1" class="f-carousel__indicators">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="f-carousel__indicator"
        :class="{
          'f-carousel__indicator--active': index === currentIndex,
          'f-carousel__indicator--dot': indicatorType === 'dot',
          'f-carousel__indicator--line': indicatorType === 'line',
          'f-carousel__indicator--number': indicatorType === 'number'
        }"
        @click="goToSlide(index)"
      >
        <span v-if="indicatorType === 'number'">{{ index + 1 }}</span>
      </button>
    </div>

    <!-- 播放/暂停按钮 -->
    <div v-if="autoplay" class="f-carousel__play-control">
      <button class="f-carousel__play-button" @click="togglePlay">
        <FIcon>
          <component :is="isPlaying ? PauseOutline : PlayOutline" />
        </FIcon>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-carousel.scss';
</style>
