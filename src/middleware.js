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
    action,
    reducer,
    curState,
    subject
} = {}) => {
    const midParams = {
        getState,
    }
    const suspens = action.suspens
    const chain = middlewares.map(middleware => middleware(midParams))
    const enhanceReducer = compose(...chain)((act, curState) => reducer(act, curState))
    enhanceReducer(action, curState)
    if (!suspens) {
        subject.next()
    }
}