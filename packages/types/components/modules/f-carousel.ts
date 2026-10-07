interface FCarouselItem {
  /** 项目唯一标识 */
  id?: string | number;
  /** 内容类型：image, html, text */
  type: 'image' | 'html' | 'text';
  /** 图片地址（当type为image时使用） */
  src?: string;
  /** 图片alt文本 */
  alt?: string;
  /** HTML内容（当type为html时使用） */
  content?: string;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 链接地址 */
  link?: string;
}

interface FCarouselProps {
  /** 轮播项目列表 */
  items?: FCarouselItem[];
  /** 是否自动播放 @default true */
  autoplay?: boolean;
  /** 自动播放间隔（毫秒） @default 3000 */
  interval?: number;
  /** 是否显示指示器 @default true */
  showIndicators?: boolean;
  /** 是否显示控制按钮 @default true */
  showControls?: boolean;
  /** 是否循环播放 @default true */
  loop?: boolean;
  /** 指示器类型：dot, line, number @default 'dot' */
  indicatorType?: 'dot' | 'line' | 'number';
  /** 指示器位置：top, bottom, left, right @default 'bottom' */
  indicatorPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** 轮播方向：horizontal, vertical @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  /** 切换效果：slide, fade @default 'slide' */
  effect?: 'slide' | 'fade';
  /** 轮播高度 */
  height?: string;
}

export type { FCarouselProps, FCarouselItem };
