<script lang="ts" setup>
import type { FCropProps, ResizeDirection, CropPosition, CropResult } from '@/types';

const resizeDirArray: ResizeDirection[] = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

const props = withDefaults(defineProps<FCropProps>(), {
	resizeDir: () => ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
	size: 200,
	minResizeSize: 50,
	outputFileType: 'image/png',
	outputType: 'file',
	quality: 0.92,
	scale: 2,
	mosaic: false,
	backgroundColor: '',
	cutClass: '',
	resizeClass: ''
});

const emit = defineEmits<{
	crop: [result: CropResult];
	change: [result: CropResult];
	cancel: [];
}>();

const imageUrl = ref('')                  // 图片URL
const cutPosition = ref<CropPosition>({ x: 0, y: 0 })   // 裁剪框位置
const isDragging = ref(false)             // 拖拽状态
const startPos = ref<CropPosition>({ x: 0, y: 0 })      // 拖拽起始坐标
const size = ref(props.size);
const width = ref(props.size);
const height = ref(props.size);
const isResizing = ref(false);              // 调整大小状态
const resizeStartPos = ref<CropPosition>({ x: 0, y: 0 }); // 调整大小起始位置

/* ---------- 计算属性 ---------- */
const maskStyle = computed(() => {
	const x = cutPosition.value.x;
	const y = cutPosition.value.y;
	return {
		clipPath: `polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%,
      0 ${y}px,
      ${x}px ${y}px,
      ${x}px ${y + height.value}px,
      ${x + width.value}px ${y + height.value}px,
      ${x + width.value}px ${y}px,
      ${x}px ${y}px,
      0 ${y}px
    )`
	};
});

/* ---------- 图片源处理 ---------- */
watch(() => props.src, (newSrc) => {
	if (!newSrc) {
		imageUrl.value = '';
		return;
	}

	if (typeof newSrc === 'string') {
		imageUrl.value = newSrc;
	} else if (newSrc instanceof File) {
		imageUrl.value = URL.createObjectURL(newSrc);
	}

	nextTick(() => {
		const img = new Image();
		img.src = imageUrl.value;
		img.onload = () => {
			preCalculate();
			requestAnimationFrame(() => throttledHandleCut());
		};
	});
}, { immediate: true });

/* ---------- 裁剪处理 ---------- */
// 缓存计算变量
let container: HTMLElement | null = null;
let img: HTMLImageElement | null = null;
let containerWidth: number;
let containerHeight: number;
let imgRatio: number;
let containerRatio: number;
let renderedWidth: number;
let renderedHeight: number;
let offsetX: number;
let offsetY: number;

// 节流函数
const rafThrottle = (func: (...args: any[]) => void) => {
	let isRunning = false;
	return (...args: any[]) => {
		if (!isRunning) {
			isRunning = true;
			requestAnimationFrame(() => {
				func.apply(this, args);
				isRunning = false;
			});
		}
	};
};

// 图像预览处理
const preCalculate = () => {
	container = document.querySelector('.preview');
	if (!container) return;
	img = container.querySelector('.image');
	if (!img) return;

	requestAnimationFrame(() => {
		if (!container || !img) return;

		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;
		imgRatio = img.naturalWidth / img.naturalHeight;
		containerRatio = containerWidth / containerHeight;

		if (imgRatio > containerRatio) {
			renderedWidth = containerWidth;
			renderedHeight = containerWidth / imgRatio;
		} else {
			renderedHeight = containerHeight;
			renderedWidth = containerHeight * imgRatio;
		}

		offsetX = (containerWidth - renderedWidth) / 2;
		offsetY = (containerHeight - renderedHeight) / 2;

		const initSize = Math.min(size.value, Math.min(renderedWidth, renderedHeight));
		size.value = initSize;
		width.value = initSize;  // 确保宽高一致
		height.value = initSize;

		const maxX = offsetX + renderedWidth - initSize;
		const maxY = offsetY + renderedHeight - initSize;

		cutPosition.value = {
			x: Math.max(offsetX, Math.min(offsetX + (renderedWidth - initSize) / 2, maxX)),
			y: Math.max(offsetY, Math.min(offsetY + (renderedHeight - initSize) / 2, maxY))
		};
	});
};

// 拖拽开始
const handleDragStart = (e: DragEvent | TouchEvent) => {
	isDragging.value = true;
	isResizing.value = false;
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

	let clientX: number;
	let clientY: number;

	if (e instanceof TouchEvent) {
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
	} else {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	startPos.value = {
		x: clientX - rect.left,
		y: clientY - rect.top
	};

	if (e instanceof DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.setDragImage(new Image(), 0, 0); // 隐藏默认拖拽图像
		}
	} else {
		e.preventDefault();
	}
};

// 拖拽移动
const handleDragMove = (e: DragEvent | TouchEvent) => {
	if (!isDragging.value || isResizing.value) return;

	let clientX: number;
	let clientY: number;

	if (e instanceof TouchEvent) {
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
	} else {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	if (!clientX || !clientY) return;
	e.preventDefault();

	const containerEl = document.querySelector('.preview');
	if (!containerEl) return;

	const rect = containerEl.getBoundingClientRect();

	// 计算新的裁剪框位置
	let newX = clientX - startPos.value.x - rect.left;
	let newY = clientY - startPos.value.y - rect.top;

	// 获取图像显示区域边界
	const imageLeft = offsetX;
	const imageTop = offsetY;
	const imageRight = offsetX + renderedWidth;
	const imageBottom = offsetY + renderedHeight;

	// 限制在图像范围内
	newX = Math.max(imageLeft, Math.min(newX, imageRight - width.value));
	newY = Math.max(imageTop, Math.min(newY, imageBottom - height.value));

	// 更新裁剪框位置
	cutPosition.value = { x: newX, y: newY };

	// 触发节流处理
	throttledHandleCut();
};

// 拖拽结束
const handleDragEnd = () => isDragging.value = false

const tempCanvas = () => {
	return document.createElement('canvas');
}

// 图像裁剪
const handleCut = async (): Promise<CropResult | null> => {
	if (!container || !img) return null;

	const currentOffsetX = offsetX;
	const currentOffsetY = offsetY;
	const currentRenderedWidth = renderedWidth;
	const currentRenderedHeight = renderedHeight;

	// 坐标转换
	const sx = (cutPosition.value.x - currentOffsetX) * (img.naturalWidth / currentRenderedWidth);
	const sy = (cutPosition.value.y - currentOffsetY) * (img.naturalHeight / currentRenderedHeight);

	const validSx = Math.max(0, sx);
	const validSy = Math.max(0, sy);
	const validWidth = Math.min(width.value * (img.naturalWidth / renderedWidth), img.naturalWidth - validSx);
	const validHeight = Math.min(height.value * (img.naturalHeight / renderedHeight), img.naturalHeight - validSy);

	const cvs = tempCanvas();
	cvs.width = width.value * props.scale;
	cvs.height = height.value * props.scale;

	const ctx = cvs.getContext('2d')!;
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	ctx.drawImage(
		img,
		validSx, validSy, validWidth, validHeight,
		0, 0, width.value * props.scale, height.value * props.scale
	);

	return new Promise<CropResult>((resolve) => {
		cvs.toBlob((blob) => {
			if (!blob) {
				resolve({ width: width.value, height: height.value });
				return;
			}

			const result: CropResult = {
				width: width.value * props.scale,
				height: height.value * props.scale
			};

			// 根据 outputType 生成对应格式
			if (props.outputType === 'file' || props.outputType === 'blob') {
				result.blob = blob;
			}

			if (props.outputType === 'file') {
				result.file = new File([blob], `crop-${Date.now()}.${props.outputFileType.split('/')[1]}`, {
					type: props.outputFileType
				});
			}

			if (props.outputType === 'base64') {
				result.base64 = cvs.toDataURL(props.outputFileType, props.quality);
			}

			resolve(result);
		}, props.outputFileType, props.quality);
	});
};

// 节流裁剪函数（实时触发 change 事件）
const throttledHandleCut = rafThrottle(async () => {
	const result = await handleCut();
	if (result) {
		emit('change', result);
	}
});

// 确认裁剪
const handleConfirm = async () => {
	const result = await handleCut();
	if (result) {
		emit('crop', result);
	}
};

// 取消裁剪
const handleCancel = () => {
	emit('cancel');
};

/* ---------- 调整裁剪框大小 ---------- */
const handleResizeStart = (e: MouseEvent | TouchEvent, direction?: string) => {
	if (e instanceof TouchEvent && e.cancelable) e.preventDefault();

	const dirEl = document.getElementById(direction || '');
	if (dirEl) dirEl.classList.add('is_focus');

	isResizing.value = true;
	isDragging.value = false;

	// 获取方向标识
	const dir = direction || (e.target as HTMLElement).dataset?.direction;
	if (!dir) return;

	// 获取坐标（支持鼠标和触摸）
	let clientX: number;
	let clientY: number;

	if (e instanceof TouchEvent) {
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
	} else {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	resizeStartPos.value = { x: clientX, y: clientY };

	// 添加事件监听（同时支持鼠标和触摸）
	const moveEvent = e instanceof MouseEvent ? 'mousemove' : 'touchmove';
	const endEvent = e instanceof MouseEvent ? 'mouseup' : 'touchend';

	const onMove = (moveE: MouseEvent | TouchEvent) => {
		if (!isResizing.value) return;

		// 获取移动坐标
		let moveX: number;
		let moveY: number;

		if (moveE instanceof TouchEvent) {
			moveX = moveE.touches[0].clientX;
			moveY = moveE.touches[0].clientY;
		} else {
			moveX = moveE.clientX;
			moveY = moveE.clientY;
		}

		// 边界检查
		if (!container) return;
		const containerRect = container.getBoundingClientRect();
		if (
			moveX < containerRect.left ||
			moveX > containerRect.right ||
			moveY < containerRect.top ||
			moveY > containerRect.bottom
		) {
			onEnd();
			return;
		}

		requestAnimationFrame(() => {
			const deltaX = moveX - resizeStartPos.value.x;
			const deltaY = moveY - resizeStartPos.value.y;

			// 根据方向计算尺寸变化
			let newWidth = width.value;
			let newHeight = height.value;
			let newX = cutPosition.value.x;
			let newY = cutPosition.value.y;
			const maxWidth = (offsetX + renderedWidth) - cutPosition.value.x;
			const maxHeight = (offsetY + renderedHeight) - cutPosition.value.y;

			const availableHeight = cutPosition.value.y - offsetY + height.value;

			switch (dir) {
				case 'top':
					newHeight = Math.max(props.minResizeSize, Math.min(height.value - deltaY, availableHeight));
					newY = Math.max(offsetY, Math.min(cutPosition.value.y + (height.value - newHeight), offsetY + renderedHeight - newHeight));
					break;
				case 'right':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value + deltaX, maxWidth));
					break;
				case 'bottom':
					newHeight = Math.max(props.minResizeSize, Math.min(height.value + deltaY, maxHeight));
					break;
				case 'left':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value - deltaX, maxWidth));
					newX = cutPosition.value.x + (width.value - newWidth);
					break;
				case 'top-left':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value - deltaX, maxWidth));
					newHeight = Math.max(props.minResizeSize, Math.min(height.value - deltaY, availableHeight));
					newX = Math.max(offsetX, cutPosition.value.x + (width.value - newWidth));
					newY = Math.max(offsetY, Math.min(cutPosition.value.y + (height.value - newHeight), offsetY + renderedHeight - newHeight));
					break;
				case 'top-right':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value + deltaX, maxWidth));
					newHeight = Math.max(props.minResizeSize, Math.min(height.value - deltaY, availableHeight));
					newY = Math.max(offsetY, Math.min(cutPosition.value.y + (height.value - newHeight), offsetY + renderedHeight - newHeight));
					break;
				case 'bottom-left':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value - deltaX, maxWidth));
					newHeight = Math.max(props.minResizeSize, Math.min(height.value + deltaY, maxHeight));
					newX = cutPosition.value.x + (width.value - newWidth);
					break;
				case 'bottom-right':
					newWidth = Math.max(props.minResizeSize, Math.min(width.value + deltaX, maxWidth));
					newHeight = Math.max(props.minResizeSize, Math.min(height.value + deltaY, maxHeight));
					break;
				default:
					break;
			}

			newX = Math.max(offsetX, Math.min(newX, offsetX + renderedWidth - newWidth));
			newY = Math.max(offsetY, Math.min(newY, offsetY + renderedHeight - newHeight));

			// 更新尺寸和位置
			width.value = newWidth;
			height.value = newHeight;
			cutPosition.value = { x: newX, y: newY };

			throttledHandleCut();

			// 更新起始位置
			resizeStartPos.value = { x: moveX, y: moveY };
		});
	}

	const onEnd = () => {
		if (isResizing.value && dirEl) {
			isResizing.value = false;
			dirEl.classList.remove('is_focus');
			document.removeEventListener(moveEvent, onMove as EventListener);
			document.removeEventListener(endEvent, onEnd as EventListener);
			document.removeEventListener('mouseleave', onEnd as EventListener);
		}
	};

	document.addEventListener(moveEvent, onMove as EventListener);
	document.addEventListener(endEvent, onEnd as EventListener);
	document.addEventListener('mouseleave', onEnd as EventListener);

	e.stopPropagation();
};

const handleWindowResize = () => {
	preCalculate();
	throttledHandleCut();
};

onMounted(() => {
	window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleWindowResize);
	// 清理 URL 对象
	if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
		URL.revokeObjectURL(imageUrl.value);
	}
});
</script>

<template>
	<div class="crop-box">
		<div v-if="imageUrl" class="crop-container">
			<div class="preview" :class="{ 'mosaic-bg': props.mosaic }"
				:style="{ background: props.backgroundColor || undefined }">
				<!-- 图片预览 -->
				<img :src="imageUrl" class="image" />

				<!-- 裁剪区域 -->
				<div :style="{
					transform: `translate(${cutPosition.x}px, ${cutPosition.y}px)`,
					width: `${width}px`,
					height: `${height}px`,
				}" :draggable="!isResizing" @dragstart="handleDragStart" @drag="handleDragMove" @dragend="handleDragEnd"
					@touchstart="handleDragStart" @touchmove="handleDragMove" @touchend="handleDragEnd" class="cut"
					:class="[props.cutClass, isDragging ? 'move' : '', isResizing ? 'move' : '']">

					<template v-for="(direction, i) in resizeDirArray" :key="i">
						<div v-if="props.resizeDir.includes(direction)" :id="direction" :class="[
							direction.includes('-') ? 'resize-point' : 'resize-line',
							direction,
							props.resizeClass
						]" :data-direction="direction" @mousedown="handleResizeStart($event, direction)"
							@touchstart="handleResizeStart($event, direction)">
						</div>
					</template>
				</div>

				<!-- 遮罩层 -->
				<div class="mask" :style="maskStyle" />
			</div>

			<!-- 操作按钮 -->
			<div class="actions">
				<button @click="handleCancel" class="btn btn-cancel" type="button">取消</button>
				<button @click="handleConfirm" class="btn btn-primary" type="button">确认裁剪</button>
			</div>
		</div>

		<!-- 无图片状态 -->
		<div v-else class="empty-state">
			<slot name="empty">
				<div class="empty-text">请设置 src 属性加载图片</div>
			</slot>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-crop.scss';
</style>


