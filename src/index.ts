import { VNode } from './model'
import * as DOMAPI from './dom'
import * as util from './util'

export { el } from './vnode'
export { diff } from './diff'
export { patch } from './patch'
export function h (vnode: VNode): Node {
    if (vnode.el) {
        return vnode.el
    }

    if (vnode.sel === undefined) {
        const textNode = DOMAPI.createTextNode(vnode.text)
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
    for (let i = 0; i < vnode.children.length; i ++) {
        if (util.isString(vnode.children[i])) {
            vnode.children[i] = {
                sel: undefined,
                key: vnode.children[i],
                el: undefined,
                text: vnode.children[i]
            } as VNode
        }
        const child = vnode.children[i] as VNode
        el.appendChild(h(child))
    }

    // fix el
    vnode.el = el

    return el
}
