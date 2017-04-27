export function isString (s) {
    return typeof s === 'string'
}

export function isArray (arr) {
    return Array.isArray(arr)
}

export function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
