<script lang="ts" setup>
import type { FRateProps } from '@/types';
import { Star, StarHalf, StarOutline } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const model = defineModel<number>({ default: 0 });

const props = withDefaults(defineProps<FRateProps>(), {
  count: 5,
  readonly: false,
  allowHalf: false,
  color: '#f5a623',
  voidColor: '#c0c4cc',
  showText: false,
  scoreTemplate: '{value} 分',
  size: 'normal'
});

const emit = defineEmits<{
  change: [value: number]
}>();

const hoverValue = ref<number | null>(null);
const displayValue = computed(() => hoverValue.value ?? model.value);
const scoreText = computed(() =>
  props.scoreTemplate.replace('{value}', String(model.value))
);
const starSize = computed(() =>
  props.size === 'normal' ? 16 :
    props.size === 'small' ? 12 : 20
)

const getStarType = (index: number): 'full' | 'half' | 'empty' => {
  const val = displayValue.value;
  if (val >= index) return 'full';
  if (props.allowHalf && val >= index - 0.5) return 'half';
  return 'empty';
}

const getStarColor = (index: number): string => {
  return getStarType(index) === 'full' ? props.voidColor : props.color;
}

const onMouseMove = (event: MouseEvent, index: number) => {
  if (props.readonly) return;
  if (props.allowHalf) {
    const target = event.currentTarget as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    hoverValue.value = (event.clientX - left) / width < 0.5 ? index - 0.5 : index;
  } else {
    hoverValue.value = index;
  }
}

const onMouseLeave = () => {
  if (props.readonly) return;
  hoverValue.value = null;
}

const onClick = () => {
  if (props.readonly) return;
  const val = hoverValue.value ?? model.value;
  model.value = val;
  emit('change', val);
}
</script>

<template>
  <div class="f-rate" :class="{ 'f-rate--readonly': props.readonly }" @mouseleave="onMouseLeave">
    <span v-for="index in props.count" :key="index" class="f-rate__item" @mousemove="onMouseMove($event, index)"
      @click="onClick">
      <f-icon :color="getStarColor(index)" :size="starSize">
        <StarOutline v-if="getStarType(index) === 'full'" />
        <StarHalf v-else-if="getStarType(index) === 'half'" />
        <Star v-else />
      </f-icon>
    </span>

    <span v-if="props.showText" class="f-rate__score">
      {{ scoreText }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.f-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &__item {
    cursor: pointer;
    transition: transform 0.1s ease;
    line-height: 1;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__score {
    margin-left: 8px;
    font-size: 14px;
    color: #606266;
    line-height: 1;
  }

  &--readonly {
    .f-rate__item {
      cursor: default;

      &:hover {
        transform: none;
      }
    }
  }
}
</style>