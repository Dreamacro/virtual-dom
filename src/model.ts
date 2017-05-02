export interface VNode {
    sel: string | undefined
    attr: Attr
    key: Key
    children: Array<VNode | string>
    el: Node | undefined
    text?: string
}

export interface Attr {
    [key: string]: string
}

export interface Patch {
    index: number
    type: 'REPLACE' | 'PROPS' | 'REORDER',
    payload: VNode | Attr | Object[]
}

export interface Patchs {
    [key: string]: Patch[]
}

export type Key = string | number

export interface Index {
    idx: number
}
