import { h, VNode, render, patch } from '../src/index'

describe('event', () => {
    it('can emit click event handler', () => {
        const ret = []
        const click = e => ret.push(e)
        const vnode = (
            <div onClick={click}></div>
        ) as VNode

        const el = render(vnode) as HTMLElement
        el.click()
        expect(ret.length).toBe(1)
    })

    it('can detach click event handler when vnode update', () => {
        const ret = []
        const click = e => ret.push(e)
        const vnode = (
            <div onClick={click}></div>
        ) as VNode
        const newNode = (
            <div></div>
        ) as VNode

        const el = render(vnode) as HTMLElement
        el.click()
        expect(ret.length).toBe(1)

        patch(vnode, newNode)
        const newEL = vnode.el as HTMLElement
        newEL.click()
        expect(ret.length).toBe(1)        
    })

    it('can share handler in parent and child nodes', () => {
        const ret = []
        const click = (e: Event) => ret.push(e) && e.stopPropagation()
        const vnode = (
            <div onClick={click}>
                <div onClick={click}></div>
            </div>
        ) as VNode

        const el = render(vnode) as HTMLElement
        el.click()
        ;(el.firstChild as HTMLElement).click()
        expect(ret.length).toBe(2)        
    })
})