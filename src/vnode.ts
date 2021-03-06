import { VNode, Attr } from './model'
import * as util from './util'

function flat (arr: any) {
    const ret = []
    for (let item of arr) {
        util.isArray(item)
            ? ret.push(...item)
            : ret.push(item)
    }
    return ret
}

export function h (sel: string, attr: Attr | null, ...children: Array<string | VNode>): VNode {
    if (attr === null) {
        attr = {}
    }

    const key = attr.key || sel
    delete attr.key

    const events = {}
    for (let key of Object.keys(attr)) {
        // e.g. onClick
        if (/^on[A-Z][A-Za-z]+$/.test(key)) {
            const eventName = key.substring(2).toLowerCase()
            events[eventName] = attr[key]
            delete attr[key]
        }
    }

    children = flat(children).map(
        c => util.isString(c)
            ? {key: c, children: [], attr: {}, text: c, events: {}}
            : c
    )

    return {
        sel,
        attr,
        children: children as VNode[],
        key,
        events,
        el: undefined
    }
}
