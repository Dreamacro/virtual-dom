import { VNode } from './model'
import * as DOMAPI from './dom'
import * as util from './util'

export { h } from './vnode'
export { diff } from './diff'
export { patch } from './patch'
export * from './model'

// init element after render
export function init (vnode: VNode) {
    if (!vnode.el) {
        throw Error('VNode not render')
    }

    for (let event of Object.keys(vnode.events)) {
        vnode.el.addEventListener(event, vnode.events[event] as EventListener)
    }
}

export function destroy (vnode: VNode) {
    if (!vnode.el) {
        throw Error('VNode not render')
    }

    for (let event of Object.keys(vnode.events)) {
        vnode.el.removeEventListener(event, vnode.events[event] as EventListener)
    }
}

export function render (vnode: VNode): Node {
    if (vnode.el) {
        return vnode.el
    }

    if (vnode.sel === undefined) {
        const textNode = DOMAPI.createTextNode(vnode.text.toString())
        vnode.el = textNode
        return textNode
    }

    const el = DOMAPI.createElement(vnode.sel) as HTMLElement

    const attrs = Object.keys(vnode.attr)
    attrs.forEach(key => el.setAttribute(key, vnode.attr[key]))

    if (vnode.text) {
        el.textContent = vnode.text
    }

    // generator children
    for (let child of vnode.children) {
        el.appendChild(render(child))
    }

    // fix el
    vnode.el = el
    init(vnode)

    return el
}
