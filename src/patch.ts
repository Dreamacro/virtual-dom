import { Patchs, VNode, Index, Attr } from './model'
import { render, destroy, init } from './index'
import * as DOMAPI from './dom'
import * as util from './util'

export function patch (vnode: VNode, patchs: Patchs) {
    dfs (vnode, patchs, { idx: -1 })
}

function dfs (vnode: VNode, patchs: Patchs, index: Index) {
    index.idx++
    
    if (!vnode.el) {
        vnode.el = render(vnode)
    }

    const currPatch = patchs[index.idx]
    dfsChild(vnode.children, patchs, index)
    if (!currPatch) {
        return
    }
    for (let patch of currPatch) {
        switch (patch.type) {
            case "REPLACE":
                const newNode = patch.payload as VNode
                if (!newNode.el) {
                    newNode.el = render(newNode)
                    init(newNode)
                }
                if (vnode.el.parentNode) {
                    vnode.el.parentNode.replaceChild(newNode.el, vnode.el)
                }
                VNodeCopy(vnode, newNode)
                break
            case "REORDER":
                const moves = patch.payload as Array<any>
                for (let move of moves) {
                    const node = vnode.children[move.index]
                    if (move.type === 0) {
                        // remove
                        destroy(node)
                        vnode.el.removeChild(node.el) 
                        vnode.children.splice(move.index, 1)
                    } else {
                        // insert new
                        if (!move.item.el) {
                            move.item.el = render(move.item)
                            init(move.item)
                        }
                        vnode.el.insertBefore(move.item.el, node ? node.el : null)
                        vnode.children.splice(move.index, 0, move.item)
                    }
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

function VNodeCopy (oldNode: VNode, newNode: VNode) {
    for (let key of Object.keys(oldNode)) {
        oldNode[key] = newNode[key]
    }
}
