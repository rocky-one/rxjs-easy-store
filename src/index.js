import { BehaviorSubject } from "rxjs"
import storeHOC from './storeHOC'

class StoreFactory {
    constructor(state$, option) {
        this.name = option.name;
        this.state = option.state || {};
        this.state$ = state$;
        this.reducers = option.reducers;
        this.effects = option.effects;
    }
    runReducer = action => {
        this.state = this.reducers[action.type](action, this.state);
        this.state$.next(this.state);
    };
    runEffect = action => {
        this.effects[action.type](action);//.payload.params
    };
}

class modelMap {
    constructor(option) {
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
    const state$ = new BehaviorSubject(model.state);
    const store = new StoreFactory(state$, model);
    mIns.add(model.name, store, state$);
    return {
        state$,
        effects: store.effects
    };
};

export const removeStore = modelName => {
    return mIns.remove(modelName);
};

export const dispatch = (action) => {
    if (action.payload.hasOwnProperty("data")) {
        mIns.modelMap[action.name]["runReducer"](
            action,
            mIns.getModelState(action.name)
        );
    } else {
        mIns.modelMap[action.name]["runEffect"](
            action,
            mIns.getModelState(action.name)
        );
    }
}

export const getStore = (storeName) => {
    return mIns.getModelState(storeName);
}


export const inject = (mapStateToProps, option) => Com => storeHOC(Com, mapStateToProps, option)
