<script lang="ts" setup>
import type { FPaginationProps } from '@/types';
import { ChevronBackOutline, ChevronForwardOutline, EllipsisHorizontal } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

const props = withDefaults(defineProps<FPaginationProps>(), {
  pageSize: 10,
  hideOnSingle: false,
  pageSizes: () => [10, 20, 50, 100],
  layout: () => ['prev', 'pager', 'next'],
});

const emit = defineEmits<{
  'update:pageSize': [size: number];
}>();

const currentPage = defineModel<number>({ default: 1 });

const layoutItems = computed(() =>
  props.layout ?? ['prev', 'pager', 'next']
);

const pageCount = computed(() => Math.ceil(props.total / props.pageSize) || 1);

const pages = computed(() => {
  const total = pageCount.value;
  const cur = currentPage.value;
  if (!total || total <= 0) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', cur - 1, cur, cur + 1, '...', total];
});

const go = (page: number | string) => {
  if (typeof page !== 'number') return;
  if (page < 1 || page > pageCount.value || page === currentPage.value) return;
  currentPage.value = page;
};

const onPageSizeChange = (e: Event) => {
  emit('update:pageSize', parseInt((e.target as HTMLSelectElement).value, 10));
  currentPage.value = 1;
};

const jumpInput = ref('');
const onJump = () => {
  const n = parseInt(jumpInput.value, 10);
  if (!isNaN(n)) go(n);
  jumpInput.value = '';
};
</script>

<template>
  <div v-if="!hideOnSingle || pageCount > 1" class="f-pagination">

    <template v-for="item in layoutItems" :key="item">

      <span v-if="item === 'total'" class="f-pagination__total">
        共 {{ total }} 条
      </span>

      <div v-else-if="item === 'sizes'" class="f-pagination__size">
        <select class="size-select" :value="pageSize" @change="onPageSizeChange">
          <option v-for="s in pageSizes" :key="s" :value="s">{{ s }} 条/页</option>
        </select>
      </div>

      <button v-else-if="item === 'prev'" class="page-btn" :class="{ disabled: currentPage === 1 }"
        @click="go(currentPage - 1)">
        <f-icon>
          <ChevronBackOutline />
        </f-icon>
      </button>

      <ul v-else-if="item === 'pager'" class="f-pagination__list">
        <template v-for="(page, index) in pages" :key="index">
          <li v-if="page === '...'" class="page-btn ellipsis">
            <f-icon>
              <EllipsisHorizontal />
            </f-icon>
          </li>
          <li v-else class="page-btn" :class="{ active: currentPage === page }" @click="go(page)">
            {{ page }}
          </li>
        </template>

      </ul>

      <button v-else-if="item === 'next'" class="page-btn" :class="{ disabled: currentPage === pageCount }"
        @click="go(currentPage + 1)">
        <f-icon>
          <ChevronForwardOutline />
        </f-icon>
      </button>

      <div v-else-if="item === 'jumper'" class="f-pagination__jump">
        <span class="jump-label">前往</span>
        <input v-model="jumpInput" class="jump-input" type="number" :min="1" :max="pageCount" @keydown.enter="onJump"
          @blur="onJump" />
        <span class="jump-label">页</span>
      </div>

    </template>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-pagination.scss';
</style>
