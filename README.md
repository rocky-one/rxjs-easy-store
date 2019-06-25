# rxjs-easy-store
	
#### Installation ####
  npm install --save rxjs-easy-store



### rxjs-easy-store提供4个方法 ###
#### import { createStore, getStore, dispatch, removeStore }  from 'rxjs-easy-store' ####

#### (1) createStore(object) 用来创建一个store ####

	createStore({
	 	// store 名称 需唯一 
	    name: 'demo',
	    // 组件 state 
	    state: {
	        list: [{ name: 'XXX', id: 1 }]
	    },
	    // 处理state 生成新的state
	    reducers: {
	        getList: (action, state) => {
	            state.list = action.payload.data
	            return state
	        }
	    },
	    // 副作用处理 这里调用dispatch 
	    effect: {
			ajax('url')).subscribe(res => {
					// 发送action reducers处理生成新的state
	                dispatch({
	                    name: 'workbook',
	                    type: 'getList',
	                    payload: {
	                        data: res.value
	                    }
	                })
	            })
		}
	})



##### (2) dispatch(action) 派送一个action,注意分两种情况,参数的key值不同 #####
	
	1. payload.data 表示是一个同步过程，绕过effect直接会调用store中的reducers对应方法
 	dispatch({
        name: 'demo', // 和stote中的name对应
        type: 'getList', // 和store中的
        payload: {
            data: res.value
        }
    })
	2. payload.params 表示是一个异步过程，或者需要执行effect中方法
	dispatch({
        name: 'demo', // 和stote中的name对应
        type: 'addList', // 和store中的
        payload: {
            params: '1'
        }
    })

##### (3) getStore(name) 获取store 可以是任意模块的store(跨模块数据共享) #####

	const demoStore = getStore('demo')

##### (4) removeStore(name) 移除store 移除任意模块的store #####
	
	removeStore('demo')
	


## 在react中使用 rxjs-easy-store ##


	// demoRxStore.js
	import { createStore, dispatch}  from 'rxjs-easy-store'

	export default createStore({
	    name: 'workbook',
	    state: {
	        list: [{ name: '哈哈', id: 1 }]
	    },
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
	    effect: {
	        getList: (params) => {
	            from(ajax('url')).subscribe(res => {
	                dispatch({
	                    name: 'workbook',
	                    type: 'getList',
	                    payload: {
	                        data: res.value
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
	
	// A.jsx 一个react组件

	export default function A() {
	    const [list, setList] = useState([])
	    useEffect(() => {
			// 调用demoRxStore中getList方法
	        demoRxStore.effect.getList()
			// 订阅demoRxStore中state的变化
	        demoRxStore.state$.subscribe(store => {
	            setList(store.list)
	        })
	    }, [])
	
	    return (
	        <div>
	            <div>A模块</div>
	            {
	                list.map(item => <div key={item.id}>{item.name}</div>)
	            }
	            <button onClick={() => {
	                // 执行一个effect方法
	                demoRxStore.effect.addList({
	                    name: `${Math.random() * 1000}`,
	                    id: Math.random()
	                })
	            }}>点击</button>
	        </div>
	    )
	}
	

