import type { VNode } from "vue"

type Justify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type Align = 'top' | 'middle' | 'bottom' | 'stretch'
type Wrap = 'wrap' | 'nowrap' | 'wrap-reverse'
type Direction = 'horizontal' | 'vertical'
type Size = 'small' | 'normal' | 'large' | number
type Placement = 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'bottom' | 'top' | 'top-start' | 'top-end' | 'left-start' | 'left-end';
type Type = 'success' | 'warning' | 'failed' | 'info';
type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ActiveInstance {
    id: number
    vnode: VNode
    container: HTMLElement
}

export type { Justify, Align, Wrap, Direction, Size, Placement, Type, Position, ActiveInstance }
