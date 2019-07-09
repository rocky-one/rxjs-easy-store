import { Subject } from "rxjs"
import storeHOC from './storeHOC'
import { defer } from './utils'

class StoreFactory {
    // state$,
    constructor(option) {
        this.name = option.name;
        this.state = option.state || {};
        // this.state$ = state$;
        this.queue = []
        this.reducers = option.reducers;
        this.effects = option.effects;
        this.subject = new Subject();
    }

    getObservable = () => {
        return this.subject
    }
    flush = () => {
        let qLen = this.queue.length,
            suspensLen = 0,
            callbacks = [],
            q

        while (q = this.queue.shift()) {
            q.reducer(q.action, this.state)
            q.callback && callbacks.push(q.callback)
            if (q.suspens) {
                suspensLen++
            }
        }
        if (suspensLen != qLen) {
            this.subject.next({
                // state: this.state,
                callbacks
            })
        }
    }
    runReducer = (action, callback) => {
        const reducer = this.reducers[action.type]
        if (reducer && typeof reducer === 'function') {
            // this.state = reducer(action, this.state);
            if (this.queue.length === 0) {
                defer(this.flush)
            }
            this.queue.push({
                reducer,
                action,
                callback
            })
        } else {
            throw new Error('effects[action.type] not a function')
        }
    };
    runEffect = action => {
        const effect = this.effects[action.type]
        if (effect && typeof effect === 'function') {
            return effect(action, this.state)
        } else {
            throw new Error('effects[action.type] not a function')
        }
    };
}

class modelMap {
    constructor() {
        this.modelMap = {}
        this.storeRoot = {}
        this.storeRoot$ = {}
    }
    add = (modelName, store, store$) => {
        // if (this.modelMap[modelName]) {
        //   throw "Template name already exists";
        // }
        this.storeRoot[modelName] = store.state
        this.storeRoot$[modelName] = store$
        this.modelMap[modelName] = store;
    }
    remove = modelName => {
        if (this.modelMap[modelName]) {
            this.modelMap[modelName] = null;
            delete this.modelMap[modelName];
            return true
        }
        return false
    }
    getModelMap = () => {
        return this.modelMap;
    }
    getModelState = modelName => {
        if (this.modelMap[modelName]) {
            return this.modelMap[modelName].state;
        }
        return null;
    }
    getModelState$ = modelName => {
        if (this.storeRoot$[modelName]) {
            return this.storeRoot$[modelName];
        }
        return null;
    }
    getStoreRoot = () => {
        return this.storeRoot
    }
}

export const mIns = new modelMap();

export const createStore = model => {
    // const state$ = new BehaviorSubject(model.state);
    // state$, 
    const store = new StoreFactory(model);
    mIns.add(model.name, store, store.getObservable());
    return {
        state$: store.getObservable(),
        effects: store.effects
    };
};

export const removeStore = modelName => {
    return mIns.remove(modelName);
};

export const dispatch = (action, callback) => {
    if (action.payload.hasOwnProperty("data")) {
        mIns.modelMap[action.name]["runReducer"](action, callback)
    } else {
        const res = mIns.modelMap[action.name]["runEffect"](action)
        if (res) {
            return res
        }
    }
}

export const getStore = (storeName) => {
    return mIns.getModelState(storeName);
}

export const inject = (mapStateToProps, option) => Com => storeHOC(Com, mapStateToProps, option)
