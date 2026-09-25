import type { FNotificationActiveInstance, FNotificationFn, FNotificationInstance, FNotificationOptions, Position, Type } from '@/types';
import { createVNode, render } from 'vue'
import FNotificationComp from '../../components/modules/FNotification.vue'

const GAP = 16
const BASE_OFFSET = 20

let seed = 0
const groups: Record<Position, FNotificationActiveInstance[]> = {
	'top-right': [],
	'top-left': [],
	'bottom-right': [],
	'bottom-left': []
}

const normalizeOptions = (options: FNotificationOptions | string): FNotificationOptions => {
	return typeof options === 'string' ? { message: options } : options
}

const repositionGroup = (position: Position) => {
	let offset = BASE_OFFSET
	groups[position].forEach((item) => {
		const vm = item.vnode.component
		if (vm) {
			vm.props.offset = offset
		}
		offset += Number(item.size) + GAP
	})
}

const removeInstance = (position: Position, id: number) => {
	const list = groups[position]
	const index = list.findIndex((item) => item.id === id)
	if (index === -1) return
	const { container } = list[index]!
	render(null, container)
	container.remove()
	list.splice(index, 1)
	repositionGroup(position)
}

const createInstance = (options: FNotificationOptions): FNotificationInstance => {
	const id = seed++
	const position = options.position ?? 'top-right'
	const list = groups[position]
	const container = document.createElement('div')

	const offset =
		list.length === 0
			? BASE_OFFSET
			: (() => {
				const last = list[list.length - 1]!
				return Number(last.vnode.component?.props.offset) + Number(last.size) + GAP
			})()

	const vnode = createVNode(FNotificationComp, {
		...options,
		position,
		offset,
		onClose: () => {
			options.onClose?.()
		},
		onDestroy: () => {
			removeInstance(position, id)
		},
		onClick: () => {
			options.onClick?.()
		}
	})

	render(vnode, container)
	document.body.appendChild(container)

	const el = vnode.el as HTMLElement
	const size = el?.offsetHeight ?? 72

	list.push({ id, position, vnode, container, size })

	return {
		id,
		close: () => {
			(vnode.component?.exposed as any)?.close?.()
		}
	}
}

/**
 * FNotification 函数式 API
 * 
 * @example
 * // 推荐用法 - 使用小写名称
 * import { notification } from 'fantasia-ui'
 * notification.success('操作成功')
 * notification.error('操作失败')
 * 
 * @example
 * // 或使用 FNotificationAPI (向后兼容)
 * import { FNotificationAPI } from 'fantasia-ui'
 * FNotificationAPI.info('这是一条通知')
 * 
 * @example
 * // 组件用法
 * import { FNotification } from 'fantasia-ui'
 * // 在模板中使用 <FNotification />
 */
const FNotification = ((options: FNotificationOptions | string) => {
	return createInstance(normalizeOptions(options))
}) as FNotificationFn

const withType = (type: Type) => (options: FNotificationOptions | string) =>
	createInstance({ ...normalizeOptions(options), type })

FNotification.info = withType('info')
FNotification.success = withType('success')
FNotification.warning = withType('warning')
FNotification.failed = withType('failed')

FNotification.closeAll = (position) => {
	const positions = position ? [position] : (Object.keys(groups) as Position[])
	positions.forEach((pos) => {
		[...groups[pos]].forEach((item) => {
			item.vnode.component?.exposed?.close?.()
		})
	})
}

export default FNotification
