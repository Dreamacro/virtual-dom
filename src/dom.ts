export function createElement (tag: string): HTMLElement {
    return document.createElement(tag)
}

export function createTextNode (s: string): Text {
    return document.createTextNode(s)
}

export function isTextNode (node: Node) {
    return node.nodeType === 3
}
