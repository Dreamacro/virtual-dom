import { VNode } from './model'
import * as DOMAPI from './dom'
import * as util from './util'

export { dom } from './vnode'
export { diff } from './diff'
export { patch } from './patch'
export * from './model'
export function h (vnode: VNode): Node {
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
        el.appendChild(h(child as VNode))
    }

    // fix el
    vnode.el = el

    return el
}
