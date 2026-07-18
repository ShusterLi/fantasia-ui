<script lang="ts" setup>
import type { FSliderCaptcha, PolygonsType, ProgressStatus } from '@/types';

const props = withDefaults(defineProps<FSliderCaptcha>(), {
	src: () => [''],
});

const emit = defineEmits<{
	(e: 'refresh'): void;
	(e: 'success'): void;
	(e: 'error'): void;
}>();

const isDragging = ref(false);
const offsetX = ref(0);
const startX = ref(0);
const maxOffset = ref(0);
const isSuccess = ref(false);
const isLoading = ref(false);
const status = ref<ProgressStatus>('');
const currentUsedSrc = ref('');
const randomAngle = ref(0);

const trackRef = useTemplateRef<HTMLElement | null>('trackRef');
const handleRef = useTemplateRef<HTMLElement | null>('handleRef');
const bgCanvas = useTemplateRef<HTMLCanvasElement | null>('bgCanvas');
const fragmentCanvas = useTemplateRef<HTMLCanvasElement | null>('fragmentCanvas');

// 绘图逻辑保持不变
const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, type: PolygonsType) => {
	const polygons: Record<string, number> = {
		triangle: 3, square: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8
	};
	ctx.beginPath();
	if (type === 'star') {
		for (let i = 0; i < 5; i++) {
			ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * size + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * size + y);
			ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (size / 2) + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * (size / 2) + y);
		}
	} else if (polygons[type]) {
		const sides = polygons[type];
		const startAngle = type === 'hexagon' ? -Math.PI / 6 : -Math.PI / 2;
		for (let i = 0; i < sides; i++) {
			const angle = startAngle + (i * 2 * Math.PI / sides);
			ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
		}
	}
	ctx.closePath();
};

const initCanvas = (isNewImage = false) => {
	if (!props.src || (Array.isArray(props.src) && props.src.length === 0) || !props.puzzle) return;

	isLoading.value = true;

	randomAngle.value = Math.floor(Math.random() * 180) + 60;

	if (isNewImage || !currentUsedSrc.value) {
		if (Array.isArray(props.src)) {
			const randomIndex = Math.floor(Math.random() * props.src.length);
			currentUsedSrc.value = props.src[randomIndex];
		} else {
			currentUsedSrc.value = props.src;
		}
	}

	const img = new Image();
	img.crossOrigin = "Anonymous";
	const connector = currentUsedSrc.value.includes('?') ? '&' : '?';
	img.src = `${currentUsedSrc.value}${connector}t=${Date.now()}`;

	img.onload = () => {
		const bgCtx = bgCanvas.value?.getContext('2d');
		const frCtx = fragmentCanvas.value?.getContext('2d');
		if (!bgCtx || !frCtx) return;

		const { x, y, size, type } = props.puzzle;

		bgCtx.clearRect(0, 0, 300, 150);
		bgCtx.drawImage(img, 0, 0, 300, 150);
		bgCtx.save();
		drawShape(bgCtx, x, y, size, type);
		bgCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		bgCtx.fill();
		bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		bgCtx.lineWidth = 2;
		bgCtx.stroke();
		bgCtx.restore();

		frCtx.clearRect(0, 0, 300, 150);
		frCtx.save();
		drawShape(frCtx, x, y, size, type);
		frCtx.clip();
		frCtx.drawImage(img, 0, 0, 300, 150);
		frCtx.restore();
		frCtx.save();
		drawShape(frCtx, x, y, size, type);
		frCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
		frCtx.lineWidth = 2;
		frCtx.stroke();
		frCtx.restore();

		isLoading.value = false;
	};

	img.onerror = () => {
		isLoading.value = false;
	};
};

// 计算当前的旋转角度
const getCurrentRotation = computed(() => {
	if (isSuccess.value) return 0;
	const targetX = props.puzzle.x - 20;
	if (targetX <= 0) return 0;
	const progress = Math.min(offsetX.value / targetX, 1);
	return randomAngle.value * (1 - progress);
});

watch(() => props.puzzle, () => {
	resetUI();
	initCanvas(true);
}, { deep: true });

onMounted(() => initCanvas(true));

const resetUI = () => {
	isSuccess.value = false;
	status.value = '';
	offsetX.value = 0;
}

const handleDragStart = (e: PointerEvent) => {
	if (isSuccess.value || isLoading.value) return;
	isDragging.value = true;
	status.value = 'moving';
	startX.value = e.clientX - offsetX.value;
	if (trackRef.value && handleRef.value) {
		maxOffset.value = trackRef.value.clientWidth - handleRef.value.clientWidth - 4;
	}
	(e.target as HTMLElement).setPointerCapture(e.pointerId);
};

const handleDragMove = (e: PointerEvent) => {
	if (!isDragging.value) return;
	let moveX = e.clientX - startX.value;
	if (moveX < 0) moveX = 0;
	if (moveX > maxOffset.value) moveX = maxOffset.value;
	offsetX.value = moveX;
};

const handleDragEnd = (e: PointerEvent) => {
	if (!isDragging.value) return;
	isDragging.value = false;
	(e.target as HTMLElement).releasePointerCapture(e.pointerId);

	const targetX = props.puzzle.x - 20;
	const tolerance = 5;

	if (Math.abs(offsetX.value - targetX) <= tolerance) {
		isSuccess.value = true;
		status.value = 'success';
		emit('success');
	} else if (Math.abs(offsetX.value) === 0) {
		status.value = '';
		emit('error');
	} else {
		status.value = 'error';
		emit('error');
		setTimeout(() => {
			if (!isSuccess.value) {
				emit('refresh');
			}
		}, 500);
	}
};

const handleReset = () => {
	resetUI();
	emit('refresh');
};
</script>

<template>
	<div class="f-slider-captcha">
		<div class="captcha-imgs">
			<canvas ref="bgCanvas" width="300" height="150" class="bg-canvas size-full"></canvas>
			<canvas ref="fragmentCanvas" width="300" height="150" class="fragment-canvas" :style="{
				transformOrigin: `${props.puzzle.x}px ${props.puzzle.y}px`,
				transform: `translateX(${offsetX - (props.puzzle.x - 20)}px) rotate(${getCurrentRotation}deg)`,
				transition: isDragging ? 'none' : 'transform 0.3s'
			}"></canvas>

			<div v-if="isLoading" class="loading-overlay flex-center">
				<f-loading type="dots" />
			</div>

			<n-button text class="refresh-btn flex-center" @click="handleReset">
				<el-icon>
					<Refresh />
				</el-icon>
			</n-button>
		</div>

		<div class="slider-track flex-center" ref="trackRef">
			<div class="slider-progress" :class="[status]" :style="{
				width: `${offsetX + 20}px`,
				transition: isDragging ? 'none' : 'width 0.3s'
			}"></div>

			<span class="track-tip">向右滑动完成验证</span>

			<div ref="handleRef" class="slider-handle flex-center" :class="{ 'dragging': isDragging }" :style="{
				transform: `translateX(${offsetX}px)`,
				transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			}" @pointerdown="handleDragStart" @pointermove="handleDragMove" @pointerup="handleDragEnd"
				@pointercancel="handleDragEnd">
				<div class="status-default">
					<span class="stripe"></span>
					<span class="stripe"></span>
					<span class="stripe"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
/* 样式保持原封不动 */
$primary-color: #4a5568;
$success-color: #48bb78;
$error-color: #ff4d4f;

.f-slider-captcha {
	display: inline-flex;
	flex-direction: column;
	background-color: #fff;
	border-radius: 4px;
	padding: 10px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	border: 1px solid #f0f0f0;
	width: 320px;
	user-select: none;

	.captcha-imgs {
		position: relative;
		width: 300px;
		height: 150px;
		border-radius: 4px;
		overflow: hidden;
		background-color: #f7fafc;
		margin-bottom: 10px;

		.bg-canvas {
			display: block;
		}

		.fragment-canvas {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
			pointer-events: none;
			/* 确保旋转平滑 */
			will-change: transform;
		}

		.loading-overlay {
			position: absolute;
			inset: 0;
			background: #f5f5f5;
			z-index: 20;
		}

		.refresh-btn {
			position: absolute;
			top: 8px;
			right: 8px;
			font-size: 20px;
			color: #ffffff73;
			z-index: 11;
			transition: all 0.2s;

			&:hover {
				color: #fff;
			}
		}
	}

	.slider-track {
		position: relative;
		height: 44px;
		background-color: #f0f2f5;
		border-radius: 4px;
		border: 1px solid #e6e8eb;
		overflow: hidden;

		.slider-progress {
			position: absolute;
			left: 2px;
			height: 40px;
			z-index: 2;
			border-radius: 4px;

			&.moving {
				background-color: $primary-color;
			}

			&.success {
				background-color: $success-color;
			}

			&.error {
				background-color: $error-color;
			}
		}

		.track-tip {
			position: relative;
			z-index: 1;
			font-size: 13px;
			color: #999;
			pointer-events: none;
		}

		.slider-handle {
			position: absolute;
			left: 2px;
			width: 40px;
			height: 40px;
			background-color: #fff;
			border-radius: 4px;
			cursor: grab;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
			z-index: 3;
			touch-action: none;
			transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

			.status-default {
				display: flex;
				gap: 4px;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;

				.stripe {
					width: 2px;
					height: 20px;
					background-color: #ccc;
					border-radius: 2px;
					transition: all 0.3s;
				}
			}

			&:hover,
			&.dragging {
				background-color: $primary-color;

				.status-default {
					.stripe {
						&:first-child {
							width: 0;
							height: 0;
							background-color: transparent;
							border-top: 4px solid transparent;
							border-bottom: 4px solid transparent;
							border-right: 6px solid #fff;
							transform: translateX(-2px);
						}

						&:last-child {
							width: 0;
							height: 0;
							background-color: transparent;
							border-top: 4px solid transparent;
							border-bottom: 4px solid transparent;
							border-left: 6px solid #fff;
							transform: translateX(2px);
						}

						&:nth-child(2) {
							width: 4px;
							height: 4px;
							border-radius: 50%;
							background-color: #fff;
						}
					}
				}
			}

			&.dragging {
				cursor: grabbing;
			}
		}
	}
}
</style>
