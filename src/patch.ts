import { Patchs, VNode, Index, Attr } from './model'
import { h } from './index'
import * as DOMAPI from './dom'
import * as util from './util'

export function patch (vnode: VNode, patchs: Patchs) {
    dfs (vnode, patchs, { idx: -1 })
}

function dfs (vnode: VNode, patchs: Patchs, index: Index) {
    index.idx++

    if (!vnode.el) {
        vnode.el = h(vnode)
    }

    if (DOMAPI.isTextNode(vnode.el)) {
        return
    }

    const currPatch = patchs[index.idx]
    dfsChild(vnode.children as VNode[], patchs, index)
    for (let patch of currPatch) {
        switch (patch.type) {
            case "REORDER":
                const moves = patch.payload as Array<{}>
                const back = Array.from(vnode.children)
                moves.forEach((move: any) => {
                    const node = vnode.children[move.index] as VNode
                    if (move.type === 0) {
                        // remove
                        if (back[move.index] === node) {
                            vnode.el.removeChild(node.el) 
                        }
                        vnode.children.splice(move.index, 1)
                    } else {
                        // insert new
                        move.item.el = h(move.item)
                        vnode.children.splice(move.index, 0, move.item)
                        vnode.el.insertBefore(move.item.el, node ? node.el : null) 
                    }
                })
                break
            case "REPLACE":
                const newNode = patch.payload as VNode
                if (!newNode.el) {
                    newNode.el = h(newNode)
                }
                vnode.el.parentNode.replaceChild(newNode.el, vnode.el)
                break
            case "TEXT":
                const newText = patch.payload as string
                if (vnode.el.textContent) {
                    vnode.el.textContent = newText
                } else {
                    vnode.el.nodeValue = newText
                }
                break 
            case "PROPS":
                const newAttr = patch.payload as Attr
                const oldAttr = vnode.attr
                const set = new Set([
                    ...Object.keys(newAttr),
                    ...Object.keys(oldAttr)
                ])
                const el = vnode.el as HTMLElement
                for (let key of set) {
                    if (!newAttr[key]) {
                        el.removeAttribute(key)
                    } else {
                        el.setAttribute(key, newAttr[key])
                    }
                }
                break 
        }
    }    
}

function dfsChild (children: VNode[], patchs: Patchs, index: Index) {
    for (let child of children) {
        dfs(child, patchs, index)
    }
}
