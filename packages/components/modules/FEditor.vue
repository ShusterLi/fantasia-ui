<script lang="ts" setup>
import type { FEditorProps } from '@/types';
import FTag from './FTag.vue';

const model = defineModel<string>({ default: '' });

const props = withDefaults(defineProps<FEditorProps>(), {
  height: 420
})

const emit = defineEmits<{
  blur: [];
}>();

const LINE_HEIGHT_PX = 17.6;
const PADDING_TOP_PX = 12;

const textareaRef = ref<HTMLTextAreaElement>();
const highlightRef = ref<HTMLElement>();
const gutterRef = ref<HTMLElement>();

const scrollTop = ref(0);
const currentLine = ref(1);
const cursorPos = ref(0);

// ---------- 缩进 ----------
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = textareaRef.value;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    model.value = model.value.slice(0, start) + '  ' + model.value.slice(end);
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
    return;
  }

  if (e.key === 'Enter') {
    const el = textareaRef.value;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = model.value.lastIndexOf('\n', start - 1) + 1;
    const currentLineText = model.value.slice(lineStart, start);
    const indentMatch = currentLineText.match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : '';
    const lastChar = currentLineText.trim().slice(-1);
    const extra = lastChar === '{' || lastChar === '[' ? '  ' : '';

    if (extra) {
      e.preventDefault();
      const insert = '\n' + indent + extra;
      model.value = model.value.slice(0, start) + insert + model.value.slice(start);
      nextTick(() => {
        el.selectionStart = el.selectionEnd = start + insert.length;
      });
    }
  }
};

// ---------- 高度 --------------
const MAX_BODY_HEIGHT = props.height;
const MIN_BODY_HEIGHT = 180;

const bodyHeight = computed(() => {
  const contentHeight = PADDING_TOP_PX * 2 + lineCount.value * LINE_HEIGHT_PX;
  return Math.min(MAX_BODY_HEIGHT, Math.max(MIN_BODY_HEIGHT, contentHeight));
});

// ---------- 行号/当前行 ----------
const updateCursorInfo = () => {
  const el = textareaRef.value;
  if (!el) return;
  cursorPos.value = el.selectionStart;
  currentLine.value = model.value.slice(0, el.selectionStart).split('\n').length;
};

const lines = computed(() => model.value.split('\n'));
const lineCount = computed(() => lines.value.length);

// ---------- 大量数据处理：tokenize，将每行 + 行数拆分后再渲染 ----------
const HEAVY_LINE_THRESHOLD = 1500; // 超过该行数时关闭 token 高亮，避免性能下降
const isHeavy = computed(() => lineCount.value > HEAVY_LINE_THRESHOLD);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedSource = ref(model.value);

watch(model, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  // 对于很小的文本，直接全量重新渲染；对于大文本，则避免每次都重新计算 token 数量
  const delay = val.length > 20000 ? 120 : 0;
  debounceTimer = setTimeout(() => {
    debouncedSource.value = val;
  }, delay);
}, { immediate: true });

// ---------- 错误定位 ----------
const errorPosition = computed<number | null>(() => {
  if (props.language !== 'json' || !debouncedSource.value.trim()) return null;
  try {
    JSON.parse(debouncedSource.value);
    return null;
  } catch (err: any) {
    const msg: string = err.message || '';
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) return parseInt(posMatch[1]!, 10);

    const lineColMatch = msg.match(/line (\d+) column (\d+)/);
    if (lineColMatch) {
      const line = parseInt(lineColMatch[1]!, 10);
      const col = parseInt(lineColMatch[2]!, 10);
      const ls = debouncedSource.value.split('\n');
      let offset = 0;
      for (let i = 0; i < line - 1; i++) offset += ls[i]!.length + 1;
      return offset + col - 1;
    }
    return debouncedSource.value.length;
  }
});

const errorLine = computed(() => {
  if (errorPosition.value === null) return null;
  return debouncedSource.value.slice(0, errorPosition.value).split('\n').length;
});

const isJsonValid = computed(() => errorPosition.value === null);

const formatJson = () => {
  if (props.language !== 'json') return;
  try {
    model.value = JSON.stringify(JSON.parse(model.value), null, 2);
  } catch {
    // 默认失败
  }
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tokenize = (text: string): string => {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/("(?:\\.|[^"\\])*")(\s*:)?/g, (_m, str, colon) => {
      const cls = colon ? 'tok-key' : 'tok-string';
      return `<span class="${cls}">${str}</span>${colon ? colon : ''}`;
    })
    .replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/(-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)/g, '<span class="tok-number">$1</span>')
    .replace(/([{}[\],])/g, '<span class="tok-punct">$1</span>');
};

// 逐行渲染，按行增加 wrapper，避免大文本时通过 tokenize 处理过慢
const renderedLines = computed(() => {
  const src = debouncedSource.value;
  const ls = src.split('\n');
  const errPos = errorPosition.value;
  const errLn = errorLine.value;

  let runningOffset = 0;
  return ls.map((lineText, idx) => {
    const lineNo = idx + 1;
    const lineStart = runningOffset;
    runningOffset += lineText.length + 1;

    let html: string;
    if (errLn === lineNo && errPos !== null) {
      const localPos = errPos - lineStart;
      const before = lineText.slice(0, Math.max(0, localPos));
      const errChar = lineText.slice(localPos, localPos + 1) || ' ';
      const after = lineText.slice(localPos + 1);
      html =
        (isHeavy.value ? escapeHtml(before) : tokenize(before)) +
        `<span class="tok-error">${escapeHtml(errChar)}</span>` +
        (isHeavy.value ? escapeHtml(after) : tokenize(after));
    } else if (props.language === 'json' && !isHeavy.value) {
      html = tokenize(lineText);
    } else {
      html = escapeHtml(lineText);
    }

    return { lineNo, html: html || '&nbsp;' };
  });
});

const syncScroll = () => {
  if (!textareaRef.value) return;
  scrollTop.value = textareaRef.value.scrollTop;
  if (highlightRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop;
    highlightRef.value.scrollLeft = textareaRef.value.scrollLeft;
  }
  if (gutterRef.value) {
    gutterRef.value.scrollTop = textareaRef.value.scrollTop;
  }
};

const onInputOrScroll = () => {
  syncScroll();
  updateCursorInfo();
};
</script>

<template>
  <div class="f-editor" :class="{ 'f-editor--invalid': !isJsonValid }">
    <div class="f-editor__toolbar">
      <span class="f-editor__status">
        <span class="f-editor__lines">{{ lineCount }} 行</span>
        <f-tag color="orange" v-if="isHeavy" type="square" effect="plain">大文件已关闭高亮</f-tag>
      </span>
      <button v-if="language === 'json'" type="button" class="f-editor__format" @click="formatJson">
        格式化
      </button>
    </div>

    <div class="f-editor__body" :style="{ height: `${bodyHeight}px` }">
      <div v-if="showLine" ref="gutterRef" class="f-editor__gutter">
        <div v-for="ln in lineCount" :key="ln" class="f-editor__gutter-line"
          :class="{ 'f-editor__gutter-line--active': ln === currentLine }">
          {{ ln }}
        </div>
      </div>

      <div class="f-editor__code-wrapper">
        <!-- 当前行高亮 -->
        <div class="f-editor__active-line" :style="{
          top: `${PADDING_TOP_PX + (currentLine - 1) * LINE_HEIGHT_PX - scrollTop}px`,
          height: `${LINE_HEIGHT_PX}px`,
        }" />

        <pre ref="highlightRef" class="f-editor__highlight"><span
          v-for="line in renderedLines"
          :key="line.lineNo"
          class="f-editor__line"
          v-html="line.html + '\n'"
        /></pre>

        <textarea ref="textareaRef" v-model="model" :rows="rows ?? 8" :readonly="readonly" class="f-editor__textarea"
          spellcheck="false" :placeholder="placeholder" @keydown="onKeydown" @scroll="syncScroll"
          @input="onInputOrScroll" @click="updateCursorInfo" @keyup="updateCursorInfo" @blur="emit('blur')" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-editor.scss';
</style>

