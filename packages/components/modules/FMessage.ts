import type { FMessageActiveInstance, FMessageFn, FMessageInstance, FMessageOptions, Type } from '@/types'
import { createVNode, render } from 'vue'
import FMessageComp from './FMessage.vue'

const GAP = 16
const BASE_OFFSET = 20

let seed = 0
const instances: FMessageActiveInstance[] = []

const normalizeOptions = (options: FMessageOptions | string): FMessageOptions => {
	return typeof options === 'string' ? { message: options } : options
}

const repositionAll = () => {
	let offset = BASE_OFFSET
	instances.forEach((item) => {
		const vm = item.vnode.component
		if (vm) {
			vm.props.offset = offset
		}
		offset += item.height + GAP
	})
}

const removeInstance = (id: number) => {
	const index = instances.findIndex((item) => item.id === id)
	if (index === -1) return
	const { container } = instances[index]!
	render(null, container)
	container.remove()
	instances.splice(index, 1)
	repositionAll()
}

const createInstance = (options: FMessageOptions): FMessageInstance => {
	const id = seed++
	const container = document.createElement('div')

	const offset =
		instances.length === 0
			? BASE_OFFSET
			: (() => {
				const last = instances[instances.length - 1]!
				return (last.vnode.component?.props.offset as number) + last.height + GAP
			})()

	const vnode = createVNode(FMessageComp, {
		...options,
		offset,
		onClose: () => {
			options.onClose?.()
		},
		onDestroy: () => {
			removeInstance(id)
		}
	})

	render(vnode, container)
	document.body.appendChild(container)

	const el = vnode.el as HTMLElement
	const height = el?.offsetHeight ?? 44

	instances.push({ id, vnode, container, height })

	return {
		id,
		close: () => {
			(vnode.component?.exposed as any)?.close?.()
		}
	}
}

const FMessage = ((options: FMessageOptions | string) => {
	return createInstance(normalizeOptions(options))
}) as FMessageFn

const withType = (type: Type) => (options: FMessageOptions | string) =>
	createInstance({ ...normalizeOptions(options), type })

FMessage.info = withType('info')
FMessage.success = withType('success')
FMessage.warning = withType('warning')
FMessage.failed = withType('failed')

FMessage.closeAll = () => {
	[...instances].forEach((item) => {
		item.vnode.component?.exposed?.close?.()
	})
}

export default FMessage
