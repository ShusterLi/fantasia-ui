<script lang="ts" setup>
import type { CSSProperties, PropType } from 'vue';
import type { imageType } from '@/types';

const resizeDirArray = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

defineOptions({
    name: 'FUpload',
    inheritAttrs: false
})
const props = defineProps({
    /**
     * ### 是否启用裁剪功能
     * @default undefined
     * @type {Boolean}
     * @description
     * - `true`: 返回裁剪后的文件
     * - `false`: 返回原始文件
     */
    crop: {
        type: Boolean,
        default: undefined
    },
    /**
     * ### 是否启用马赛克背景
     * @default undefined
     * @type {Boolean}
     * @description
     * - `true`: 启用马赛克背景
     * - `false`: 显示默认背景
     */
    mosaic: {
        type: Boolean,
        default: undefined
    },
    /**
     * ### 是否启用裁剪下载功能
     * @default undefined
     * @type {Boolean}
     * @description
     * - `true`: 显示裁剪下载和倍数选择器
     * - `false`: 不显示裁剪下载和倍数选择器
     */
    download: {
        type: Boolean,
        default: undefined
    },
    /**
     * ### 是否启用图像预览
     * @default true
     * @type {Boolean}
     * @description
     * - `true`: 显示预览图
     * - `false`: 不显示预览图
     */
    preview: {
        type: Boolean,
        default: true
    },
    /**
     * ### 是否使用默认背景色
     * @default ''
     * @type {String}
     * @description 支持线性渐变和单色背景
     */
    previewBgColor: {
        type: String,
        default: ''
    },
    /**
   * ### 拖拽点
   * @default ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
   * @type {Array<string>}
   * @example ['top', 'bottom', 'left', 'right']
   * @description 可以使用的拖拽点
   */
    resizeDir: {
        type: Array as PropType<string[]>,
        default: () => ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    /**
     * ### 允许上传的文件类型
     * @default ['image/png', 'image/jpeg', 'image/webp']
     * @type {Array<string> | keyof fileTypesMap}
     * @example ['image/png', 'image/jpeg', 'image/webp'] | ('image' | 'video' | 'audio' | 'document' | 'text' | 'zip')
     * @description 可以是字符串数组或文件类型的键
     */
    allowedTypes: {
        type: [Array, String] as PropType<string[]>,
        default: () => ['image/png', 'image/jpeg', 'image/webp']
    },
    /**
     * ### 是否使用默认图标
     * @default ''
     */
    icon: {
        type: String,
        default: ''
    },
    /**
     * ### 自定义裁剪框类名
     * @default ''
     * @description 用于修改裁剪框样式
     */
    customClassCut: {
        type: String,
        default: ''
    },
    /**
     * ### 自定义拖拽点类名
     * @default ''
     * @description 用于修改拖拽点样式
     */
    customClassResize: {
        type: String,
        default: ''
    },
    /**
     * ### 分片大小，单位 MB
     * @default 128
     * @description 文件大于 256MB 时自动开启分片上传
     */
    chunkSize: {
        type: Number,
        default: 128
    },
    propStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({})
    },
    /**
     * ### 文件最大上传大小，单位 MB
     * @default 2
     */
    maxSize: {
        type: Number,
        default: 2
    },
    /**
     * ### 裁剪框大小，单位 px
     * @default 120
     */
    size: {
        type: Number,
        default: 120
    },
    /**
     * ### 裁剪框最小大小，单位 px
     * @default 60
     */
    minResizeSize: {
        type: Number,
        default: 60
    },
    /**
     * ### 导出文件类型
     * @default 'image/png'
     */
    exportFileType: {
        type: String as PropType<imageType>,
        default: 'image/png'
    },
    /**
     * ### 上传文件类型
     * @default 'image/png'
     */
    uploadFileType: {
        type: String as PropType<imageType>,
        default: 'image/png'
    },
    /**
     * ### 上传框提示信息
     * @default ''
     */
    tips: {
        type: String,
        default: ''
    },
    /**
     * ### 输出文件类型
     * @default file
     * @type {file | base64}
     * @description
     * - `file`: 输出文件对象
     * - `base64`: 输出base64字符串
     * - `json`: 输出json对象（仅作用于Excel）
     */
    outputType: {
        type: String as PropType<'file' | 'base64' | 'json'>,
        default: 'file'
    }
})

const emit = defineEmits(['upload']);

// 定义 Slots
defineSlots<{
    /**
     * 自定义上传图标插槽
     * @param props 插槽属性
     */
    icon(props: {}): any,

    /**
     * 自定义提示插槽
     * @param props 插槽属性
     */
    tip(props: {}): any
}>();

const imageUrl = ref('')                  // 原始图片URL
const uploadRef = ref()                   // 上传组件引用
const file = ref<UploadRawFile | null>()  // 上传文件对象
const cutPosition = ref({ x: 0, y: 0 })   // 裁剪框位置
const isDragging = ref(false)             // 拖拽状态
const startPos = ref({ x: 0, y: 0 })      // 拖拽起始坐标
const previewUrl = ref('')                // 裁剪预览URL
const previewCanvas = ref<HTMLCanvasElement | null>(null) // canvas 缓存
const size = ref(props.size);
const width = ref(props.size);
const height = ref(props.size);
const isResizing = ref(false);              // 调整大小状态
const resizeStartPos = ref({ x: 0, y: 0 }); // 调整大小起始位置
const scale = ref<number>(2);              // 缩放比例
const textContent = ref<string>('');        // 文本内容
/* ---------- 处理Excel ---------- */
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

// 上传文件类型
const uploadFileTypeRef = computed<string>(() => file.value?.type?.split('/')[0] || '');

/* ---------- 上传处理 ---------- */
// 文件变更回调
const UploadedFile = (item: UploadFile) => {
    let allowTypeMap: string[] = [];

    if (Array.isArray(props.allowedTypes)) {
        allowTypeMap = props.allowedTypes;
    }

    if (!item.raw) return;

    if (!allowTypeMap.includes(item.raw.type)) {
        ElMessage({
            message: '文件格式不正确!',
            type: 'error',
            plain: true
        })
        return false;
    } else if (item.raw.size / 1024 / 1024 > props.maxSize) {
        ElMessage({
            message: `上传文件大小不能超过 ${props.maxSize} MB!`,
            type: 'error',
            plain: true
        });
        return false;
    } else {
        // 重置裁剪相关状态
        cutPosition.value = { x: 0, y: 0 };
        previewUrl.value = '';
        previewCanvas.value = null; // 清除canvas缓存

        file.value = item.raw;

        if (['application', 'text'].includes(uploadFileTypeRef.value)) {
            // 读取文本内容
            const reader = new FileReader();
            reader.onload = (e) => {
                textContent.value = e.target?.result as string;
            };
            reader.readAsText(item.raw);
        }

        imageUrl.value = URL.createObjectURL(item.raw);

        // 使用双层异步保证DOM更新
        if (props.crop) {
            nextTick(() => {
                const img = new Image();
                img.src = imageUrl.value;
                img.onload = () => {
                    preCalculate();
                    requestAnimationFrame(() => handleCut());
                };
            });
        }
    }
}

// 超出限制处理
const handleExceed: UploadProps['onExceed'] = async (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}

// 上传前校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    let allowTypeMap: string[] = [];

    if (Array.isArray(props.allowedTypes)) {
        allowTypeMap = props.allowedTypes;
    }

    if (!allowTypeMap.includes(rawFile.type)) {
        ElMessage({
            message: '文件格式不正确!',
            type: 'error',
            plain: true
        })
        return false;
    }
    if (rawFile.size / 1024 / 1024 > props.maxSize) {
        ElMessage({
            message: `上传文件大小不能超过 ${props.maxSize} MB!`,
            type: 'error',
            plain: true
        });
        return false;
    }
    return true;
};

// 自定义上传逻辑
const customUpload = async () => {
    if (!file.value) ElMessage.error('请先选择文件');

    try {
        let uploadFile: File | void | string | null = null;

        if (props.crop) {
            uploadFile = await handleCut(true);

            if (!uploadFile) return ElMessage.error('裁剪文件生成失败');
        } else {
            uploadFile = file.value;
        }

        // 触发上传事件
        emit('upload', uploadFile, () => {
            setTimeout(() => {
                file.value = null;
                imageUrl.value = '';
                previewUrl.value = '';
                previewCanvas.value = null;
                cutPosition.value = { x: 0, y: 0 };
                size.value = props.size;
                uploadRef.value?.clearFiles();
                URL.revokeObjectURL(imageUrl.value);
                URL.revokeObjectURL(previewUrl.value);
            }, 100);
        }, (msg: string) => ElMessage.error(msg));

        const input = uploadRef.value?.$el.querySelector('input[type=file]');
        input.disabled = false;
    } catch (error) {
        console.error(`文件处理失败：${error}`);
    }
};

// 重新选择
const resetUpload = () => {
    if (uploadRef.value) {
        const input = uploadRef.value?.$el.querySelector('input[type=file]');
        input.disabled = false;
        input?.click();
    }
}

// 提交上传
const submitUpload = () => {
    if (uploadRef.value) {
        uploadRef.value.submit();
    }
};

// 裁剪并下载
const downloadImage = () => {
    if (!img || !container) return;

    if (props.crop && props.download) {
        const canvas = document.createElement('canvas');
        const pixelRatio = devicePixelRatio || 1; // 获取设备像素比
        canvas.width = width.value * scale.value * pixelRatio;
        canvas.height = height.value * scale.value * pixelRatio;

        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.scale(pixelRatio, pixelRatio);

        const sx = (cutPosition.value.x - offsetX) * (img.naturalWidth / renderedWidth);
        const sy = (cutPosition.value.y - offsetY) * (img.naturalHeight / renderedHeight);
        const sWidth = width.value * (img.naturalWidth / renderedWidth);
        const sHeight = height.value * (img.naturalHeight / renderedHeight);

        ctx.drawImage(
            img,
            sx, sy, sWidth, sHeight,
            0, 0, width.value * scale.value, height.value * scale.value // 使用逻辑尺寸
        );

        canvas.toBlob((blob) => {
            if (!blob) return;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${Date.now()}.${props.exportFileType.split('/')[1]}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, props.exportFileType, 1.0);
    }
};

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
    img = container.querySelector('.avatar');
    if (!img) return;

    requestAnimationFrame(() => {
        if (!container) return;
        if (!img) return;

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

        const pixelRatio = window.devicePixelRatio || 1; // 获取设备像素比
        const initSize = Math.min(props.size * pixelRatio, Math.min(renderedWidth, renderedHeight));
        size.value = initSize / pixelRatio;
        width.value = initSize / pixelRatio;
        height.value = initSize / pixelRatio;

        const maxX = offsetX + renderedWidth - initSize / pixelRatio;
        const maxY = offsetY + renderedHeight - initSize / pixelRatio;

        cutPosition.value = {
            x: Math.max(offsetX, Math.min(offsetX + (renderedWidth - initSize / pixelRatio) / 2, maxX)),
            y: Math.max(offsetY, Math.min(offsetY + (renderedHeight - initSize / pixelRatio) / 2, maxY))
        };
    });
};

// 拖拽开始
const handleDragStart = (e: DragEvent | TouchEvent) => {
    isDragging.value = true;
    isResizing.value = false;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];

    startPos.value = {
        x: clientX - rect.left,  // 使用相对容器的坐标
        y: clientY - rect.top
    }

    if (e instanceof DragEvent) {
        e.dataTransfer?.setDragImage(new Image(), 0, 0) // 隐藏默认拖拽图像
    } else {
        e.preventDefault();
    }
}

// 拖拽中
const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || isResizing.value) return;

    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];

    if (!clientX || !clientY) return;
    e.preventDefault();

    const container = document.querySelector('.preview');
    if (!container) return;

    const rect = container.getBoundingClientRect();

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
    if (!previewCanvas.value) {
        previewCanvas.value = document.createElement('canvas');
        previewCanvas.value.width = props.size;
        previewCanvas.value.height = props.size;
    } else {
        // 重置canvas状态
        const ctx = previewCanvas.value.getContext('2d')!;
        ctx.clearRect(0, 0, props.size, props.size);
    }
    return previewCanvas.value;
}

// 图像裁剪
const handleCut = async (isFinal: boolean = false) => {
    if ((!container || !img) && props.preview) preCalculate();
    if (!container || !img) return;

    // 确保使用最新尺寸参数
    const currentOffsetX = offsetX;
    const currentOffsetY = offsetY;
    const currentRenderedWidth = renderedWidth;
    const currentRenderedHeight = renderedHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // 坐标转换使用最新参数
    const sx = (cutPosition.value.x - currentOffsetX) * (img.naturalWidth / currentRenderedWidth);
    const sy = (cutPosition.value.y - currentOffsetY) * (img.naturalHeight / currentRenderedHeight);

    const validSx = Math.max(0, sx);
    const validSy = Math.max(0, sy);
    const validWidth = Math.min(width.value * (img.naturalWidth / renderedWidth), img.naturalWidth - validSx);
    const validHeight = Math.min(height.value * (img.naturalHeight / renderedHeight), img.naturalHeight - validSy);

    // 使用缓存canvas
    const cvs = isFinal ? document.createElement('canvas') : tempCanvas()
    const scale = isFinal ? 2 : 1;
    cvs.width = width.value * scale * pixelRatio;
    cvs.height = height.value * scale * pixelRatio;

    const ctx = cvs.getContext('2d')!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 调整坐标系以匹配物理像素
    ctx.scale(pixelRatio, pixelRatio);

    ctx.clearRect(0, 0, cvs.width, cvs.height); // 清除旧内容

    ctx.drawImage(
        img,
        validSx, validSy, validWidth, validHeight,
        0, 0, width.value * scale, height.value * scale
    );

    return new Promise<File | string | null>((resolve) => {
        cvs.toBlob((blob) => {
            if (!blob) {
                resolve(null);
                return;
            }

            previewUrl.value = URL.createObjectURL(blob);

            if (isFinal) {
                let file: File | string | null = null;
                const fileName = v4().replaceAll('-', '');

                if (props.outputType === 'file') {
                    file = new File([blob], fileName, { type: props.uploadFileType });
                } else {
                    file = cvs.toDataURL(props.uploadFileType)
                }

                resolve(file);
            } else {
                resolve(null);
            }
        }, props.uploadFileType);
    });
};

// 节流裁剪函数
const throttledHandleCut = rafThrottle(() => handleCut(false));

/* ---------- 调整裁剪框大小 ---------- */
const handleResizeStart = (e: MouseEvent | TouchEvent, direction: string) => {
    if (e instanceof TouchEvent && e.cancelable) e.preventDefault();

    const dirEl = document.getElementById(direction);
    dirEl?.classList.add('is_focus');

    isResizing.value = true;
    isDragging.value = false;

    // 获取方向标识（从事件目标的dataset获取）
    const dir = direction || (e.target as HTMLElement).dataset?.direction;
    if (!dir) return;

    // 获取坐标（支持鼠标和触摸）
    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];

    resizeStartPos.value = { x: clientX, y: clientY };

    // 添加事件监听（同时支持鼠标和触摸）
    const moveEvent = e instanceof MouseEvent ? 'mousemove' : 'touchmove';
    const endEvent = e instanceof MouseEvent ? 'mouseup' : 'touchend';

    const onMove = (moveE: MouseEvent | TouchEvent) => {
        if (!isResizing.value) return;

        // 获取移动坐标
        const { moveX, moveY } = moveE instanceof MouseEvent
            ? { moveX: moveE.clientX, moveY: moveE.clientY }
            : { moveX: moveE.touches[0].clientX, moveY: moveE.touches[0].clientY };

        // 边界检测
        const containerRect = container!.getBoundingClientRect();
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
        if (isResizing.value) {
            isResizing.value = false;
            const input = uploadRef.value?.$el.querySelector('input[type=file]');
            input.disabled = true;
            dirEl?.classList.remove('is_focus');
            document.removeEventListener(moveEvent, onMove);
            document.removeEventListener(endEvent, onEnd);
            document.removeEventListener('mouseleave', onEnd);
        }
    };

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(endEvent, onEnd);
    document.addEventListener('mouseleave', onEnd);

    e.stopPropagation();
};

watch(() => props.propStyle, (newStyle) => {
    nextTick(() => {
        const uploadElement = document.querySelector('.avatar-uploader .el-upload') as HTMLElement;
        if (uploadElement) {
            if (newStyle && Object.keys(newStyle).length > 0) {
                Object.assign(uploadElement.style, newStyle);
            } else {
                uploadElement.removeAttribute('style');
            }
        }
    });
}, { immediate: true });

onMounted(() => {
    window.addEventListener('resize', () => {
        preCalculate();
        throttledHandleCut();
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', () => {
        preCalculate();
        throttledHandleCut();
    });
});
</script>

<template>
    <div class="upload-box">
        <div class="upload-action">
            <el-upload class="avatar-uploader" ref="uploadRef" :on-exceed="handleExceed" :on-change="UploadedFile"
                :before-upload="beforeAvatarUpload" :auto-upload="false" :show-file-list="false" :multiple="false"
                :limit="1" :http-request="customUpload" drag>
                <div v-if="imageUrl" class="preview" :class="props.mosaic ? 'mosaic' : ''"
                    :style="{ background: props.previewBgColor }" :key="imageUrl">

                    <!-- 上传预览 -->
                    <img v-if="uploadFileTypeRef === 'image'" :src="imageUrl" class="avatar" />

                    <div v-if="props.crop" :style="{
                        transform: `translate(${cutPosition.x}px, ${cutPosition.y}px)`,
                        width: `${width}px`,
                        height: `${height}px`,
                    }" :draggable="!isResizing" @dragstart="handleDragStart" @drag="handleDragMove"
                        @dragend="handleDragEnd" @touchstart="handleDragStart" @touchmove="handleDragMove"
                        @touchend="handleDragEnd" class="cut" id="cut"
                        :class="[props.customClassCut ? props.customClassCut : '', isDragging ? 'move' : '', isResizing ? 'move' : '']">

                        <template v-for="(direction, i) in resizeDirArray" :key="i">
                            <div v-if="props.resizeDir.includes(direction)" :id="direction"
                                :class="direction.includes('-') ? `resize-point ${direction} ${props.customClassResize || ''}` : `resize-line ${direction}`"
                                :data-direction="direction" @mousedown="handleResizeStart($event, direction)"
                                @touchstart="handleResizeStart($event, direction)">
                            </div>
                        </template>
                    </div>
                    <div v-if="props.crop" class="mask" :style="maskStyle" />
                </div>
                <el-icon v-else-if="props.icon" class="uploader-icon">
                    <component :is="props.icon" />
                </el-icon>
                <slot v-else-if="!imageUrl" name="icon"></slot>

                <template #tip>
                    <div v-if="props.tips" class="el-upload__tip">
                        <span>
                            {{ props.tips }}
                        </span>
                    </div>
                    <slot name="tip"></slot>
                </template>
            </el-upload>

            <transition-group v-if="props.preview" name="list" tag="div" class="preview-avatar">
                <template v-if="previewUrl || imageUrl">
                    <el-avatar fit="cover" :src="previewUrl || imageUrl" :size="180" key="large" />
                    <el-avatar fit="cover" :src="previewUrl || imageUrl" :size="110" key="small" />
                </template>
            </transition-group>
        </div>

        <div v-if="imageUrl" class="upload-btn">
            <el-button @click="resetUpload" type="info" text>重新选择</el-button>
            <el-button @click="submitUpload" type="primary" text>确认上传</el-button>
            <el-button v-if="props.download" @click="downloadImage" type="danger" text>裁剪并下载</el-button>
            <el-input-number v-if="props.download" v-model="scale" class="mx-4" :step="2" :min="2" :max="32"
                step-strictly controls-position="right" style="width: 80px;" size="small">
                <template #suffix>
                    <span>倍</span>
                </template>
            </el-input-number>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.upload-box {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0 auto;

    .upload-action {
        display: flex;
        flex-direction: row;
        align-items: center;

        .avatar-uploader {
            display: flex;
            justify-content: center;
            flex-direction: column;

            .preview {
                display: flex;
                align-items: center;
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 4px;
                background-color: #000;

                &img,
                &video {
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                }

                &.mosaic {
                    background-color: #2e2d2d96;
                    background-image:
                        linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee),
                        linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                }

                .mask {
                    position: absolute;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    background: rgba($color: #000000, $alpha: 0.6);
                }

                .cut {
                    position: absolute;
                    z-index: 2;
                    left: 0;
                    top: 0;
                    border: 2px dashed #ffffff;
                    cursor: move;
                    user-select: none;
                    touch-action: none;
                    image-rendering: pixelated;

                    &.move {
                        background-image: linear-gradient(to right, #ffffff8c 1px, transparent 1px),
                            linear-gradient(to bottom, #ffffff8c 1px, transparent 1px);
                        background-size: calc(100% / 3) calc(100% / 3);
                    }

                    .resize-point {
                        position: absolute;
                        right: -6px;
                        bottom: -6px;
                        width: 20px;
                        height: 20px;
                        cursor: nwse-resize;
                        z-index: 3;

                        &.top-left {
                            top: -5px;
                            left: -5px;
                            border-top: 4px solid #fff;
                            border-left: 4px solid #fff;
                            cursor: nw-resize;
                        }

                        &.top-right {
                            top: -5px;
                            right: -5px;
                            border-top: 4px solid #fff;
                            border-right: 4px solid #fff;
                            cursor: ne-resize;
                        }

                        &.bottom-left {
                            bottom: -5px;
                            left: -5px;
                            border-bottom: 4px solid #fff;
                            border-left: 4px solid #fff;
                            cursor: sw-resize;
                        }

                        &.bottom-right {
                            bottom: -5px;
                            right: -5px;
                            border-bottom: 4px solid #fff;
                            border-right: 4px solid #fff;
                            cursor: se-resize;
                        }
                    }

                    .resize-line {
                        position: absolute;
                        background-color: #fff;
                        z-index: 3;
                        transition: width 0.2s ease-in-out, height 0.2s ease-in-out;

                        &.top,
                        &.bottom {
                            width: 100%;
                            height: 2px;
                            cursor: s-resize;

                            &:hover {
                                height: 6px;
                            }

                            &.is_focus {
                                height: 6px;
                            }
                        }

                        &.left,
                        &.right {
                            height: 100%;
                            width: 2px;
                            cursor: e-resize;

                            &:hover {
                                width: 6px;
                            }

                            &.is_focus {
                                width: 6px;
                            }
                        }

                        &.bottom {
                            bottom: -2px;
                        }

                        &.top {
                            top: -2px;
                        }

                        &.left {
                            left: -2px;
                        }

                        &.right {
                            right: -2px;
                        }
                    }
                }

                .avatar {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .audio {
                    width: 100%;
                }
            }
        }

        .preview-avatar {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            gap: 40px;
            margin-left: 80px;

            @media (max-width: 768px) {
                display: none;
            }
        }
    }

    .text-preview {
        .text-content {
            max-height: 400px;
            max-width: 800px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            font-family: Monaco, Consolas, Courier New, monospace;
            font-size: 12px;
            line-height: 1.5;
            white-space: pre-wrap;
            overflow: auto;
            color: #606266;

            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #c1c1c1;
                border-radius: 3px;
            }
        }
    }
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
    transition: all 0.4s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.list-move {
    transition: transform 0.4s ease;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 400px;
    height: 400px;
    min-width: 100px;
    min-height: 100px;
}

.el-upload .el-upload-dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.uploader-icon {
    font-size: 3.5rem;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.el-upload__tip {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.el-upload-dragger.is-dragover {
    background-color: var(--el-color-primary-light-9) !important;
    border: 1px dashed var(--el-color-primary) !important;
    padding: 0 !important;
}

@media (max-width: 768px) {
    .avatar-uploader .el-upload {
        width: 300px;
        height: 300px;
    }
}
</style>
