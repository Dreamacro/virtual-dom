import { h, dom, diff, patch } from '../src/index'

const lis = Array.from({length: 10}).map(
    (_, i) => <li key={i.toString()}>{i.toString()}</li>
)

const root = (
    <div class="test">
        123
        <p>p</p>
        <ul>
            { lis }
        </ul>
        <a href="/#test" class="link"></a>
    </div>
)

const newNode = list => (
    <div class="container">
        456
        <div>
            <span>p1</span>
        </div>
        <a href="/#test1" class="link"></a>
        <ul class="ul">
            { list }
        </ul>
    </div>
)

const app = h(root)

const newlis = Array.from(lis)
;[newlis[9], newlis[8]] = [newlis[8], newlis[9]]
const df = diff(root, newNode(newlis))
patch(root, df)
// console.log(JSON.stringify(df, null, 4))

let count = 0
const l = Array.from({length: 4}).map((_, i) => i*i)

setInterval(() => {
    const list = [count++, ...l]
        .sort((a, b) => a - b)
        .map((v, i) => <li key={i.toString()}>{v.toString()}</li>)
    const df = diff(root, newNode(list))
    patch(root, df)
}, 1000)

document.body.appendChild(app)
