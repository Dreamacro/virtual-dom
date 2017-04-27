import { h, el, diff, patch } from '../src/index'

const lis = Array.from({length: 10}).map((_, i) => el('li', i.toString(), { key: i }))

const root = el('div', { class: 'test' }, [
    el('p', 'p'),
    el('ul', Array.from(lis)),
    el('a', 'link' as string, { class: 'link', href: '/#test' })
])

const newlis = Array.from(lis)

;[newlis[9], newlis[8]] = [newlis[8], newlis[9]]


const newNode = el('div', { class: 'test' }, [
    el('div', [ el('span', 'p') ]),
    el('ul', newlis),
    el('a', 'link', { class: 'link', href: '/#test' })
])

const app = h(root)

const df = diff(root, newNode)

// console.log(JSON.stringify(df, null, 4))

setTimeout(() => {
    patch(root, df)
}, 1000)

document.body.appendChild(app)
