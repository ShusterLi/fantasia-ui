interface FMarqueeProps {
  /** 滚动方向 @default 'left' */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** 滚动速度（像素/秒） @default 50 */
  speed?: number;
  /** 鼠标悬停时是否暂停 @default false */
  pauseOnHover?: boolean;
  /** 是否自动播放 @default true */
  autoplay?: boolean;
}

export type { FMarqueeProps };
