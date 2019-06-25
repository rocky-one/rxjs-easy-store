import { BehaviorSubject, queueScheduler, Observable, concat, isObservable, of } from 'rxjs'
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, concatMap, delay } from 'rxjs/operators';


// source
//   .pipe(
//     // 只是为了确保 meregeMap 的日志晚于 concatMap 示例
//     delay(5000),
//     mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
//   )
//   .subscribe(val => console.log(`With mergeMap: ${val}`));
// const log = console.log;
// queueScheduler.schedule(() => {
//     setTimeout(() => {
//         log(1)
//     },12)
// });
// log(2);
// queueScheduler.schedule(() => log(3));

const getUsers = ajax({
    url: 'https://httpbin.org/delay/2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs'
    },
    body: [{ name: '哈哈', id: 1 }, { name: '哈哈2', id: 2 }]
})




class StoreFactory {
    constructor(state$, option) {
        this.name = option.name
        this.state = option.state || {}
        this.state$ = state$
        this.reducers = option.reducers
        this.effect = option.effect
    }
    runReducer = (action) => {
        this.state = this.reducers[action.type](action, this.state)
        this.state$.next(this.state)
    }
    runEffect = (action) => {
        this.effect[action.type](action.payload.params)
    }

}

class modelMap {
    constructor(option) {
        this.modelMap = {}
    }
    add = (modelName, store) => {
        if (this.modelMap[modelName]) {
            throw 'Template name already exists'
        }
        this.modelMap[modelName] = store
    }
    getModelMap = () => {
        return this.modelMap
    }
    getModelState = (modelName) => {
        if (this.modelMap[modelName]) {
            return this.modelMap[modelName].state
        }
        return null
    }
}
const mIns = new modelMap()

export const creatStore = (model) => {
    const state$ = new BehaviorSubject(model.state)
    const store = new StoreFactory(state$, model)
    mIns.add(model.name, store)
    return {
        state$,
        model: {
            effect: store.effect
        }
    }
}

export function dispatch(action) {
    if (action.payload.hasOwnProperty('data')) {
        mIns.modelMap[action.name]['runReducer'](action, mIns.getModelState(action.name))
    } else {
        mIns.modelMap[action.name]['runEffect'](action, mIns.getModelState(action.name))
    }
}

export function getState(storeName) {
    return mIns.getModelState(storeName)
}

export const storeA = creatStore({
    // store 名称 需唯一
    name: 'workbook',
    // 组件 state 
    state: {
        list: [{ name: '咕噜', id: 3 }]
    },
    // 处理state 生成新的state
    reducers: {
        getList: (action, state) => {
            state.list = action.payload.data
            return state
        },
        addList: (action, state) => {
            state.list.push(action.payload.data)
            return state
        }
    },
    // 副作用处理
    effect: {
        getList: (params) => {
            getUsers.subscribe(res => {
                dispatch({
                    name: 'workbook',
                    type: 'getList',
                    payload: {
                        data: JSON.parse(res.response.data)
                    }
                })
            })
        },
        addList: (params) => {
            dispatch({
                name: 'workbook',
                type: 'addList',
                payload: {
                    data: params
                }
            })
        }
    }
})