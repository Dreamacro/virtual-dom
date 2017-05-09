export interface VNode {
    sel: string | undefined
    attr: Attr
    key: Key
    children: VNode[]
    el: Node | undefined
    events: {
        [key: string]: Function
    }
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
