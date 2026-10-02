import type { imageType } from '../../models';

type MessageType = 'info' | 'warning' | 'primary' | 'success' | 'error';

type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type OutputType = 'file' | 'blob' | 'base64';

interface FCropProps {
	/**
	 * ### 图片源
	 * @description 可以是 URL、File 对象或 base64
	 */
	src?: string | File;

	/**
	 * ### 拖拽点
	 * @default ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
	 * @example ['top', 'bottom', 'left', 'right']
	 * @description 可以使用的拖拽点
	 */
	resizeDir?: ResizeDirection[];

	/**
	 * ### 裁剪框大小，单位 px
	 * @default 200
	 */
	size?: number;

	/**
	 * ### 裁剪框最小大小，单位 px
	 * @default 50
	 */
	minResizeSize?: number;

	/**
	 * ### 输出文件类型
	 * @default 'image/png'
	 */
	outputFileType?: imageType;

	/**
	 * ### 输出类型
	 * @default 'file'
	 * @description 'file' | 'blob' | 'base64'
	 */
	outputType?: OutputType;

	/**
	 * ### 输出图片质量（0-1）
	 * @default 0.92
	 */
	quality?: number;

	/**
	 * ### 输出缩放倍数
	 * @default 2
	 */
	scale?: number;

	/**
	 * ### 是否启用马赛克背景
	 * @default false
	 * @description 用于展示透明图片
	 */
	mosaic?: boolean;

	/**
	 * ### 自定义背景色
	 * @default ''
	 * @description 支持颜色值、渐变等 CSS background 值
	 */
	backgroundColor?: string;

	/**
	 * ### 自定义裁剪框类名
	 * @default ''
	 * @description 用于自定义裁剪框样式
	 */
	cutClass?: string;

	/**
	 * ### 自定义调整点类名
	 * @default ''
	 * @description 用于自定义调整点样式
	 */
	resizeClass?: string;
}

interface CropPosition {
	x: number;
	y: number;
}

interface CropResult {
	file?: File;
	blob?: Blob;
	base64?: string;
	width: number;
	height: number;
}

export type { 
	FCropProps, 
	MessageType, 
	ResizeDirection, 
	CropPosition,
	CropResult,
	OutputType
};
