<script setup lang="ts">
import type { FDatePickerProps } from '@/types';
import FIcon from './FIcon.vue';
import FDropdown from './FDropdown.vue';
import { CalendarOutline, ChevronBackOutline, ChevronForwardOutline, CloseCircleOutline } from '@vicons/ionicons5';

const modelValue = defineModel<Date | null>({ default: null });

const props = withDefaults(defineProps<FDatePickerProps>(), {
  placeholder: '选择日期',
  disabled: false,
  clearable: true,
  format: 'YYYY-MM-DD',
});

const isOpen = ref(false);
const isFocused = ref(false);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const formItemContext = inject<{ errorMsg: Ref<string>, validate: () => void } | null>('FFormItemContext', null);
const hasError = computed(() => !!formItemContext?.errorMsg?.value);

// 格式化日期
const formatDate = (date: Date | null, format: string): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
};

const displayValue = computed(() => {
  return modelValue.value ? formatDate(modelValue.value, props.format) : '';
});

const showClear = computed(() => {
  return props.clearable && modelValue.value && !props.disabled;
});

// 日历数据
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  
  // 当月第一天
  const firstDay = new Date(year, month, 1);
  const firstDayWeek = firstDay.getDay();
  
  // 当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 上月天数
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  const days: Array<{
    date: number;
    month: 'prev' | 'current' | 'next';
    fullDate: Date;
    isToday: boolean;
    isSelected: boolean;
  }> = [];
  
  // 填充上月日期
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const date = prevMonthDays - i;
    days.push({
      date,
      month: 'prev',
      fullDate: new Date(year, month - 1, date),
      isToday: false,
      isSelected: false,
    });
  }
  
  // 填充当月日期
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(year, month, i);
    const isToday = today.getFullYear() === year && 
                    today.getMonth() === month && 
                    today.getDate() === i;
    const isSelected = modelValue.value 
      ? modelValue.value.getFullYear() === year && 
        modelValue.value.getMonth() === month && 
        modelValue.value.getDate() === i
      : false;
    
    days.push({
      date: i,
      month: 'current',
      fullDate,
      isToday,
      isSelected,
    });
  }
  
  // 填充下月日期
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      month: 'next',
      fullDate: new Date(year, month + 1, i),
      isToday: false,
      isSelected: false,
    });
  }
  
  return days;
});

const currentYearMonth = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`;
});

const selectDate = (day: any) => {
  if (props.disabled) return;
  
  modelValue.value = day.fullDate;
  
  if (day.month === 'prev') {
    prevMonth();
  } else if (day.month === 'next') {
    nextMonth();
  }
  
  isOpen.value = false;
  formItemContext?.validate();
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const clearValue = (e: MouseEvent) => {
  e.stopPropagation();
  modelValue.value = null;
  formItemContext?.validate();
};

const handleShow = () => {
  isOpen.value = true;
  isFocused.value = true;
  // 重置为当前选中日期的月份，或今天
  if (modelValue.value) {
    currentYear.value = modelValue.value.getFullYear();
    currentMonth.value = modelValue.value.getMonth();
  } else {
    const today = new Date();
    currentYear.value = today.getFullYear();
    currentMonth.value = today.getMonth();
  }
};

const handleHide = () => {
  isOpen.value = false;
  isFocused.value = false;
};
</script>

<template>
  <f-dropdown 
    trigger="click"
    placement="bottom-start"
    :offset="4"
    :disabled="disabled"
    @show="handleShow"
    @hide="handleHide"
  >
    <div class="f-date-picker" :class="{
      'is-focus': isFocused,
      'is-error': hasError,
      'is-disabled': disabled,
    }">
      <div class="f-date-picker__inner">
        <f-icon class="f-date-picker__icon">
          <CalendarOutline />
        </f-icon>
        
        <input
          :value="displayValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="f-date-picker__input"
          readonly
        />
        
        <f-icon 
          v-if="showClear" 
          class="f-date-picker__clear"
          @click="clearValue"
        >
          <CloseCircleOutline />
        </f-icon>
      </div>
    </div>
    
    <template #content>
      <div class="f-date-picker-panel">
        <div class="f-date-picker-panel__header">
          <button type="button" class="panel-btn" @click="prevMonth">
            <f-icon :size="18">
              <ChevronBackOutline />
            </f-icon>
          </button>
          
          <span class="panel-title">{{ currentYearMonth }}</span>
          
          <button type="button" class="panel-btn" @click="nextMonth">
            <f-icon :size="18">
              <ChevronForwardOutline />
            </f-icon>
          </button>
        </div>
        
        <div class="f-date-picker-panel__body">
          <div class="week-header">
            <div v-for="day in weekDays" :key="day" class="week-day">
              {{ day }}
            </div>
          </div>
          
          <div class="calendar-grid">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-cell"
              :class="{
                'is-prev-month': day.month === 'prev',
                'is-next-month': day.month === 'next',
                'is-today': day.isToday,
                'is-selected': day.isSelected,
              }"
              @click="selectDate(day)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </f-dropdown>
</template>

<style lang="scss" scoped>
@use '../../styles/components/f-date-picker.scss';
</style>
