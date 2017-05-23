import { h, VNode, render } from '../src/index'

describe('hyperscript and render', () => {
    it('should return tag', () => {
        const vnode = (
            <div></div>
        ) as VNode

        const el = render(vnode)
        expect(vnode.sel).toBe('div')
        expect(el.nodeName.toLowerCase()).toBe('div')
    })

    it('should have attributes', () => {
        const vnode = (
            <div id="foo"></div>
        ) as VNode

        const el = render(vnode) as HTMLElement
        expect(vnode.attr['id']).toBe('foo')
        expect(el.getAttribute('id')).toBe('foo')
    })

    it('should have custom key', () => {
        const vnode = (
            <div key="key"></div>
        ) as VNode

        expect(vnode.key).toBe('key')
    })

    it('should create child', () => {
        const vnode = (
            <div>
                <span></span>
                <p></p>
            </div>
        ) as VNode

        const el = render(vnode) as HTMLElement
        expect(vnode.sel).toBe('div')
        expect(vnode.children[0].sel).toBe('span')
        expect(vnode.children[1].sel).toBe('p')
        expect(el.nodeName.toLowerCase()).toBe('div')
        expect(el.childNodes[0].nodeName.toLowerCase()).toBe('span')
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('p')
    })

    it('should create text node child', () => {
        const vnode = (
            <div>
                text node
            </div>
        ) as VNode

        const el = render(vnode)
        expect(vnode.sel).toBe('div')
        expect(vnode.children[0].text).toBe('text node')
        expect(el.nodeName.toLowerCase()).toBe('div')        
        expect(el.childNodes[0].nodeType).toBe(3)
    })

    it('should create text node child with other vnode', () => {
        const vnode = (
            <div>
                text node
                <p></p>
            </div>
        ) as VNode

        const el = render(vnode)
        expect(vnode.sel).toBe('div')
        expect(vnode.children[0].text).toBe('text node')
        expect(vnode.children[1].sel).toBe('p')
        expect(el.nodeName.toLowerCase()).toBe('div')
        expect(el.childNodes[0].nodeType).toBe(3)
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('p')
    })
})
