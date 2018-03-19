import { Patchs, VNode, Index, Attr } from './model'
import { render, destroy } from './index'
import * as DOMAPI from './dom'
import * as util from './util'

export function patch (oldVNode: VNode, newVNode: VNode) {
    if (!sameVNode(newVNode, oldVNode)) {
        newVNode.el = render(newVNode)
        if (oldVNode.el.parentNode) {
            oldVNode.el.parentNode.replaceChild(newVNode.el, oldVNode.el)
        }
        return
    }
    const el = oldVNode.el as HTMLElement

    // patch props
    const newAttr = newVNode.attr
    const oldAttr = oldVNode.attr
    const set = new Set([
        ...Object.keys(newAttr),
        ...Object.keys(oldAttr)
    ])
    for (const key of set) {
        if (!newAttr[key]) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, newAttr[key])
        }
    }

    // patch events
    const newEvents = newVNode.events
    const oldEvents = oldVNode.events
    const eventsSet = new Set([
        ...Object.keys(newEvents),
        ...Object.keys(oldEvents)
    ])
    for (const key of eventsSet) {
        if (!oldEvents[key]) {
            el.addEventListener(key, newEvents[key] as EventListener)
        } else if (!newEvents[key]) {
            el.removeEventListener(key, oldEvents[key] as EventListener)
        } else {
            el.removeEventListener(key, oldEvents[key] as EventListener)
            el.addEventListener(key, newEvents[key] as EventListener)
        }
    }

    newVNode.el = el
    // patch children
    patchChild(newVNode.children, oldVNode.children, oldVNode.el)
}

function patchChild(newCh: VNode[], oldCh: VNode[], parentElm: Node) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newEndIdx = newCh.length - 1
    let oldStartNode = oldCh[0]
    let newStartNode = newCh[0]
    let oldEndNode = oldCh[oldEndIdx]
    let newEndNode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!oldStartNode) {
            oldStartNode = oldCh[++oldStartIdx]
        } else if (!oldEndNode) {
            oldEndNode = oldCh[--oldEndIdx]
        } else if (sameVNode(newStartNode, oldStartNode)) {
            patch(oldStartNode, newStartNode)
            newStartNode = newCh[++newStartIdx]
            oldStartNode = oldCh[++oldStartIdx]
        } else if (sameVNode(newEndNode, oldEndNode)) {
            patch(oldEndNode, newEndNode)
            newEndNode = newCh[--newEndIdx]
            oldEndNode = oldCh[--oldEndIdx]
        } else if (sameVNode(newStartNode, oldEndNode)) {
            patch(oldEndNode, newStartNode)
            parentElm.insertBefore(oldEndNode.el, oldStartNode.el)
            newStartNode = newCh[++newStartIdx]
            oldEndNode = oldCh[--oldEndIdx]
        } else if (sameVNode(newEndNode, oldStartNode)) {
            patch(oldStartNode, newEndNode)
            parentElm.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling)
            newEndNode = newCh[--newEndIdx]
            oldStartNode = oldCh[++oldStartIdx]
        } else {
            if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldCh(oldCh, oldStartIdx, oldEndIdx)
            idxInOld = newStartNode.key
                ? oldKeyToIdx[newStartNode.key]
                : findIdxInOld(newStartNode, oldCh, oldStartIdx, oldEndIdx)
            if (!idxInOld) {
                newStartNode.el = render(newStartNode)
                insert(parentElm, newStartNode.el, oldStartNode.el)
            } else {
                const vnodeToMove = oldCh[idxInOld]
                if (sameVNode(newStartNode, vnodeToMove)) {
                    patch(vnodeToMove, newStartNode)
                    oldCh[idxInOld] = undefined
                    parentElm.insertBefore(vnodeToMove.el, oldStartNode.el)
                } else {
                    newStartNode.el = render(newStartNode)
                    insert(parentElm, newStartNode.el, oldStartNode.el)
                }
            }
            newStartNode = newCh[++newStartIdx]
        }
    }
    if (oldStartIdx > oldEndIdx) {
        const refElm = !newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].el
        addVNodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
        removeNodes(oldCh, oldStartIdx, oldEndIdx)
    }
}

function sameVNode (node1: VNode, node2: VNode) {
    return node1.sel === node2.sel && node1.key === node2.key
}

function createKeyToOldCh(oldCh: VNode[], start, end: number) {
    const map = {}
    for (let i = start; i <= end; i++) {
        const key = oldCh[i].key
        if (key) map[key] = i
    }
    return map
  }

function findIdxInOld(node: VNode, oldCh: VNode[], start, end: number) {
    for (let i = start; i <= end; i++) {
        const n = oldCh[i]
        if (n && sameVNode(node, n)) return i
    }
}

function insert(parent: Node, elm: Node, ref: Node) {
    if (parent) {
        if (ref) {
            if (ref.parentNode === parent) {
                parent.insertBefore(elm, ref)
            }
        } else {
            parent.appendChild(elm)
        }
    }
  }

function removeNodes(oldCh: Array<VNode>, start: number, end: number) {
    for (let i = start; i <= end; i++) {
        if (oldCh[i]) removeNode(oldCh[i].el)
    }
}

function removeNode(el: Node) {
    const parentElm = el.parentNode
    if (parentElm) {
        parentElm.removeChild(el)
    }
}

function addVNodes(parentElm: Node, refElm: Node, VNodes: Array<VNode>, start: number, end: number) {
    for (let i = start; i <= end; i++) {
        const el = render(VNodes[i])
        parentElm.insertBefore(el, refElm)
    }
}
