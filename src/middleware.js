import { dispatch, mIns } from './index'
import { compose } from './utils';

class Middlewares {
    constructor() {
        this.middleware = []
    }
    getMiddleware = () => {
        return this.middleware
    }
    addMiddleware = (mid = []) => {
        this.middleware = mid
    }
}

export const middlewareIns = new Middlewares()

export const registerMiddleware = (middleware = []) => {
    middlewareIns.addMiddleware(middleware)
}

export const applyMiddleware = ({
    middlewares,
    getState,
    reducer,
} = {}) => {
    const midParams = {
        getState,
    }
    const chain = middlewares.map(middleware => middleware(midParams))
    return compose(...chain)(reducer)

}