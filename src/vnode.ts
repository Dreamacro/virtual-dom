import { VNode, Attr } from './model'
import * as util from './util'

export function el (sel: string): VNode
export function el (sel: string, text: string): VNode
export function el (sel: string, text: string, attr: Attr): VNode
export function el (sel: string, children: Array<string | VNode>): VNode
export function el (sel: string, attr: Attr, children: Array<string | VNode>): VNode
export function el (sel: string, text: any = '', attr: any = {}, children: any = []): VNode {
    if (util.isArray(text)) {
        children = text
        text = ''
    } else if (util.isObject(text)) {
        children = attr
        attr = text
        text = ''
    }

    const key = attr.key || sel
    delete attr.key

    return {
        sel,
        attr,
        children,
        text,
        key,
        el: undefined
    }
}

