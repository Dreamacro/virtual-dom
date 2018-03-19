import { render as r, h, patch, VNode } from '../src/index'

interface Config {
    sel: string
    data: () => Object,
    render: () => VNode,
    init?: () => void
}

function DDRender ({data: dataFn, render, sel, init = function () {}}: Config) {
    const data = dataFn()
    this.$data = Object.create(null)
    this._genVNode = render.bind(this.$data)
    const ctx = this

    const keys = Object.keys(data)
    Object.defineProperties(
        this.$data,
        keys.reduce((obj, key) => {
            obj[key] = {
                get () { return data[key] },
                set (val) {
                    data[key] = val
                    ctx._reRender()
                }
            }
            return obj
        }, {})
    )

    this.$vnode = this._genVNode()
    this.$el = r(this.$vnode)
    init.call(this.$data)
}

DDRender.prototype._reRender = function () {
    const newVNode = this._genVNode()
    patch(this.$vnode, newVNode)
    this.$vnode = newVNode
}

const randonRange = (s, e) => Math.floor(Math.random() * (e - s)) + s

const app = new DDRender({
    sel: 'body',
    data () {
        return {
            data: [1, 4, 9, 16]
        }
    },
    init () {
        setInterval(() => {
            this.data[randonRange(0, 3)]++
            this.data = [...this.data]
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

document.body.appendChild(app.$el)
