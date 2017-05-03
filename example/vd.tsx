import { h, dom, diff, patch, VNode } from '../src/index'

interface Config {
    sel: string
    data: () => Object,
    render: () => VNode,
    init?: () => void
}

function DDRender ({data: dataFn, render, sel, init = function () {}}: Config) {
    const data = dataFn()
    const el = document.querySelector(sel)
    const keys = Object.keys(data)
    const warp = {}
    const genVNode = render.bind(warp)

    Object.defineProperties(
        warp,
        keys.reduce((obj, key) => {
            obj[key] = {
                get () { return data[key] },
                set (val) {
                    data[key] = val
                    reRender()
                }
            }
            return obj
        }, {})
    )

    const vnode = genVNode()
    function reRender () {
        const newVNode = genVNode()
        const df = diff(vnode, newVNode)
        patch(vnode, df)
    }
    this.$data = warp
    el.appendChild(h(vnode))
    init.call(warp)
}

const app = new DDRender({
    sel: 'body',
    data () {
        return {
            data: []
        }
    },
    init () {
        let count = 0
        const data = [1, 4, 9, 16]
        setInterval(() => {
            this.data = [count++, ...data].sort((a, b) => a - b)
        }, 1000)
    },
    render () {
        const lis = this.data.map(
            (v, i) => <li key={i.toString()}>{v.toString()}</li>
        )
        return (
            <ul>
                { lis }
            </ul>
        )
    }
})
