export interface VNode {
    sel: string | undefined
    attr?: Object
    key: Key
    children: Array<VNode | string>
    el: Node | undefined
    text: string
}

export interface Attr {
    [key: string]: string
}

export interface Patch {
    index: number
    type: 'REPLACE' | 'TEXT' | 'PROPS' | 'REORDER',
    payload: VNode | string | Object | Array<{}>
}

export type Key = string | number

export interface Index {
    idx: number
}
