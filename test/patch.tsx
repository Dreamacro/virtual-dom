import { h, VNode, render, diff, patch } from '../src/index'

describe('diff and patch', () => {
    it('can replace root element', () => {
        const vnode = (
            <div></div>
        ) as VNode
        const newNode = (
            <p></p>
        ) as VNode

        const el = render(vnode)
        expect(el.nodeName.toLowerCase()).toBe('div')

        const df = diff(vnode, newNode)
        patch(vnode, df)
        const newEl = vnode.el
        expect(newEl.nodeName.toLowerCase()).toBe('p')
    })

    it('can replace root element with children and attributes', () => {
        const vnode = (
            <div class="div"></div>
        ) as VNode
        const newNode = (
            <ul class="ul" key="key">
                <li class="li"></li>
                <li class="li"></li>
            </ul>
        ) as VNode

        const el = render(vnode)
        expect(el.nodeName.toLowerCase()).toBe('div')

        const df = diff(vnode, newNode)
        patch(vnode, df)
        const newEl = vnode.el
        expect(newEl.nodeName.toLowerCase()).toBe('ul')
        expect(newEl.childNodes.length).toBe(2)
        expect(vnode).toEqual(newNode)
    })

    it('can patch attributes', () => {
        const vnode = (
            <div class="div" draggable="true"></div>
        ) as VNode
        const newNode = (
            <div class="new-div" id="div"></div>
        ) as VNode

        const el = render(vnode)
        const df = diff(vnode, newNode)
        patch(vnode, df)

        const newEl = vnode.el as HTMLElement
        expect(newEl.getAttribute('class')).toBe('new-div')
        expect(newEl.getAttribute('id')).toBe('div')
        expect(newEl.hasAttribute('draggable')).toBeFalsy()
    })

    it('can remove some elements', () => {
        const vnode = (
            <div>
                <p></p>
                <span></span>
                <ul></ul>
                <a href="/"></a>
            </div>
        ) as VNode
        const newNode = (
            <div>
                <p></p>
                <ul></ul>
            </div>
        ) as VNode

        const el = render(vnode)
        expect(el.childNodes.length).toBe(4)
        expect(el.childNodes[0].nodeName.toLowerCase()).toBe('p')
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('span')
        expect(el.childNodes[2].nodeName.toLowerCase()).toBe('ul')
        expect(el.childNodes[3].nodeName.toLowerCase()).toBe('a')

        const df = diff(vnode, newNode)
        patch(vnode, df)

        const newEl = vnode.el
        expect(el.childNodes.length).toBe(2)
        expect(el.childNodes[0].nodeName.toLowerCase()).toBe('p')
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('ul')
    })

    it('can reorder elements', () => {
        const vnode = (
            <div>
                <p></p>
                <span></span>
                <ul></ul>
                <a href="/"></a>
            </div>
        ) as VNode
        const newNode = (
            <div>
                <span></span>
                <p></p>
                <a href="/"></a>
                <ul></ul>
            </div>
        ) as VNode

        const el = render(vnode)
        expect(el.childNodes.length).toBe(4)
        expect(el.childNodes[0].nodeName.toLowerCase()).toBe('p')
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('span')
        expect(el.childNodes[2].nodeName.toLowerCase()).toBe('ul')
        expect(el.childNodes[3].nodeName.toLowerCase()).toBe('a')

        const df = diff(vnode, newNode)
        patch(vnode, df)

        const newEl = vnode.el
        expect(el.childNodes.length).toBe(4)
        expect(el.childNodes[0].nodeName.toLowerCase()).toBe('span')
        expect(el.childNodes[1].nodeName.toLowerCase()).toBe('p')
        expect(el.childNodes[2].nodeName.toLowerCase()).toBe('a')
        expect(el.childNodes[3].nodeName.toLowerCase()).toBe('ul')
    })

    it('can replace a element with same key but different sel', () => {
        const vnode = (
            <ul>
                <li key={1}></li>
                <li key={2}></li>
                <li key={3}></li>
            </ul>
        ) as VNode
        const newNode = (
            <ul>
                <li key={1}></li>
                <span key={2}></span>
                <li key={3}></li>
            </ul>
        ) as VNode

        const el = render(vnode)
        const df = diff(vnode, newNode)
        patch(vnode, df)

        const newEl = vnode.el
        expect(newEl.childNodes[1].nodeName.toLowerCase()).toBe('span')
    })

    it('can reverse elements', () => {
        const arr = Array.from({length: 3}).map((_, i) => i)
        const vnode = (
            <ul>
                { arr.map(i => <li key={i}>{i.toString()}</li>) }
            </ul>
        ) as VNode
        const newNode = (
            <ul>
                { arr.map(i => <li key={i}>{i.toString()}</li>).reverse() }
            </ul>
        ) as VNode

        const el = render(vnode)
        const df = diff(vnode, newNode)
        patch(vnode, df)

        const newEl = vnode.el
        const reverseChild = Array.from(newEl.childNodes).map(el => parseInt(el.textContent))
        expect(reverseChild).toEqual(arr.reverse())
    })
})