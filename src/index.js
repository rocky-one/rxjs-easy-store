import { BehaviorSubject } from "rxjs";

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
    this.effects[action.type](action.payload.params);
  };
}

class modelMap {
  constructor(option) {
    this.modelMap = {};
  }
  add = (modelName, store) => {
    if (this.modelMap[modelName]) {
      throw "Template name already exists";
    }
    this.modelMap[modelName] = store;
  };
  remove = modelName => {
    if (this.modelMap[modelName]) {
      this.modelMap[modelName] = null;
	  delete this.modelMap[modelName];
	  return true
	}
	return false
  };
  getModelMap = () => {
    return this.modelMap;
  };
  getModelState = modelName => {
    if (this.modelMap[modelName]) {
      return this.modelMap[modelName].state;
    }
    return null;
  };
}

const mIns = new modelMap();

export const createStore = model => {
  const state$ = new BehaviorSubject(model.state);
  const store = new StoreFactory(state$, model);
  mIns.add(model.name, store);
  return {
    state$,
    effects: store.effects
  };
};

export const removeStore = modelName => {
  return mIns.remove(modelName);
};

export function dispatch(action) {
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

export function getStore(storeName) {
  return mIns.getModelState(storeName);
}
