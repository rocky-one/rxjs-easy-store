const hasOwn = Object.prototype.hasOwnProperty

function isShallow(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    } else {
        return x !== x && y !== y
    }
}

export function shallowEqual(objA, objB) {
    if (isShallow(objA, objB)) return true

    if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) return false

    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(objB, keysA[i]) || !isShallow(objA[keysA[i]], objB[keysA[i]])) {
            return false
        }
    }

    return true
}

export function defer(callback) {
    return Promise.resolve().then(callback)
}

export function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// export function deepEqual(objA, objB) {
//     return is(fromJS(objA), fromJS(objB))
// }

function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
}
export function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj)) {
        return obj
    }
    if (hash.has(obj)) return hash.get(obj)
    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [] : {}
    hash.set(obj, cloneObj)
    let result = Object.keys(obj).map(key => {
        return {
            [key]: deepClone(obj[key], hash)
        }
    })
    return Object.assign(cloneObj, ...result)
}
